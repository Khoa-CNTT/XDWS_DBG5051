<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class MenuRequest extends FormRequest
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
            'category_id' => 'required|exists:categories,id',
            'price' => 'required|numeric|min:0',
            'image' => 'nullable|string',
        ];
    }
    public function messages(){
        return [
            'name.required' => 'Tên món ăn không được để trống.',
            'name.string' => 'Tên món ăn phải là chuỗi ký tự.',
            'name.max' => 'Tên món ăn không được vượt quá 255 ký tự.',

            'category_id.required' => 'Danh mục là bắt buộc.',
            'category_id.exists' => 'Danh mục không hợp lệ.',

            'price.required' => 'Giá món ăn không được để trống.',
            'price.numeric' => 'Giá món ăn phải là số.',
            'price.min' => 'Giá món ăn phải lớn hơn hoặc bằng 0.',

            'image.string' => 'Đường dẫn hình ảnh phải là chuỗi ký tự.',
        ];
    }

}
