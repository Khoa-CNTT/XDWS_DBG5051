<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Models\Order;
use App\Models\Payment;
use Illuminate\Http\Request;
use SimpleSoftwareIO\QrCode\Facades\QrCode;

class CheckoutController extends Controller
{
    public function getOrdersGroupedByTable()
    {
        $orders = Order::where('status', 'pending')  // điều kiện lấy đơn chưa thanh toán
            ->select('table_number')
            ->selectRaw('SUM(total_price) as total_amount')
            ->groupBy('table_number')
            ->get();

        return response()->json([
            'data' => $orders
        ]);
    }
    // Gửi yêu cầu thanh toán qua VNPAY
    public function vnpay_payment(Request $request)
    {
        $data = $request->validate([
            'order_id' => 'required|integer',
            'amount' => 'required|numeric'
        ]);

        $code_cart = rand(1000, 9999);
        $vnp_TmnCode = "D3AXQ5I2";
        $vnp_HashSecret = "T00N1I46MWFOLHQF5Z09YXS8VA9WGMO0";
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
        $query = http_build_query($inputData);
        $hashdata = '';
        $i = 0;
        foreach ($inputData as $key => $value) {
            $hashdata .= ($i++ ? '&' : '') . $key . '=' . $value;
        }
        $vnpSecureHash = hash_hmac('sha512', $hashdata, $vnp_HashSecret);

        $vnp_Url .= '?' . $query;
        $vnp_Url .= '&vnp_SecureHashType=SHA512';
        $vnp_Url .= '&vnp_SecureHash=' . $vnpSecureHash;
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
            // Cập nhật trạng thái đơn hàng
            $order = Order::find($payment->order_id);
            if ($order) {
                $order->status = 'completed'; // hoặc 'paid' tuỳ theo logic của bạn
                $order->save();
            }
            //Tạo mã QR để đánh giá
            $qrCodeData = "http://192.168.1.191:5173/rate?order_id=" . $payment->order_id;
            $qrCode = QrCode::format('png')->size(300)->generate($qrCodeData);
            return response()->json([
                'message' => 'thanh toán thành công',
                'data' => $payment,
                'review_url' => $qrCodeData,
                'qr_code_base64' => $qrCode
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
            'method' => 'required|in:cash,card',
        ]);

        $payment = Payment::create([
            'order_id' => $data['order_id'],
            'amount' => $data['amount'],
            'method' => $data['method'],
            'status' => 'completed',

        ]);
        // Cập nhật trạng thái đơn hàng
        $order = Order::find($payment->order_id);
        if ($order) {
            $order->status = 'completed';
            $order->save();
        }
        // Tạo mã QR để đánh giá
        $qrCodeData = "http://192.168.1.191:5173/rate?order_id=" . $payment->order_id;
        $qrCode = QrCode::format('png')->size(300)->generate($qrCodeData);
        return response()->json([
            'message' => 'thanh toán thành công',
            'data' => $payment,
            'review_url' => $qrCodeData,
            'qr_code_base64' => $qrCode
        ]);
    }
}
