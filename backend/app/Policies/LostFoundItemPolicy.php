<?php

namespace App\Policies;

use App\Models\LostFoundItem;
use App\Models\User;

class LostFoundItemPolicy
{
    public function viewAny(User $user): bool
    {
        return true;
    }

    public function view(User $user, LostFoundItem $item): bool
    {
        return true; // everyone can browse
    }

    public function create(User $user): bool
    {
        return true; // any logged-in user can post
    }

    public function update(User $user, LostFoundItem $item): bool
    {
        return $user->role === 'admin' || $item->user_id === $user->id;
    }

    public function delete(User $user, LostFoundItem $item): bool
    {
        return $user->role === 'admin' || $item->user_id === $user->id;
    }

    public function updateStatus(User $user, LostFoundItem $item): bool
    {
        return $user->role === 'admin' || $item->user_id === $user->id;
    }

    public function manageContacts(User $user, LostFoundItem $item): bool
    {
        return $user->role === 'admin' || $item->user_id === $user->id;
    }
}