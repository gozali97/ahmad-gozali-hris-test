<?php

namespace App\Http\Requests\Attendance;

use Illuminate\Foundation\Http\FormRequest;

class StoreAttendanceRequest extends FormRequest
{
    public function authorize(): bool { return true; }

    public function rules(): array
    {
        return [
            'user_id'   => ['required', 'exists:users,id'],
            'date'      => ['required', 'date'],
            'check_in'  => ['nullable', 'date_format:H:i'],
            'check_out' => ['nullable', 'date_format:H:i', 'after:check_in'],
            'status'    => ['required', 'in:present,sick,permit,absent'],
            'notes'     => ['nullable', 'string'],
        ];
    }
}
