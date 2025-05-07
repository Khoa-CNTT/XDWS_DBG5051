<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Models\Payment;
use Illuminate\Http\Request;

class CheckoutController extends Controller
{
    // 1. Gửi yêu cầu thanh toán qua VNPAY
    public function vnpay_payment(Request $request)
    {
        $data = $request->validate([
            'order_id' => 'required|integer',
            'amount' => 'required|numeric'
        ]);

        $code_cart = rand(1000, 9999);
        $vnp_TmnCode = "1VYBIYQP";
        $vnp_HashSecret = "NOH6MBGNLQL9O9OMMFMZ2AX8NIEP50W1";
        $vnp_Url = "https://sandbox.vnpayment.vn/paymentv2/vpcpay.html";
        $vnp_Returnurl = route('vnpay.callback'); // phải định nghĩa route này

        $vnp_TxnRef = $code_cart;
        $vnp_OrderInfo = "Thanh toán đơn hàng #" . $data['order_id'];
        $vnp_OrderType = 'billpayment';
        $vnp_Amount = $data['amount'] * 100;
        $vnp_Locale = 'vn';
        $vnp_IpAddr = $request->ip();

        $inputData = [
            "vnp_Version" => "2.1.0",
            "vnp_TmnCode" => $vnp_TmnCode,
            "vnp_Amount" => $vnp_Amount,
            "vnp_Command" => "pay",
            "vnp_CreateDate" => now()->format('YmdHis'),
            "vnp_CurrCode" => "VND",
            "vnp_IpAddr" => $vnp_IpAddr,
            "vnp_Locale" => $vnp_Locale,
            "vnp_OrderInfo" => $vnp_OrderInfo,
            "vnp_OrderType" => $vnp_OrderType,
            "vnp_ReturnUrl" => $vnp_Returnurl,
            "vnp_TxnRef" => $vnp_TxnRef
        ];

        ksort($inputData);
        $query = '';
        $hashdata = '';
        $i = 0;

        foreach ($inputData as $key => $value) {
            $query .= urlencode($key) . '=' . urlencode($value) . '&';
            $hashdata .= ($i++ ? '&' : '') . urlencode($key) . '=' . urlencode($value);
        }

        $vnpSecureHash = hash_hmac('sha512', $hashdata, $vnp_HashSecret);
        $vnp_Url .= '?' . $query . 'vnp_SecureHash=' . $vnpSecureHash;

        return response()->json([
            'code' => '00',
            'message' => 'success',
            'payment_url' => $vnp_Url
        ]);
    }

    // 2. Xử lý callback sau thanh toán
    public function vnpay_callback(Request $request)
    {
        $inputData = $request->all();
        $vnp_HashSecret = "NOH6MBGNLQL9O9OMMFMZ2AX8NIEP50W1";

        $vnp_SecureHash = $inputData['vnp_SecureHash'];
        unset($inputData['vnp_SecureHash']);
        unset($inputData['vnp_SecureHashType']);

        ksort($inputData);
        $hashData = '';
        $i = 0;

        foreach ($inputData as $key => $value) {
            $hashData .= ($i++ ? '&' : '') . urlencode($key) . '=' . urlencode($value);
        }

        $secureHash = hash_hmac('sha512', $hashData, $vnp_HashSecret);

        if ($secureHash === $vnp_SecureHash && $inputData['vnp_ResponseCode'] == '00') {
            // Ghi nhận thanh toán
            $payment = Payment::create([
                'order_id' => $inputData['vnp_TxnRef'],
                'amount' => $inputData['vnp_Amount'] / 100,
                'method' => 'VNPay',
                'status' => 'completed'
            ]);
            return response()->json([
                'message' => 'thanh toán thành công',
                'data' => $payment
            ]);
        }

        return response()->json([
            'error' => 'thanh toán thất bại'
        ]);
    }

    public function internal_payment(Request $request)
    {
        $data = $request->validate([
            'order_id' => 'required|integer',
            'amount' => 'required|numeric',
            'method' => 'required|in:cash,card'
        ]);

        $payment = Payment::create([
            'order_id' => $data['order_id'],
            'amount' => $data['amount'],
            'method' => $data['method'],
            'status' => 'completed'
        ]);

        return response()->json([
            'message' => 'thanh toán thành công',
            'data' => $payment
        ]);
    }
}
