<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class TableRequest extends FormRequest
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
            'table_number' => 'required|string|unique:tables,table_number|max:10', 
            'qr_code' => 'nullable|string',
           'status' => 'in:available,occupied,reserved' // Chỉ chấp nhận 3 giá trị này
        ];
    }

    public function messages()
    {
        return [
            'table_number.required' => 'Số bàn không được để trống.',
            'table_number.string' => 'Số bàn phải là chuỗi ký tự.',
            'table_number.unique' => 'Số bàn đã tồn tại.',
            'table_number.max' => 'Số bàn không được quá 10 ký tự.',
        ];
    }
}
