<?php

namespace App\Models;

use App\Enums\LeaveStatus;
use App\Enums\LeaveType;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Leave extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'type',
        'start_date',
        'end_date',
        'total_days',
        'reason',
        'status',
        'admin_notes',
        'approved_by',
        'processed_at',
    ];

    protected function casts(): array
    {
        return [
            'start_date'   => 'date',
            'end_date'     => 'date',
            'processed_at' => 'datetime',
            'type'         => LeaveType::class,
            'status'       => LeaveStatus::class,
        ];
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function approvedBy(): BelongsTo
    {
        return $this->belongsTo(User::class, 'approved_by');
    }
}
