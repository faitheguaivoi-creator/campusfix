<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreLostFoundContactRequest;
use App\Http\Requests\StoreLostFoundRequest;
use App\Http\Requests\UpdateLostFoundContactRequest;
use App\Http\Requests\UpdateLostFoundRequest;
use App\Http\Resources\LostFoundContactResource;
use App\Http\Resources\LostFoundItemResource;
use App\Models\LostFoundContact;
use App\Models\LostFoundItem;
use App\Services\ImageUploadService;
use App\Services\ReferenceGenerator;
use Illuminate\Http\Request;

class LostFoundController extends Controller
{
    public function index(Request $request)
    {
        $query = LostFoundItem::with(['category', 'location', 'department', 'user'])
            ->whereIn('status', ['active', 'matched']);

        if ($request->filled('type')) {
            $query->where('type', $request->type);
        }
        if ($request->filled('category_id')) {
            $query->where('category_id', $request->category_id);
        }
        if ($request->filled('location_id')) {
            $query->where('location_id', $request->location_id);
        }
        if ($request->filled('department_id')) {
            $query->where('department_id', $request->department_id);
        }
        if ($request->filled('status')) {
            $query->where('status', $request->status);
        }
        if ($request->filled('search')) {
            $query->where(function ($q) use ($request) {
                $q->where('title', 'like', '%' . $request->search . '%')
                  ->orWhere('description', 'like', '%' . $request->search . '%');
            });
        }
        if ($request->filled('date_from')) {
            $query->whereDate('date_occurred', '>=', $request->date_from);
        }
        if ($request->filled('date_to')) {
            $query->whereDate('date_occurred', '<=', $request->date_to);
        }

        $paginated = $query->latest()->paginate(15);

        return response()->json([
            'success' => true,
            'data' => LostFoundItemResource::collection($paginated->items()),
            'meta' => [
                'current_page' => $paginated->currentPage(),
                'per_page' => $paginated->perPage(),
                'total' => $paginated->total(),
                'last_page' => $paginated->lastPage(),
            ],
        ]);
    }

    public function store(StoreLostFoundRequest $request)
    {
        $data = $request->validated();

        $item = new LostFoundItem();
        $item->reference_no = ReferenceGenerator::forLostFound();
        $item->user_id = $request->user()->id;
        $item->type = $data['type'];
        $item->title = $data['title'];
        $item->description = $data['description'];
        $item->category_id = $data['category_id'];
        $item->location_id = $data['location_id'];
        $item->department_id = $data['department_id'] ?? null;
        $item->semester = $data['semester'] ?? null;
        $item->date_occurred = $data['date_occurred'];
        $item->identifying_info = $data['identifying_info'] ?? null;
        $item->contact_preference = $data['contact_preference'] ?? 'in_app';
        $item->status = 'active';
        $item->image_path = ImageUploadService::store($request->file('image'), 'lost-found');
        $item->save();

        return response()->json([
            'success' => true,
            'message' => ucfirst($item->type) . ' item reported successfully.',
            'data' => new LostFoundItemResource(
                $item->load(['category', 'location', 'department', 'user'])
            ),
        ], 201);
    }

    public function storeLost(StoreLostFoundRequest $request)
    {
        $request->merge(['type' => 'lost']);
        return $this->store($request);
    }

    public function storeFound(StoreLostFoundRequest $request)
    {
        $request->merge(['type' => 'found']);
        return $this->store($request);
    }

    public function show(Request $request, LostFoundItem $lostFound)
    {
        $this->authorize('view', $lostFound);

        return response()->json([
            'success' => true,
            'data' => new LostFoundItemResource(
                $lostFound->load(['category', 'location', 'department', 'user'])
            ),
        ]);
    }

