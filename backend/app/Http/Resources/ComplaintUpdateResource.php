<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class ComplaintUpdateResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'status' => $this->status,
            'message' => $this->message,
            // Only expose the author's name to admins and staff.
            // Students see "System" for status changes.
            'author' => $this->resolveAuthor($request->user()),
            'created_at' => $this->created_at?->toIso8601String(),
        ];
    }

    private function resolveAuthor($viewer): array
    {
        if (! $this->user) {
            return ['name' => 'System', 'role' => 'system'];
        }

        if ($viewer && in_array($viewer->role, ['admin', 'staff'], true)) {
            return ['name' => $this->user->name, 'role' => $this->user->role];
        }

        return ['name' => 'Staff', 'role' => 'staff'];
    }
}