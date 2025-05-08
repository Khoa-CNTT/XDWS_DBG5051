<?php

namespace Database\Seeders;

use App\Models\User;
use Hash;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class AdminSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        User::create([
            'name' =>'Thanh',
            'phone' =>'0795142551',
            'email' =>'thanh123@gmail.com',
            'password' => 'thanh123',
            'role' => 'admin'
        ]);
    }
}
