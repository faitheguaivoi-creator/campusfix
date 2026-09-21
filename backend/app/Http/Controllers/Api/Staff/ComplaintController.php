<?php

namespace App\Http\Controllers\Api\Staff;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreComplaintUpdateRequest;
use App\Http\Requests\UpdateComplaintStatusRequest;
use App\Http\Resources\ComplaintResource;
use App\Models\Complaint;
use Illuminate\Http\Request;

class ComplaintController extends Controller
{
    public function index(Request $request)
    {
        $query = $request->user()
            ->assignedComplaints()
            ->with(['category', 'location', 'department', 'user']);

        if ($request->filled('status')) {
            $query->where('status', $request->status);
        }
        if ($request->filled('priority')) {
            $query->where('priority', $request->priority);
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

    public function show(Request $request, Complaint $complaint)
    {
        $this->authorize('view', $complaint);

        return response()->json([
            'success' => true,
            'data' => new ComplaintResource(
                $complaint->load(['category', 'location', 'department', 'user', 'updates.user'])
            ),
        ]);
    }

    public function updateStatus(UpdateComplaintStatusRequest $request, Complaint $complaint)
    {
        $this->authorize('updateStatus', $complaint);

        $status = $request->validated('status');
        $updates = ['status' => $status];

        if ($status === 'resolved') {
            $updates['resolved_at'] = now();
        }

        $complaint->update($updates);

        $complaint->updates()->create([
            'user_id' => $request->user()->id,
            'status' => $status,
            'message' => $request->validated('message') ?? "Progress: " . str_replace('_', ' ', $status) . ".",
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Status updated.',
            'data' => new ComplaintResource(
                $complaint->fresh()->load(['category', 'location', 'department', 'user', 'updates.user'])
            ),
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
            'message' => 'Progress note added.',
            'data' => new ComplaintResource(
                $complaint->fresh()->load(['category', 'location', 'department', 'user', 'updates.user'])
            ),
        ]);
    }
}