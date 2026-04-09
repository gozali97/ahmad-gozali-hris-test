<?php

namespace App\Models;

use App\Enums\UserStatus;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Department extends Model
{
    use HasFactory;

    protected $fillable = ['name', 'code', 'description', 'status'];

    protected function casts(): array
    {
        return [
            'status' => UserStatus::class,
        ];
    }

    public function employees(): HasMany
    {
        return $this->hasMany(User::class);
    }
}
