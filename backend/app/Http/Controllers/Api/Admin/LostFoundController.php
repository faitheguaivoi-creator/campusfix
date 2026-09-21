<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Http\Resources\LostFoundItemResource;
use App\Models\LostFoundItem;
use App\Services\ImageUploadService;
use Illuminate\Http\Request;

class LostFoundController extends Controller
{
    /**
     * GET /api/admin/lost-found
     * Admins see ALL items including returned and closed.
     */
    public function index(Request $request)
    {
        $query = LostFoundItem::with(['category', 'location', 'user']);

        if ($request->filled('type')) {
            $query->where('type', $request->type);
        }
        if ($request->filled('category_id')) {
            $query->where('category_id', $request->category_id);
        }
        if ($request->filled('status')) {
            $query->where('status', $request->status);
        }
        if ($request->filled('search')) {
            $query->where('title', 'like', '%' . $request->search . '%');
        }

        $paginated = $query->latest()->paginate(20);

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

    /**
     * PATCH /api/admin/lost-found/{lostFound}/status
     */
    public function updateStatus(Request $request, LostFoundItem $lostFound)
    {
        $validated = $request->validate([
            'status' => 'required|in:active,matched,returned,closed',
        ]);

        $lostFound->update(['status' => $validated['status']]);

        return response()->json([
            'success' => true,
            'message' => 'Status updated.',
            'data' => new LostFoundItemResource(
                $lostFound->fresh()->load(['category', 'location', 'user'])
            ),
        ]);
    }

    /**
     * DELETE /api/admin/lost-found/{lostFound}
     */
    public function destroy(LostFoundItem $lostFound)
    {
        ImageUploadService::delete($lostFound->image_path);
        $lostFound->delete();

        return response()->json([
            'success' => true,
            'message' => 'Report removed.',
        ]);
    }
}