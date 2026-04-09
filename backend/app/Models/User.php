<?php

namespace App\Models;

use App\Enums\Gender;
use App\Enums\UserRole;
use App\Enums\UserStatus;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;

class User extends Authenticatable
{
    use HasApiTokens, HasFactory, Notifiable;

    protected $fillable = [
        'nip',
        'name',
        'email',
        'password',
        'phone',
        'address',
        'birth_date',
        'gender',
        'position_id',
        'department_id',
        'join_date',
        'status',
        'photo',
        'leave_quota',
        'role',
    ];

    protected $hidden = [
        'password',
        'remember_token',
    ];

    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password'          => 'hashed',
            'birth_date'        => 'date',
            'join_date'         => 'date',
            'gender'            => Gender::class,
            'status'            => UserStatus::class,
            'role'              => UserRole::class,
        ];
    }

    // Relationships
    public function position(): BelongsTo
    {
        return $this->belongsTo(Position::class);
    }

    public function department(): BelongsTo
    {
        return $this->belongsTo(Department::class);
    }

    public function attendances(): HasMany
    {
        return $this->hasMany(Attendance::class);
    }

    public function leaves(): HasMany
    {
        return $this->hasMany(Leave::class);
    }

    public function approvedLeaves(): HasMany
    {
        return $this->hasMany(Leave::class, 'approved_by');
    }

    // Helpers
    public function isAdmin(): bool
    {
        return $this->role === UserRole::Admin;
    }

    public function isEmployee(): bool
    {
        return $this->role === UserRole::Employee;
    }

    public function getPhotoUrlAttribute(): ?string
    {
        if ($this->photo) {
            return asset('storage/' . $this->photo);
        }

        return null;
    }
}
