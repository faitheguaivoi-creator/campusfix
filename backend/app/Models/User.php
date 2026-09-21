<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;

class User extends Authenticatable
{
    use HasApiTokens, HasFactory, Notifiable;

    protected $fillable = [
        'name', 'email', 'password', 'role',
        'phone', 'department', 'specialty',
        'matric_no', 'avatar_path', 'is_active',
    ];

    protected $hidden = ['password', 'remember_token'];

    protected $casts = [
        'email_verified_at' => 'datetime',
        'password' => 'hashed',
        'is_active' => 'boolean',
    ];

    // Relationships
    public function complaints()
    {
        return $this->hasMany(Complaint::class, 'user_id');
    }

    public function assignedComplaints()
    {
        return $this->hasMany(Complaint::class, 'assigned_to');
    }

    public function complaintUpdates()
    {
        return $this->hasMany(ComplaintUpdate::class);
    }

    public function lostFoundItems()
    {
        return $this->hasMany(LostFoundItem::class);
    }

    public function sentContacts()
    {
        return $this->hasMany(LostFoundContact::class, 'sender_id');
    }

    public function receivedContacts()
    {
        return $this->hasMany(LostFoundContact::class, 'receiver_id');
    }
}