<?php

namespace App\Enums;

enum UserRole: string
{
    case Admin = 'admin';
    case Employee = 'employee';

    public function label(): string
    {
        return match($this) {
            UserRole::Admin => 'Admin HR',
            UserRole::Employee => 'Karyawan',
        };
    }
}
