<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class LostFoundCategory extends Model
{
    protected $fillable = ['name', 'slug', 'description', 'is_active'];

    public function items()
    {
        return $this->hasMany(LostFoundItem::class, 'category_id');
    }
}