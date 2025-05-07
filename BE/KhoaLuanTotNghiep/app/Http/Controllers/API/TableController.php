<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Http\Requests\TableRequest;
use App\Models\Table;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use SimpleSoftwareIO\QrCode\Facades\QrCode;
use Illuminate\Support\Facades\Storage;

class TableController extends Controller
{
    /**
     * Lấy danh sách tất cả bàn
     */
    public function index()
    {
        $tables = Table::all();

        return response()->json([
            'data' => $tables->isNotEmpty() ? $tables : "Không có bàn nào"
        ], $tables->isNotEmpty() ? 200 : 404);
    }

    /**
     * Thêm mới một bàn với mã QR
     */
    public function store(TableRequest $request): JsonResponse
    {
        $tableNumber = strtoupper($request->table_number);
        $status = $request->status ?? 'available';

        // Kiểm tra xem bàn đã tồn tại chưa
        if (Table::where('table_number', $tableNumber)->exists()) {
            return response()->json([
                'message' => "Bàn số {$tableNumber} đã tồn tại"
            ], 400);
        }

        // Kiểm tra và tạo thư mục nếu chưa tồn tại
        $uploadDirectory = public_path('upload/qr_code');
        if (!file_exists($uploadDirectory)) {
            mkdir($uploadDirectory, 0777, true); // Tạo thư mục nếu không tồn tại
        }

        // Tạo mã QR
        $qrCodeData = "Table: " . $tableNumber;
        $qrCode = QrCode::format('png')->size(300)->generate($qrCodeData);  // Generate PNG

        // Đặt tên file QR code và lưu vào thư mục public/upload/qr_code
        $qrCodePath = "qr_code/table_{$tableNumber}.png";
        file_put_contents(public_path("upload/{$qrCodePath}"), $qrCode);

        // Tạo liên kết URL cho QR code
        $qrCodeUrl = asset("upload/{$qrCodePath}");  // Đảm bảo sử dụng asset để có URL chính xác

        // Lưu thông tin bàn vào database
        $table = Table::create([
            'table_number' => $tableNumber,
            'qr_code' => $qrCodeUrl, // Đường dẫn có thể truy cập
            'status' => $status,
        ]);

        return response()->json([
            'message' => "QR code tạo thành công",
            'data' => $table
        ], 201);
    }



    /**
     * Cập nhật thông tin bàn
     */

    public function show(string $id)
    {
        $table = Table::find($id);
        if ($table) {
            return response()->json([
                'data' => $table,
            ], 200);
        } else {
            return response()->json([
                'message' => "Không tìm thấy bàn cần tìm. "
            ], 401);
        }
    }
    public function update(TableRequest $request, $id)
    {
        $table = Table::find($id);

        if (!$table) {
            return response()->json([
                'message' => "Bàn không tồn tại"
            ], 404);
        }

        // Kiểm tra trạng thái hợp lệ
        if ($request->has('status')) {
            $validStatuses = ['available', 'occupied', 'reserved'];
            if (!in_array($request->status, $validStatuses)) {
                return response()->json([
                    'message' => "Trạng thái không hợp lệ"
                ], 400);
            }
        }

        // Kiểm tra số bàn có trùng không (nếu có cập nhật)
        if ($request->has('table_number')) {
            $newTableNumber = strtoupper($request->table_number);
            if ($newTableNumber !== $table->table_number && Table::where('table_number', $newTableNumber)->exists()) {
                return response()->json([
                    'message' => "Bàn số {$newTableNumber} đã tồn tại"
                ], 400);
            }
            $table->table_number = $newTableNumber;
        }

        // Kiểm tra và tạo thư mục QR nếu chưa tồn tại
        $uploadDirectory = public_path('upload/qr_code');
        if (!file_exists($uploadDirectory)) {
            mkdir($uploadDirectory, 0777, true); // Tạo thư mục nếu không tồn tại
        }

        // Tạo mã QR mới (nếu có thay đổi số bàn)
        $qrCodeData = "Table: " . $table->table_number;
        $qrCode = QrCode::format('png')->size(300)->generate($qrCodeData);  // Generate PNG

        // Đặt tên file QR code và lưu vào thư mục public/upload/qr_code
        $qrCodePath = "qr_code/table_{$table->table_number}.png";
        file_put_contents(public_path("upload/{$qrCodePath}"), $qrCode);

        // Cập nhật URL QR code
        $qrCodeUrl = asset("upload/{$qrCodePath}");

        // Cập nhật thông tin bàn
        $table->status = $request->status ?? $table->status;
        $table->qr_code = $qrCodeUrl;  // Cập nhật URL mới cho QR code
        $table->save();

        return response()->json([
            'message' => "Bàn đã được cập nhật",
            'data' => $table
        ], 200);
    }


    /**
     * Xóa bàn và mã QR
     */
    public function destroy($id)
    {
        $table = Table::find($id);

        if (!$table) {
            return response()->json([
                'message' => "Bàn không tồn tại"
            ], 404);
        }

        // Xóa mã QR nếu tồn tại
        if ($table->qr_code && Storage::exists(str_replace('upload/', 'public/', $table->qr_code))) {
            Storage::delete(str_replace('upload/', 'public/', $table->qr_code));
        }

        // Xóa bàn khỏi database
        $table->delete();

        return response()->json([
            'message' => "Xóa bàn thành công"
        ], 200);
    }
}
