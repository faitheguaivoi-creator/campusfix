<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Department extends Model
{
    protected $fillable = ['name', 'slug', 'max_semesters', 'is_active'];

    protected $casts = [
        'is_active' => 'boolean',
        'max_semesters' => 'integer',
    ];

    public function complaints()
    {
        return $this->hasMany(Complaint::class);
    }

    public function lostFoundItems()
    {
        return $this->hasMany(LostFoundItem::class);
    }
}