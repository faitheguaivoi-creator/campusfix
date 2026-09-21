<?php

namespace App\Http\Resources;

use App\Services\ImageUploadService;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class LostFoundItemResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        $viewer = $request->user();
        $isOwner = $viewer && $viewer->id === $this->user_id;
        $isAdmin = $viewer && $viewer->role === 'admin';

        return [
            'id' => $this->id,
            'reference_no' => $this->reference_no,
            'type' => $this->type,
            'title' => $this->title,
            'description' => $this->description,
            'identifying_info' => $this->identifying_info,
            'date_occurred' => $this->date_occurred?->toDateString(),
            'status' => $this->status,
            'contact_preference' => $this->contact_preference,
            'image_url' => ImageUploadService::url($this->image_path),

            // Only owner or admin sees the poster's name
            'poster' => [
                'name' => ($isOwner || $isAdmin) ? $this->user->name : 'Campus Member',
                'is_mine' => $isOwner,
            ],

            'category' => $this->whenLoaded('category', fn () => [
                'id' => $this->category->id,
                'name' => $this->category->name,
            ]),
            'location' => $this->whenLoaded('location', fn () => [
                'id' => $this->location->id,
                'name' => $this->location->name,
                'building' => $this->location->building,
            ]),
            'department' => $this->whenLoaded('department', fn () => $this->department ? [
            'id' => $this->department->id,
            'name' => $this->department->name,
            ] : null),
            'semester' => $this->semester,
            'contacts_count' => $this->when(
                $isOwner || $isAdmin,
                fn () => $this->contacts()->count()
            ),
            'created_at' => $this->created_at?->toIso8601String(),
        ];
    }
}