<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class LeaveResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id'           => $this->id,
            'user_id'      => $this->user_id,
            'user'         => $this->whenLoaded('user', fn() => [
                'id'   => $this->user->id,
                'nip'  => $this->user->nip,
                'name' => $this->user->name,
            ]),
            'type'         => $this->type?->value,
            'type_label'   => $this->type?->label(),
            'start_date'   => $this->start_date?->format('Y-m-d'),
            'end_date'     => $this->end_date?->format('Y-m-d'),
            'total_days'   => $this->total_days,
            'reason'       => $this->reason,
            'status'       => $this->status?->value,
            'status_label' => $this->status?->label(),
            'admin_notes'  => $this->admin_notes,
            'approved_by'  => $this->whenLoaded('approvedBy', fn() => [
                'id'   => $this->approvedBy?->id,
                'name' => $this->approvedBy?->name,
            ]),
            'processed_at' => $this->processed_at?->toISOString(),
            'created_at'   => $this->created_at?->toISOString(),
        ];
    }
}
