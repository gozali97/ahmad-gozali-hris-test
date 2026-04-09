<?php

namespace App\Http\Requests\Position;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UpdatePositionRequest extends FormRequest
{
    public function authorize(): bool { return true; }

    public function rules(): array
    {
        return [
            'name'        => ['required', 'string', 'max:255', Rule::unique('positions', 'name')->ignore($this->route('position'))],
            'description' => ['nullable', 'string'],
            'status'      => ['sometimes', 'in:active,inactive'],
        ];
    }
}
