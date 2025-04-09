<?php

namespace Database\Seeders;

use App\Models\Category;
use App\Models\Menu;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class MenuSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $faker = \Faker\Factory::create();
        $categoryIds = Category::pluck('id')->toArray(); // Lấy danh sách ID hợp lệ
        for($i = 0; $i<10; $i++){
            Menu::create([
                'name' => $faker->word(),
                'category_id' => $faker->randomElement($categoryIds),
                'price' => $faker->randomFloat(2, 50, 500),
                'image' => $faker->imageUrl(),
            ]);
        }
    }
}
