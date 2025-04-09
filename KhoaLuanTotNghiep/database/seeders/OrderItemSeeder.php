<?php

namespace Database\Seeders;

use App\Models\Menu;
use App\Models\Order;
use App\Models\OrderItem;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class OrderItemSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $faker = \Faker\Factory::create();

        // Lấy danh sách order và menu từ database
        $orders = Order::pluck('id')->toArray();
        $menus = Menu::pluck('id')->toArray();

        // Tạo 20 mục chi tiết đơn hàng ngẫu nhiên
        for ($i = 0; $i < 10; $i++) {
            OrderItem::create([
                'order_id' => $faker->randomElement($orders),
                'menu_id' => $faker->randomElement($menus),
                'quantity' => $faker->numberBetween(1, 5),
            ]);
        }
    }
}
