<?php

use App\Http\Controllers\API\CartController;
use App\Http\Controllers\API\MenuController;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
|
| Here is where you can register web routes for your application. These
| routes are loaded by the RouteServiceProvider and all of them will
| be assigned to the "web" middleware group. Make something great!
|
*/

Route::prefix('cart')->group(function () {
    Route::post('/add-to-cart', [MenuController::class, 'addToCart']);
    Route::get('/', [CartController::class, 'index']);
    Route::post('/up', [CartController::class, 'upQtyCart']);
    Route::post('/down', [CartController::class, 'downQtyCart']);
    Route::post('/delete', [CartController::class, 'deleteQtyCart']);
});