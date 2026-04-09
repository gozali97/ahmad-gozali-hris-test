<?php

namespace App\Http\Requests\Employee;

use Illuminate\Foundation\Http\FormRequest;

class StoreEmployeeRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'nip'           => ['required', 'string', 'unique:users,nip'],
            'name'          => ['required', 'string', 'max:255'],
            'email'         => ['required', 'email', 'unique:users,email'],
            'password'      => ['required', 'string', 'min:8', 'confirmed'],
            'phone'         => ['required', 'string', 'max:20'],
            'address'       => ['required', 'string'],
            'birth_date'    => ['required', 'date'],
            'gender'        => ['required', 'in:male,female'],
            'position_id'   => ['required', 'exists:positions,id'],
            'department_id' => ['required', 'exists:departments,id'],
            'join_date'     => ['required', 'date'],
            'status'        => ['sometimes', 'in:active,inactive'],
            'photo'         => ['nullable', 'image', 'max:2048'],
            'leave_quota'   => ['required', 'integer', 'min:0'],
        ];
    }
}
