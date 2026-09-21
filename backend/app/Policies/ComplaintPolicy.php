<?php

namespace App\Policies;

use App\Models\Complaint;
use App\Models\User;

class ComplaintPolicy
{
    /**
     * Admin sees everything. Students and staff see their own records.
     * Actual "list" filtering is done in the controller — this method is a coarse gate.
     */
    public function viewAny(User $user): bool
    {
        return true;
    }

    public function view(User $user, Complaint $complaint): bool
    {
        if ($user->role === 'admin') {
            return true;
        }

        if ($user->role === 'staff') {
            return $complaint->assigned_to === $user->id;
        }

        // Student: only own complaints
        return $complaint->user_id === $user->id;
    }

    public function create(User $user): bool
    {
        return $user->role === 'student';
    }

    /**
     * Students may edit their own complaint ONLY while it is early-stage.
     * Admins may always edit.
     */
    public function update(User $user, Complaint $complaint): bool
    {
        if ($user->role === 'admin') {
            return true;
        }

        if ($user->role !== 'student') {
            return false;
        }

        return $complaint->user_id === $user->id
            && in_array($complaint->status, ['submitted', 'under_review'], true);
    }

    public function delete(User $user, Complaint $complaint): bool
    {
        if ($user->role === 'admin') {
            return true;
        }

        if ($user->role !== 'student') {
            return false;
        }

        return $complaint->user_id === $user->id
            && in_array($complaint->status, ['submitted', 'under_review'], true);
    }

    public function assign(User $user, Complaint $complaint): bool
    {
        return $user->role === 'admin';
    }

    public function updateStatus(User $user, Complaint $complaint): bool
    {
        if ($user->role === 'admin') {
            return true;
        }

        return $user->role === 'staff' && $complaint->assigned_to === $user->id;
    }
}