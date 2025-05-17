<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Models\OrderItem;
use App\Models\Rate;
use Illuminate\Http\Request;

class RateController extends Controller
{
    // Lấy danh sách món từ order_id
    public function getFoodByOrder($order_id)
    {
        $items = OrderItem::where('order_id', $order_id)->with('menu')->get();

        if ($items->isEmpty()) {
            return response()->json(['message' => 'Không tìm thấy món ăn cho đơn hàng này'], 404);
        }

        $foods = $items->map(function ($item) {
            return [
                'menu_id' => $item->menu->id,
                'name' => $item->menu->name,
                'image' => $item->menu->image ?? null,
                'description' => $item->menu->description ?? null,
            ];
        });

        return response()->json(['foods' => $foods]);
    }

    // Nhận đánh giá
    public function submitRating(Request $request)
    {
        $request->validate([
            'order_id' => 'required|integer',
            'ratings' => 'required|array',
            'ratings.*.menu_id' => 'required|exists:menu,id',
            'ratings.*.rating' => 'required|integer|min:1|max:5',
            'ratings.*.comment' => 'nullable|string|max:1000',
        ]);

        foreach ($request->ratings as $rating) {
            Rate::create([
                'order_id' => $request->order_id,
                'menu_id' => $rating['menu_id'],
                'rating' => $rating['rating'],
                'comment' => $rating['comment'] ?? null,
            ]);
        }

        return response()->json(['message' => 'Đánh giá đã được lưu thành công. Cảm ơn bạn!']);
    }
}
