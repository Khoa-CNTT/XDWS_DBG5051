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
            'phone'=>'required|max:12', 
            'email'=>'required|email',
            'password'=>'required',
        ];
    }

    public function messages(){
        return [
            'name.required' => 'Tên không được để trống',
            'name.max' => 'Tên không được quá :max ký tự',
            'phone.required' => 'Số điện thoại không được để trống',
            'phone.max' => 'Số điện thoại không được quá :max ký tự',
            'email.required' => 'Email không được để trống',
            'email.email' => 'Email sai định dạng',
            'password.required' => 'Mật khẩu không được để trống',
        ];
    }
}
