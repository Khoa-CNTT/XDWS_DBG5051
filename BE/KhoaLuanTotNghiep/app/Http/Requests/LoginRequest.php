<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class LoginRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'name' => 'required|string|exists:users,name', // Kiểm tra name tồn tại trong DB
            'password' => 'required|string',
        ];
    }

    public function messages() {
        return [
            'name.required' => 'Tên tài khoản không được để trống',
            'name.exists' => 'Tên tài khoản không tồn tại',
            'password.required' => 'Mật khẩu không được để trống',
        ];
    }
}
