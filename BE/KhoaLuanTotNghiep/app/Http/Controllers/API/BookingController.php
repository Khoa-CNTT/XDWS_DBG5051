<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Http\Requests\BookingRequest;
use App\Models\Booking;
use Illuminate\Http\Request;
use Illuminate\Notifications\Notification;
class BookingController extends Controller
{
    public function index()
    {
        $booking = Booking::orderBy('booking_date', 'desc')->get();
        if (!$booking) {
            return response()->json([
                'massage' => "Không có đơn đặt nào"
            ], 404);
        }
        return response()->json([
            'data' => $booking
        ], 200);
    }

    public function store(BookingRequest $request)
    {
       dd($request->all());
        $data = $request->only([
            'customer_name',
            'email',
            'phone',
            'guests',
            'booking_date',
            'booking_time',
            'note',
            'status' 
        ]);
        $booking = Booking::create($data);

        return response()->json([
            'success' => true,
            'message' => 'Đặt bàn thành công!',
            'data' => $booking
        ], 201);
    }

    public function update(BookingRequest $request, $id)
    {
        $booking = Booking::find($id);

        if (!$booking) {
            return response()->json([
                'success' => false,
                'message' => 'Không tìm thấy đơn đặt bàn.'
            ], 404);
        }

        // Cập nhật dữ liệu từ request
        $booking->update($request->validated());

        // Nếu có thay đổi status thì xử lý gửi thông báo
        if ($request->has('status')) {
            $status = $request->input('status');

            if ($status === 'confirmed') {
                // Gửi thông báo xác nhận đặt bàn thành công
                Notification::route('mail', $booking->email)
                    ->notify(new \App\Notifications\BookingConfirmed($booking));
            }

            if ($status === 'cancelled') {
                // Gửi thông báo huỷ đặt bàn
                Notification::route('mail', $booking->email)
                    ->notify(new \App\Notifications\BookingCancelled($booking)); // anh cần tạo thêm notification này nếu chưa có
            }
        }

        return response()->json([
            'message' => 'Cập nhật đơn đặt bàn thành công.',
            'data' => $booking
        ]);
    }



}
