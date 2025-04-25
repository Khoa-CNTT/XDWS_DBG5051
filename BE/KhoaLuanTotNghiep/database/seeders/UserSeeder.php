<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Support\Facades\Hash;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class UserSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $faker = \Faker\Factory::create();
        
        for($i = 0; $i<10; $i++){
            User::create([
                'name' => $faker->word(),
                'email' => $faker->unique()->safeEmail(),
                'password' =>Hash::make('password123'),
                'role' => $faker->randomElement(['staff', 'admin']),
            ]);
        }
    }
}
