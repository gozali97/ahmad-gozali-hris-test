<?php

namespace App\Http\Requests\Position;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class StorePositionRequest extends FormRequest
{
    public function authorize(): bool { return true; }

    public function rules(): array
    {
        return [
            'name'        => ['required', 'string', 'max:255', 'unique:positions,name'],
            'description' => ['nullable', 'string'],
            'status'      => ['sometimes', 'in:active,inactive'],
        ];
    }
}
