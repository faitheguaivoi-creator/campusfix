<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Location extends Model
{
    protected $fillable = ['name', 'building', 'type', 'is_active'];

    public function complaints()
    {
        return $this->hasMany(Complaint::class);
    }

    public function lostFoundItems()
    {
        return $this->hasMany(LostFoundItem::class);
    }
}