<?php

namespace App\Services;

use App\Models\Menu;
use App\Models\OrderItem;

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
        return Menu::select('menus.*')
            ->withCount(['orderItems as total_orders' => function ($query) {
                $query->select(\DB::raw("count(*)"));
            }])
            ->orderByDesc('total_orders')
            ->take($limit)
            ->get();
    }
}
