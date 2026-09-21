<?php

namespace App\Http\Resources;

use App\Services\ImageUploadService;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class ComplaintResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        $viewer = $request->user();

        // Determine what reporter info to expose
        $reporter = $this->resolveReporter($viewer);

        return [
            'id' => $this->id,
            'tracking_reference' => $this->tracking_reference,
            'title' => $this->title,
            'description' => $this->description,
            'priority' => $this->priority,
            'status' => $this->status,
            'is_anonymous' => $this->is_anonymous,
            'image_url' => ImageUploadService::url($this->image_path),
            'admin_remarks' => $this->when(
                $viewer && in_array($viewer->role, ['admin', 'staff'], true),
                $this->admin_remarks
            ),
            'reporter' => $reporter,
            'category' => $this->whenLoaded('category', fn () => [
                'id' => $this->category->id,
                'name' => $this->category->name,
            ]),
            'location' => $this->whenLoaded('location', fn () => [
                'id' => $this->location->id,
                'name' => $this->location->name,
                'building' => $this->location->building,
                'type' => $this->location->type,
            ]),
                'department' => $this->whenLoaded('department', fn () => $this->department ? [
                'id' => $this->department->id,
                'name' => $this->department->name,
                 ] : null),
                'semester' => $this->semester,
                'assignee' => $this->whenLoaded('assignee', fn () => $this->assignee ? [
                'id' => $this->assignee->id,
                'name' => $this->assignee->name,
                'specialty' => $this->assignee->specialty,
            ] : null),
            'updates' => ComplaintUpdateResource::collection($this->whenLoaded('updates')),
            'resolved_at' => $this->resolved_at?->toIso8601String(),
            'closed_at' => $this->closed_at?->toIso8601String(),
            'created_at' => $this->created_at?->toIso8601String(),
            'updated_at' => $this->updated_at?->toIso8601String(),
        ];
    }

    /**
     * The single place where reporter identity is decided.
     * All API endpoints automatically respect this because they all use ComplaintResource.
     */
    private function resolveReporter($viewer): array
    {
        // Anonymous: only the original submitter sees their own name.
        if ($this->is_anonymous) {
            $isOwner = $viewer && $viewer->id === $this->user_id;

            return [
                'name' => $isOwner ? $this->user->name : 'Anonymous Student',
                'anonymous' => true,
                'is_mine' => $isOwner,
            ];
        }

        // Non-anonymous: name is visible to everyone who can see the complaint.
        return [
            'name' => $this->user->name,
            'anonymous' => false,
            'is_mine' => $viewer && $viewer->id === $this->user_id,
        ];
    }
}