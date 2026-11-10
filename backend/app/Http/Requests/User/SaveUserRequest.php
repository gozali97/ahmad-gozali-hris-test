<?php
namespace App\Http\Requests\User;
use App\Support\Permissions;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;
class SaveUserRequest extends FormRequest
{
    public function authorize(): bool { return $this->user()?->hasPermission('users.manage') ?? false; }
    protected function prepareForValidation(): void {
        if (is_string($this->email)) $this->merge(['email'=>strtolower(trim($this->email))]);
    }
    public function rules(): array {
        return [
            'name'=>['required','string','max:255'],
            'email'=>['required','email','max:255',Rule::unique('users','email')->ignore($this->route('user'))],
            'password'=>[$this->isMethod('POST') ? 'required' : 'nullable','string','min:8','max:128','confirmed'],
            'role'=>['required',Rule::in(['admin','employee'])],
            'status'=>['required',Rule::in(['active','inactive'])],
            'permissions'=>['present','array'],
            'permissions.*'=>['required','string','distinct',Rule::in(array_keys(Permissions::LABELS))],
        ];
    }
}
