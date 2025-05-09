<?php

namespace Database\Seeders;

use App\Models\Order;
use App\Models\Table;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class OrderSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $faker = \Faker\Factory::create();
        $tableNumbers = Table::pluck('table_number')->toArray();
        for($i = 0; $i<10; $i++){
            Order::create([
                'number_table' => $faker->randomElement($tableNumbers),
                'total_price' => $faker->randomFloat(2, 50, 500),
                'status' => $faker->randomElement(['pending', 'completed']),
            ]);
        }
    }
}
