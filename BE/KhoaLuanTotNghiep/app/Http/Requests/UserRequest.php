<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class UserRequest extends FormRequest
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
            'name'=>'required|max:191',
            'email'=>'required|email|unique:users',
            'password'=>'required',
            'role' => "in:admin, staff"
        ];
    }

    public function messages(){
        return [
            'name.required' => 'Tên không được để trống',
            'name.max' => 'Tên không được quá :max ký tự',
            'email.required' => 'Email không được để trống',
            'email.email' => 'Email sai định dạng',
            'email.unique' => 'Email đã tồn tại',
            'password.required' => 'Mật khẩu không được để trống',
            'role.in' => 'Vai trò không hợp lệ. Chỉ chấp nhận admin hoặc staff.',
        ];
    }
}
