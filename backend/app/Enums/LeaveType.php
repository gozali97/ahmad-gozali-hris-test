<?php

namespace App\Enums;

enum LeaveType: string
{
    case Annual = 'annual';
    case Sick = 'sick';
    case Maternity = 'maternity';
    case Other = 'other';

    public function label(): string
    {
        return match($this) {
            LeaveType::Annual => 'Cuti Tahunan',
            LeaveType::Sick => 'Cuti Sakit',
            LeaveType::Maternity => 'Cuti Melahirkan',
            LeaveType::Other => 'Lainnya',
        };
    }
}
