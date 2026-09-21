<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class LostFoundContact extends Model
{
    protected $fillable = [
        'lost_found_item_id', 'sender_id', 'receiver_id',
        'message', 'contact_detail', 'status',
    ];

    public function item()
    {
        return $this->belongsTo(LostFoundItem::class, 'lost_found_item_id');
    }

    public function sender()
    {
        return $this->belongsTo(User::class, 'sender_id');
    }

    public function receiver()
    {
        return $this->belongsTo(User::class, 'receiver_id');
    }
}