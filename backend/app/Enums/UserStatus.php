<?php

namespace App\Enums;

enum UserStatus: string
{
    case Active = 'active';
    case Inactive = 'inactive';

    public function label(): string
    {
        return match($this) {
            UserStatus::Active => 'Aktif',
            UserStatus::Inactive => 'Non-Aktif',
        };
    }
}
