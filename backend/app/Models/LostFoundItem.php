<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class LostFoundItem extends Model
{
    use HasFactory, SoftDeletes;

  protected $fillable = [
    'reference_no', 'user_id', 'category_id', 'location_id',
    'department_id', 'semester',
    'type', 'title', 'description', 'identifying_info',
    'date_occurred', 'image_path', 'contact_preference', 'status',
];

    protected $casts = [
        'date_occurred' => 'date',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function category()
    {
        return $this->belongsTo(LostFoundCategory::class, 'category_id');
    }

    public function location()
    {
        return $this->belongsTo(Location::class);
    }

    public function department()
{
    return $this->belongsTo(Department::class);
}

    public function contacts()
    {
        return $this->hasMany(LostFoundContact::class);
    }
}