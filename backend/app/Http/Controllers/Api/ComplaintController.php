<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreComplaintRequest;
use App\Http\Requests\StoreComplaintUpdateRequest;
use App\Http\Requests\UpdateComplaintRequest;
use App\Http\Resources\ComplaintResource;
use App\Models\Complaint;
use App\Services\ImageUploadService;
use App\Services\ReferenceGenerator;
use Illuminate\Http\Request;

class ComplaintController extends Controller
{
    public function index(Request $request)
    {
        $query = $request->user()
            ->complaints()
            ->with(['category', 'location', 'department', 'assignee']);

        if ($request->filled('status')) {
            $query->where('status', $request->status);
        }
        if ($request->filled('priority')) {
            $query->where('priority', $request->priority);
        }
        if ($request->filled('category_id')) {
            $query->where('category_id', $request->category_id);
        }
        if ($request->filled('search')) {
            $query->where('title', 'like', '%' . $request->search . '%');
        }

        $paginated = $query->latest()->paginate(15);

        return response()->json([
            'success' => true,
            'data' => ComplaintResource::collection($paginated->items()),
            'meta' => [
                'current_page' => $paginated->currentPage(),
                'per_page' => $paginated->perPage(),
                'total' => $paginated->total(),
                'last_page' => $paginated->lastPage(),
            ],
        ]);
    }

    public function store(StoreComplaintRequest $request)
    {
        $data = $request->validated();

        $complaint = new Complaint();
        $complaint->tracking_reference = ReferenceGenerator::forComplaint();
        $complaint->user_id = $request->user()->id;
        $complaint->title = $data['title'];
        $complaint->description = $data['description'];
        $complaint->category_id = $data['category_id'];
        $complaint->location_id = $data['location_id'];
        $complaint->department_id = $data['department_id'] ?? null;
        $complaint->semester = $data['semester'] ?? null;
        $complaint->priority = $data['priority'];
        $complaint->status = 'submitted';
        $complaint->is_anonymous = $request->boolean('is_anonymous');
        $complaint->image_path = ImageUploadService::store($request->file('image'), 'complaints');
        $complaint->save();

        return response()->json([
            'success' => true,
            'message' => 'Complaint submitted successfully.',
            'data' => new ComplaintResource(
                $complaint->load(['category', 'location', 'department'])
            ),
        ], 201);
    }

    public function show(Request $request, Complaint $complaint)
    {
        $this->authorize('view', $complaint);

        return response()->json([
            'success' => true,
            'data' => new ComplaintResource(
                $complaint->load(['category', 'location', 'department', 'assignee', 'updates.user'])
            ),
        ]);
    }

    public function update(UpdateComplaintRequest $request, Complaint $complaint)
    {
        $this->authorize('update', $complaint);

        $data = $request->validated();

        if ($request->hasFile('image')) {
            ImageUploadService::delete($complaint->image_path);
            $complaint->image_path = ImageUploadService::store($request->file('image'), 'complaints');
        }

        $complaint->fill(collect($data)->except(['image'])->toArray())->save();

        return response()->json([
            'success' => true,
            'message' => 'Complaint updated.',
            'data' => new ComplaintResource(
                $complaint->fresh()->load(['category', 'location', 'department'])
            ),
        ]);
    }

    public function destroy(Request $request, Complaint $complaint)
    {
        $this->authorize('delete', $complaint);

        $complaint->update([
            'status' => 'closed',
            'closed_at' => now(),
        ]);
        $complaint->delete();

        return response()->json([
            'success' => true,
            'message' => 'Complaint cancelled.',
        ]);
    }

    public function storeUpdate(StoreComplaintUpdateRequest $request, Complaint $complaint)
    {
        $this->authorize('view', $complaint);

        $complaint->updates()->create([
            'user_id' => $request->user()->id,
            'message' => $request->validated('message'),
            'status' => null,
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Comment added.',
            'data' => new ComplaintResource(
                $complaint->fresh()->load(['category', 'location', 'department', 'updates.user'])
            ),
        ]);
    }

    public function stats(Request $request)
    {
        $userId = $request->user()->id;
        $base = Complaint::where('user_id', $userId);

        return response()->json([
            'success' => true,
            'data' => [
                'total' => (clone $base)->count(),
                'pending' => (clone $base)->whereIn('status', ['submitted', 'under_review', 'assigned'])->count(),
                'in_progress' => (clone $base)->where('status', 'in_progress')->count(),
                'resolved' => (clone $base)->whereIn('status', ['resolved', 'closed'])->count(),
            ],
        ]);
    }

    public function track(string $reference)
    {
        $complaint = Complaint::with(['category', 'location', 'department', 'updates'])
            ->where('tracking_reference', strtoupper($reference))
            ->first();

        if (! $complaint) {
            return response()->json([
                'success' => false,
                'message' => 'No complaint found with that reference number.',
            ], 404);
        }

        return response()->json([
            'success' => true,
            'data' => [
                'tracking_reference' => $complaint->tracking_reference,
                'title' => $complaint->title,
                'category' => $complaint->category->name,
                'location' => $complaint->location->name,
                'department' => $complaint->department?->name,
                'semester' => $complaint->semester,
                'priority' => $complaint->priority,
                'status' => $complaint->status,
                'is_anonymous' => $complaint->is_anonymous,
                'submitted_at' => $complaint->created_at->toIso8601String(),
                'latest_update' => $complaint->updates->first()?->message,
                'updates' => $complaint->updates->map(fn ($u) => [
                    'status' => $u->status,
                    'message' => $u->message,
                    'created_at' => $u->created_at->toIso8601String(),
                ]),
            ],
        ]);
    }
}