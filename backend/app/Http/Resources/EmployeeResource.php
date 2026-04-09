<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class EmployeeResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id'            => $this->id,
            'nip'           => $this->nip,
            'name'          => $this->name,
            'email'         => $this->email,
            'phone'         => $this->phone,
            'address'       => $this->address,
            'birth_date'    => $this->birth_date?->format('Y-m-d'),
            'gender'        => $this->gender?->value,
            'gender_label'  => $this->gender?->label(),
            'position_id'   => $this->position_id,
            'department_id' => $this->department_id,
            'position'      => $this->whenLoaded('position', fn() => [
                'id'   => $this->position->id,
                'name' => $this->position->name,
            ]),
            'department'    => $this->whenLoaded('department', fn() => [
                'id'   => $this->department->id,
                'name' => $this->department->name,
                'code' => $this->department->code,
            ]),
            'join_date'     => $this->join_date?->format('Y-m-d'),
            'status'        => $this->status?->value,
            'status_label'  => $this->status?->label(),
            'photo'         => $this->photo,
            'photo_url'     => $this->photo_url,
            'leave_quota'   => $this->leave_quota,
            'role'          => $this->role?->value,
            'created_at'    => $this->created_at?->toISOString(),
        ];
    }
}
