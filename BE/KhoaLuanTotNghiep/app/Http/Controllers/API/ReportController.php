<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Models\Report;
use Carbon\Carbon;
use DB;
use Illuminate\Http\Request;

class ReportController extends Controller
{
    public function getChartData(Request $request)
    {
        // Lấy tham số truyền vào (hoặc mặc định)
        $fromDate = $request->input('from_date', Carbon::now()->subDays(30)->format('Y-m-d'));
        $toDate = $request->input('to_date', Carbon::now()->format('Y-m-d'));
        $groupBy = $request->input('group_by', 'day'); // 'day', 'month', 'year'

        // Chọn định dạng ngày theo kiểu group
        $dateFormat = $this->getDateFormat($groupBy);

        // Truy vấn dữ liệu từ bảng reports
        $data = Report::select(
            DB::raw("DATE_FORMAT(report_date, '$dateFormat') as period"),
            DB::raw("SUM(total_order) as total_orders"),
            DB::raw("SUM(total_amount) as total_amount")
        )
            ->whereBetween('report_date', [$fromDate, $toDate])
            ->groupBy('period')
            ->orderBy('period')
            ->get();

        return response()->json([
            'success' => true,
            'data' => $data
        ]);
    }

    /**
     * Trả về định dạng date format phù hợp với group_by
     */
    private function getDateFormat($groupBy)
    {
        switch ($groupBy) {
            case 'month':
                return '%Y-%m'; // Năm-Tháng
            case 'year':
                return '%Y'; // Năm
            case 'day':
            default:
                return '%Y-%m-%d'; // Năm-Tháng-Ngày
        }
    }
}
