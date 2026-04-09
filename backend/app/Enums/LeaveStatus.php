<?php

namespace App\Enums;

enum LeaveStatus: string
{
    case Pending = 'pending';
    case Approved = 'approved';
    case Rejected = 'rejected';

    public function label(): string
    {
        return match($this) {
            LeaveStatus::Pending => 'Menunggu',
            LeaveStatus::Approved => 'Disetujui',
            LeaveStatus::Rejected => 'Ditolak',
        };
    }
}
