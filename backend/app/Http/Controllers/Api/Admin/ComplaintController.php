<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\AssignComplaintRequest;
use App\Http\Requests\StoreComplaintUpdateRequest;
use App\Http\Requests\UpdateComplaintStatusRequest;
use App\Http\Resources\ComplaintResource;
use App\Models\Complaint;
use App\Models\User;
use App\Services\ImageUploadService;
use Illuminate\Http\Request;

class ComplaintController extends Controller
{
    public function index(Request $request)
    {
        $query = Complaint::with(['category', 'location', 'assignee', 'user']);

        if ($request->filled('status')) {
            $query->where('status', $request->status);
        }
        if ($request->filled('priority')) {
            $query->where('priority', $request->priority);
        }
        if ($request->filled('category_id')) {
            $query->where('category_id', $request->category_id);
        }
        if ($request->filled('location_id')) {
            $query->where('location_id', $request->location_id);
        }
        if ($request->filled('assigned_to')) {
            $query->where('assigned_to', $request->assigned_to);
        }
        if ($request->filled('search')) {
            $query->where(function ($q) use ($request) {
                $q->where('title', 'like', '%' . $request->search . '%')
                  ->orWhere('tracking_reference', 'like', '%' . $request->search . '%');
            });
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

    public function show(Complaint $complaint)
    {
        return response()->json([
            'success' => true,
            'data' => new ComplaintResource(
                $complaint->load(['category', 'location', 'assignee', 'user', 'updates.user'])
            ),
        ]);
    }

    /**
     * PATCH /api/admin/complaints/{id}/assign
     * Assigns the complaint to a maintenance staff member and moves status to 'assigned'.
     */
    public function assign(AssignComplaintRequest $request, Complaint $complaint)
    {
        $staff = User::where('id', $request->validated('assigned_to'))
            ->where('role', 'staff')
            ->first();

        if (! $staff) {
            return response()->json([
                'success' => false,
                'message' => 'Selected user is not a maintenance staff member.',
            ], 422);
        }

        $complaint->update([
            'assigned_to' => $staff->id,
            'status' => 'assigned',
            'admin_remarks' => $request->validated('admin_remarks') ?? $complaint->admin_remarks,
        ]);

        $complaint->updates()->create([
            'user_id' => $request->user()->id,
            'status' => 'assigned',
            'message' => "Assigned to {$staff->name}.",
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Complaint assigned.',
            'data' => new ComplaintResource(
                $complaint->fresh()->load(['category', 'location', 'assignee', 'user'])
            ),
        ]);
    }

    /**
     * PATCH /api/admin/complaints/{id}/status
     */
    public function updateStatus(UpdateComplaintStatusRequest $request, Complaint $complaint)
    {
        $status = $request->validated('status');
        $updates = ['status' => $status];

        if ($status === 'resolved') {
            $updates['resolved_at'] = now();
        }
        if ($status === 'closed') {
            $updates['closed_at'] = now();
        }

        $complaint->update($updates);

        $complaint->updates()->create([
            'user_id' => $request->user()->id,
            'status' => $status,
            'message' => $request->validated('message') ?? "Status changed to " . str_replace('_', ' ', $status) . ".",
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Status updated.',
            'data' => new ComplaintResource(
                $complaint->fresh()->load(['category', 'location', 'assignee', 'user'])
            ),
        ]);
    }

    /**
     * POST /api/admin/complaints/{id}/updates
     */
    public function storeUpdate(StoreComplaintUpdateRequest $request, Complaint $complaint)
    {
        $complaint->updates()->create([
            'user_id' => $request->user()->id,
            'message' => $request->validated('message'),
            'status' => $request->validated('status'),
        ]);

        if ($request->filled('status')) {
            $complaint->update(['status' => $request->validated('status')]);
        }

        return response()->json([
            'success' => true,
            'message' => 'Update posted.',
            'data' => new ComplaintResource(
                $complaint->fresh()->load(['category', 'location', 'assignee', 'user', 'updates.user'])
            ),
        ]);
    }

    /**
     * DELETE /api/admin/complaints/{id}
     */
    public function destroy(Complaint $complaint)
    {
        ImageUploadService::delete($complaint->image_path);
        $complaint->delete();

        return response()->json([
            'success' => true,
            'message' => 'Complaint deleted.',
        ]);
    }
}