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
        // Kiểm tra xem bàn đã tồn tại chưa
        if (Table::where('table_number', $tableNumber)->exists()) {
            return response()->json([
                'message' => "Bàn số {$tableNumber} đã tồn tại"
            ], 400);
        }
        //Thư mục lưu qrCode
        $qrDir = public_path('upload/qr_code');

        // Tạo mã QR
        $qrCodeData = "http://192.168.1.191:5173/list-menu?table=" . $tableNumber;
        $qrCode = QrCode::format('png')->size(300)->generate($qrCodeData);  // Generate PNG

        $fileName = "table_{$tableNumber}.png";
        $filePath = $qrDir . '/' . $fileName;
        file_put_contents($filePath, $qrCode);

        $qrCodeUrl = asset("upload/qr_code/{$fileName}");

        $table = new Table();
        $table->table_number = $tableNumber;
        $table->qr_code = $qrCodeUrl;
        $table->save();

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
    public function update(Request $request, $id)
    {
        $table = Table::find($id);
        if (!$table) {
            return response()->json([
                'message' => 'Bàn không tồn tại'
            ], 404);
        }
        if ($request->has('table_number')) {
            $table->table_number = strtoupper($request->table_number);
        }
        // Kiểm tra giá trị status hợp lệ (nếu cần)
        $validStatuses = ['available', 'occupied', 'reserved'];
        if (!in_array($request->status, $validStatuses)) {
            return response()->json([
                'message' => 'Trạng thái không hợp lệ'
            ], 400);
        }


        // Cập nhật status
        $table->status = $request->status;
        $table->save();

        return response()->json([
            'message' => 'Cập nhật trạng thái bàn thành công',
            'data' => $table
        ], 200);
    }


    /**
     * Xóa bàn và mã QR
     */
    public function destroy($id)
    {
        $table = Table::findOrFail($id);

        // Xoá file QR nếu tồn tại
        if ($table->qr_code) {
            $filePath = public_path(parse_url($table->qr_code, PHP_URL_PATH));
            if (file_exists($filePath)) {
                unlink($filePath);
            }
        }

        $table->delete();

        return response()->json([
            'message' => "Xóa bàn thành công"
        ], 200);
    }
}
