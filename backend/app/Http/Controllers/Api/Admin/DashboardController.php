<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Http\Resources\ComplaintResource;
use App\Models\Complaint;
use App\Models\LostFoundItem;
use App\Models\User;

class DashboardController extends Controller
{
    public function index()
    {
        $activeComplaints = Complaint::whereNotIn('status', ['resolved', 'closed']);

        return response()->json([
            'success' => true,
            'data' => [
                // Headline cards
                'total_students' => User::where('role', 'student')->count(),
                'total_staff' => User::where('role', 'staff')->count(),
                'total_complaints' => Complaint::count(),
                'pending_complaints' => (clone $activeComplaints)->whereIn('status', ['submitted', 'under_review'])->count(),
                'in_progress_complaints' => Complaint::where('status', 'in_progress')->count(),
                'resolved_complaints' => Complaint::whereIn('status', ['resolved', 'closed'])->count(),
                'urgent_complaints' => (clone $activeComplaints)->where('priority', 'urgent')->count(),
                'anonymous_complaints' => Complaint::where('is_anonymous', true)->count(),

                'lost_items' => LostFoundItem::where('type', 'lost')->count(),
                'found_items' => LostFoundItem::where('type', 'found')->count(),
                'returned_items' => LostFoundItem::where('status', 'returned')->count(),

                // Chart data
                'complaints_by_status' => Complaint::selectRaw('status, COUNT(*) as total')
                    ->groupBy('status')
                    ->get()
                    ->map(fn ($r) => ['status' => $r->status, 'total' => (int) $r->total]),

                'complaints_by_category' => Complaint::join('complaint_categories', 'complaints.category_id', '=', 'complaint_categories.id')
                    ->selectRaw('complaint_categories.name as category, COUNT(*) as total')
                    ->groupBy('complaint_categories.name')
                    ->orderByDesc('total')
                    ->limit(8)
                    ->get()
                    ->map(fn ($r) => ['category' => $r->category, 'total' => (int) $r->total]),

                'complaints_by_department' => Complaint::join('departments', 'complaints.department_id', '=', 'departments.id')
                    ->selectRaw('departments.name as department, COUNT(*) as total')
                    ->groupBy('departments.name')
                    ->orderByDesc('total')
                    ->get()
                    ->map(fn ($r) => ['department' => $r->department, 'total' => (int) $r->total]),

                // Recent
                'recent_complaints' => ComplaintResource::collection(
                    Complaint::with(['category', 'location', 'department'])
                        ->latest()
                        ->limit(5)
                        ->get()
                ),
            ],
        ]);
    }
}