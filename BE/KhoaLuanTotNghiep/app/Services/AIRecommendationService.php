<?php

namespace App\Services;

use App\Models\Menu;

class AIRecommendationService
{
    /**
     * Gợi ý món ăn dựa trên tần suất gọi nhiều nhất
     *
     * @param int $limit Số món muốn gợi ý
     * @return \Illuminate\Support\Collection
     */
    public function getRecommendedDishes(int $limit = 5)
    {
        return Menu::withCount('orderItems')  // Sử dụng 'orderItems' thay vì truy vấn trực tiếp
            ->orderByDesc('order_items_count')  // 'order_items_count' là tên mặc định của cột đếm trong withCount
            ->take($limit)
            ->get();
    }
}
