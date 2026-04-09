<?php

namespace App\Enums;

enum AttendanceStatus: string
{
    case Present = 'present';
    case Sick = 'sick';
    case Permit = 'permit';
    case Absent = 'absent';

    public function label(): string
    {
        return match($this) {
            AttendanceStatus::Present => 'Hadir',
            AttendanceStatus::Sick => 'Sakit',
            AttendanceStatus::Permit => 'Izin',
            AttendanceStatus::Absent => 'Alpha',
        };
    }
}
