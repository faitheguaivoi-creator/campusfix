<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class LostFoundContactResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        $viewer = $request->user();
        $isReceiver = $viewer && $viewer->id === $this->receiver_id;
        $isSender = $viewer && $viewer->id === $this->sender_id;
        $isAdmin = $viewer && $viewer->role === 'admin';

        return [
            'id' => $this->id,
            'status' => $this->status,
            'message' => $this->message,
            // Contact detail only visible to receiver and admin
            'contact_detail' => ($isReceiver || $isAdmin) ? $this->contact_detail : null,
            'item' => $this->whenLoaded('item', fn () => [
                'id' => $this->item->id,
                'title' => $this->item->title,
                'reference_no' => $this->item->reference_no,
                'type' => $this->item->type,
            ]),
            'sender' => $this->whenLoaded('sender', fn () => [
                'id' => $this->sender->id,
                // Name is visible to receiver and admin only
                'name' => ($isReceiver || $isAdmin) ? $this->sender->name : 'Campus Member',
            ]),
            'created_at' => $this->created_at?->toIso8601String(),
        ];
    }
}