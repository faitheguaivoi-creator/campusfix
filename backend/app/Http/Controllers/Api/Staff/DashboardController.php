<?php

namespace App\Http\Controllers\Api\Staff;

use App\Http\Controllers\Controller;
use App\Http\Resources\ComplaintResource;
use Illuminate\Http\Request;

class DashboardController extends Controller
{
    public function index(Request $request)
    {
        $userId = $request->user()->id;

        $base = \App\Models\Complaint::where('assigned_to', $userId);

        return response()->json([
            'success' => true,
            'data' => [
                'assigned_total' => (clone $base)->count(),
                'pending' => (clone $base)->whereIn('status', ['assigned', 'under_review'])->count(),
                'in_progress' => (clone $base)->where('status', 'in_progress')->count(),
                'resolved' => (clone $base)->whereIn('status', ['resolved', 'closed'])->count(),
                'urgent' => (clone $base)->where('priority', 'urgent')
                    ->whereNotIn('status', ['resolved', 'closed'])
                    ->count(),
                'recent' => ComplaintResource::collection(
                    (clone $base)->with(['category', 'location', 'department'])
                        ->latest()
                        ->limit(5)
                        ->get()
                ),
            ],
        ]);
    }
}