<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Http\Requests\TableRequest;
use App\Models\Table;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Storage;
use SimpleSoftwareIO\QrCode\Facades\QrCode;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;

class TableController extends Controller
{
    public function store(TableRequest $request): JsonResponse
    {
        Log::info('TableController@store called', [
            'user' => auth()->user(),
            'role' => auth()->user()->role
        ]);
    
        $tableNumber = strtoupper($request->table_number);
        $status = $request->status ?? 'available';
    
        // Kiểm tra xem bàn đã tồn tại chưa
        if (Table::where('table_number', $tableNumber)->exists()) {
            return response()->json([
                'message' => "Bàn số {$tableNumber} đã tồn tại"
            ], 400);
        }
    
        // Kiểm tra và tạo thư mục nếu chưa tồn tại
        if (!Storage::exists('public/qrcodes')) {
            Storage::makeDirectory('public/qrcodes');
        }
    
        // Tạo mã QR với URL đến trang QrOrdering
        $qrCodeData = config('app.frontend_url') . "/order/{$tableNumber}";
        $qrCode = QrCode::format('svg')->size(300)->generate($qrCodeData);
        $qrCodePath = "qrcodes/table_{$tableNumber}.png";
    
        // Lưu QR vào storage
        Storage::put("public/{$qrCodePath}", $qrCode);
    
        // Lưu thông tin bàn vào database
        $table = Table::create([
            'table_number' => $tableNumber,
            'qr_code' => asset("upload/{$qrCodePath}"), // Đường dẫn có thể truy cập
            'status' => $status,
        ]);
    
        return response()->json([
            'message' => "QR code tạo thành công",
            'data' => $table
        ], 201);
    }

    public function index()
    {
        Log::info('TableController@index called', [
            'user' => auth()->user(),
            'role' => auth()->user()->role
        ]);
        
        // Code xử lý...
    }
} 