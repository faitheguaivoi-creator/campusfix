<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Complaint extends Model
{
    use HasFactory, SoftDeletes;

 protected $fillable = [
    'tracking_reference', 'user_id', 'category_id', 'location_id',
    'department_id', 'semester',
    'assigned_to', 'title', 'description', 'priority',
    'status', 'is_anonymous', 'image_path', 'admin_remarks',
    'resolved_at', 'closed_at',
];

    protected $casts = [
        'is_anonymous' => 'boolean',
        'resolved_at' => 'datetime',
        'closed_at' => 'datetime',
    ];

    public function user()
    {
        return $this->belongsTo(User::class, 'user_id');
    }

    public function assignee()
    {
        return $this->belongsTo(User::class, 'assigned_to');
    }

    public function category()
    {
        return $this->belongsTo(ComplaintCategory::class, 'category_id');
    }

    public function location()
    {
        return $this->belongsTo(Location::class);
    }

    public function department()
{
    return $this->belongsTo(Department::class);
}

    public function updates()
    {
        return $this->hasMany(ComplaintUpdate::class)->latest();
    }
}