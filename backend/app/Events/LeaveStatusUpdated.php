<?php

namespace App\Events;

use App\Models\Leave;
use Illuminate\Broadcasting\Channel;
use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Contracts\Broadcasting\ShouldBroadcastNow;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;

class LeaveStatusUpdated implements ShouldBroadcastNow
{
    use Dispatchable, InteractsWithSockets, SerializesModels;

    public $leave;

    public function __construct(Leave $leave)
    {
        $this->leave = $leave;
    }

    public function broadcastOn(): array
    {
        // Channel specific to the employee
        return [
            new Channel('employee-notifications.' . $this->leave->user_id),
        ];
    }

    public function broadcastAs(): string
    {
        return 'LeaveStatusUpdated';
    }
}
