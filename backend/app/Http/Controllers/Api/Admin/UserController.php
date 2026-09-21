<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rule;

class UserController extends Controller
{
    public function index(Request $request)
    {
        $query = User::query();

        if ($request->filled('role')) {
            $query->where('role', $request->role);
        }
        if ($request->filled('search')) {
            $query->where(function ($q) use ($request) {
                $q->where('name', 'like', '%' . $request->search . '%')
                  ->orWhere('email', 'like', '%' . $request->search . '%')
                  ->orWhere('matric_no', 'like', '%' . $request->search . '%');
            });
        }

        $paginated = $query->orderBy('role')->orderBy('name')->paginate(20);

        return response()->json([
            'success' => true,
            'data' => $paginated->items(),
            'meta' => [
                'current_page' => $paginated->currentPage(),
                'per_page' => $paginated->perPage(),
                'total' => $paginated->total(),
                'last_page' => $paginated->lastPage(),
            ],
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:120',
            'email' => 'required|email|unique:users,email',
            'password' => 'required|string|min:6',
            'role' => 'required|in:student,staff,admin',
            'department' => 'nullable|string|max:100',
            'specialty' => 'nullable|string|max:100',
            'phone' => 'nullable|string|max:20',
        ]);

        $user = User::create([
            ...$validated,
            'password' => Hash::make($validated['password']),
            'is_active' => true,
        ]);

        return response()->json([
            'success' => true,
            'message' => 'User created successfully.',
            'data' => $user,
        ], 201);
    }

    public function update(Request $request, User $user)
    {
        $validated = $request->validate([
            'name' => 'sometimes|required|string|max:120',
            'email' => ['sometimes', 'required', 'email', Rule::unique('users')->ignore($user->id)],
            'role' => 'sometimes|required|in:student,staff,admin',
            'department' => 'nullable|string|max:100',
            'specialty' => 'nullable|string|max:100',
            'phone' => 'nullable|string|max:20',
            'is_active' => 'sometimes|boolean',
        ]);

        $user->update($validated);

        return response()->json([
            'success' => true,
            'message' => 'User updated.',
            'data' => $user->fresh(),
        ]);
    }

    public function destroy(User $user)
    {
        if ($user->id === auth()->id()) {
            return response()->json([
                'success' => false,
                'message' => 'You cannot delete your own account.',
            ], 422);
        }

        $user->update(['is_active' => false]);
        $user->delete();

        return response()->json([
            'success' => true,
            'message' => 'User deactivated and removed.',
        ]);
    }

    /**
     * GET /api/admin/staff
     * List of maintenance staff with their workload counts.
     */
    public function staff(Request $request)
    {
        $staff = User::where('role', 'staff')
            ->withCount([
                'assignedComplaints as assigned_total',
                'assignedComplaints as active_total' => function ($q) {
                    $q->whereNotIn('status', ['resolved', 'closed']);
                },
                'assignedComplaints as resolved_total' => function ($q) {
                    $q->whereIn('status', ['resolved', 'closed']);
                },
            ])
            ->orderBy('name')
            ->get();

        return response()->json([
            'success' => true,
            'data' => $staff,
        ]);
    }
}