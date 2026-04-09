<?php

namespace App\Models;

use App\Enums\UserStatus;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Position extends Model
{
    use HasFactory;

    protected $fillable = ['name', 'description', 'status'];

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
