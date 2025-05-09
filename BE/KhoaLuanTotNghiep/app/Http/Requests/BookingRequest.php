<?php
namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class BookingRequest extends FormRequest
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
            'customer_name' => 'required|string',
            'email' => 'required|email',
            'phone' => 'required|regex:/^[0-9\-\+\s\(\)]{9,15}$/',
            'booking_date' => 'required|after_or_equal:today',
            'booking_time' => 'required|date_format:H:i',
            'note' => 'nullable|string|max:255',
        ];
    }

    public function messages()
    {
        return [
            'customer_name.required' => 'Vui lòng nhập tên khách hàng.',
            'customer_name.string' => 'Tên khách hàng phải là chuỗi ký tự.',

            'email.required' => 'Vui lòng nhập email.',
            'email.email' => 'Email không đúng định dạng.',

            'phone.required' => 'Vui lòng nhập số điện thoại.',
            'phone.string' => 'Số điện thoại phải là chuỗi ký tự.',

            'booking_date.required' => 'Vui lòng chọn ngày đặt bàn.',
            'booking_date.date' => 'Ngày đặt bàn không hợp lệ.',

            'booking_time.required' => 'Vui lòng chọn thời gian đặt bàn.',

            'note.string' => 'Ghi chú phải là chuỗi.',
            'note.max' => 'Ghi chú không được vượt quá 255 ký tự.',
        ];
    }
}
