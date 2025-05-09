<?php

namespace Database\Seeders;

use App\Models\Table;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class TableSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $faker = \Faker\Factory::create();
        for($i = 0; $i<10; $i++){
            Table::create([
                'table_number' =>'A' . $i,
                'qr_code' => "http://127.0.0.1:8000/storage/qrcodes/table_{$i}.png",
                'status' => $faker->randomElement(['available', 'occupied', 'reserved']),
            ]);
        }
    }
}