    public function update(UpdateLostFoundRequest $request, LostFoundItem $lostFound)
    {
        $this->authorize('update', $lostFound);

        $data = $request->validated();

        if ($request->hasFile('image')) {
            ImageUploadService::delete($lostFound->image_path);
            $lostFound->image_path = ImageUploadService::store($request->file('image'), 'lost-found');
        }

        $lostFound->fill(collect($data)->except(['image'])->toArray())->save();

        return response()->json([
            'success' => true,
            'message' => 'Item updated.',
            'data' => new LostFoundItemResource(
                $lostFound->fresh()->load(['category', 'location', 'department', 'user'])
            ),
        ]);
    }

    public function updateStatus(Request $request, LostFoundItem $lostFound)
    {
        $this->authorize('updateStatus', $lostFound);

        $validated = $request->validate([
            'status' => 'required|in:active,matched,returned,closed',
        ]);

        $lostFound->update(['status' => $validated['status']]);

        return response()->json([
            'success' => true,
            'message' => 'Status updated.',
            'data' => new LostFoundItemResource(
                $lostFound->fresh()->load(['category', 'location', 'department', 'user'])
            ),
        ]);
    }

    public function destroy(Request $request, LostFoundItem $lostFound)
    {
        $this->authorize('delete', $lostFound);

        ImageUploadService::delete($lostFound->image_path);
        $lostFound->delete();

        return response()->json([
            'success' => true,
            'message' => 'Item removed.',
        ]);
    }

    public function myItems(Request $request)
    {
        $items = $request->user()
            ->lostFoundItems()
            ->with(['category', 'location', 'department'])
            ->latest()
            ->get();

        return response()->json([
            'success' => true,
            'data' => LostFoundItemResource::collection($items),
        ]);
    }

    public function storeContact(StoreLostFoundContactRequest $request, LostFoundItem $lostFound)
    {
        if ($lostFound->user_id === $request->user()->id) {
            return response()->json([
                'success' => false,
                'message' => 'You cannot send a contact request on your own item.',
            ], 422);
        }

        $exists = LostFoundContact::where('lost_found_item_id', $lostFound->id)
            ->where('sender_id', $request->user()->id)
            ->exists();

        if ($exists) {
            return response()->json([
                'success' => false,
                'message' => 'You have already contacted the poster about this item.',
            ], 409);
        }

        $contact = LostFoundContact::create([
            'lost_found_item_id' => $lostFound->id,
            'sender_id' => $request->user()->id,
            'receiver_id' => $lostFound->user_id,
            'message' => $request->validated('message'),
            'contact_detail' => $request->validated('contact_detail'),
            'status' => 'pending',
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Request sent. You will be notified if the poster responds.',
            'data' => new LostFoundContactResource(
                $contact->load(['item', 'sender'])
            ),
        ], 201);
    }

    public function itemContacts(Request $request, LostFoundItem $lostFound)
    {
        $this->authorize('manageContacts', $lostFound);

        $contacts = $lostFound->contacts()
            ->with(['item', 'sender'])
            ->latest()
            ->get();

        return response()->json([
            'success' => true,
            'data' => LostFoundContactResource::collection($contacts),
        ]);
    }

    public function mySentContacts(Request $request)
    {
        $contacts = $request->user()
            ->sentContacts()
            ->with(['item', 'sender'])
            ->latest()
            ->get();

        return response()->json([
            'success' => true,
            'data' => LostFoundContactResource::collection($contacts),
        ]);
    }

    public function myReceivedContacts(Request $request)
    {
        $contacts = $request->user()
            ->receivedContacts()
            ->with(['item', 'sender'])
            ->latest()
            ->get();

        return response()->json([
            'success' => true,
            'data' => LostFoundContactResource::collection($contacts),
        ]);
    }

    public function updateContact(UpdateLostFoundContactRequest $request, LostFoundContact $contact)
    {
        $user = $request->user();

        if ($user->role !== 'admin' && $contact->receiver_id !== $user->id) {
            return response()->json([
                'success' => false,
                'message' => 'You do not have permission to update this request.',
            ], 403);
        }

        $contact->update(['status' => $request->validated('status')]);

        return response()->json([
            'success' => true,
            'message' => 'Request updated.',
            'data' => new LostFoundContactResource(
                $contact->fresh()->load(['item', 'sender'])
            ),
        ]);
    }
}