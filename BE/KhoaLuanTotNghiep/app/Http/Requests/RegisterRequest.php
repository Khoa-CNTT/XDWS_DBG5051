<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class RegisterRequest extends FormRequest
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
            'name' => 'required|string|max:255',
            'phone'=>'required|max:12', 
            'email' => 'required|string|email|max:255|unique:users',
            'password' => 'required|string|min:5',
        ];
    }
    public function messages() {
        return [
            'name.required' => 'Tên không được để trống',
            'name.max' => 'Tên không được quá :max ký tự',
            'phone.required' => 'Số điện thoại không được để trống',
            'phone.max' => 'Số điện thoại không được quá :max ký tự',
            'email.required' => 'Email không được để trống',
            'email.email' => 'Email không hợp lệ',
            'email.unique' => 'Email đã tồn tại',
            'password.required' => 'Mật khẩu không được để trống',
            'password.min' => 'Mật khẩu phải có ít nhất 6 ký tự',
        ];
    }
}
