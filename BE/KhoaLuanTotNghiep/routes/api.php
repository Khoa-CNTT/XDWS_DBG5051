<?php

use App\Http\Controllers\API\AuthController;
use App\Http\Controllers\API\BookingController;
use App\Http\Controllers\API\CateController;
use App\Http\Controllers\API\MenuController;
use App\Http\Controllers\API\OrderController;
use App\Http\Controllers\API\ReportController;
use App\Http\Controllers\API\TableController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider and all of them will
| be assigned to the "api" middleware group. Make something great!
|
*/


Route::post('/login', [AuthController::class, 'login']);

// Các route yêu cầu xác thực (đã đăng nhập)
Route::middleware('auth:sanctum')->group(function () {
    Route::get('/user', function (Request $request) {
        return response()->json($request->user());
    });

    // Các API khác cần đăng nhập mới được dùng
    Route::post('/logout', [AuthController::class, 'logout']);

    // 🔹 Chỉ admin mới có quyền vào route này
    Route::middleware('role:admin')->group(function () {
        Route::get('/admin/dashboard', [ReportController::class, 'getChartData']);
        // Tai Khoan
        Route::get('/list-user', [AuthController::class, 'index']);
        //add
        Route::post('/add-user', [AuthController::class, 'register']);
        //delete
        Route::delete('/user/{id}', [AuthController::class, 'destroy']);

        // Quan ly ban
        // ban
        Route::get('/table', [TableController::class, 'index']);
        
        // update
        Route::put('/update-table/{id}', [TableController::class, 'update']);
        // delete
        Route::delete('/table/{id}', [TableController::class, 'destroy']);

        //Danh muc
        // add
        
        // update
        Route::put('/update-cate/{id}', [CateController::class, 'update']);
        // delete
        Route::delete('/delete-cate/{id}', [CateController::class, 'destroy']);

        //Menu
        // add
        Route::post('/add-menu', [MenuController::class, 'store']);
        // update
        Route::put('/update-menu/{id}', [MenuController::class, 'update']);
        // delete
        Route::delete('/cate/{id}', [MenuController::class, 'destroy']);

        //Quan ly Dat ban
        Route::get('/list-booking', [BookingController::class, 'index']);
        //câp nhật đơn đặt bàn
        Route::put('/update-booking/{id}', [BookingController::class, 'update']);
    });

    // 🔹 Chỉ staff mới có quyền vào route này
    Route::middleware('role:staff')->group(function () {
        Route::get('/staff/dashboard', function () {
            return response()->json(['message' => 'Chào mừng Staff!']);
        });
        // Đơn hàng chi tiết
        Route::get('/order-item/{id}', [OrderController::class, 'show']);
        // Bàn
        Route::get('/table', [TableController::class, 'index']);
    });
});


// Danh mục 
Route::get('/cate', [CateController::class, 'index']);

//Menu
Route::get('/list-menu', [MenuController::class, 'index']);

// Đơn hàng
Route::get('/order', [OrderController::class, 'index']);

//AI gợi ý món ăn
Route::get('/popular-dishes', [MenuController::class, 'getPopularMenus']);

//Dat ban
Route::post('/table-booking', [BookingController::class, 'store']);
Route::post('/add-cate', [CateController::class, 'store']);
// add
Route::post('/add-table', [TableController::class, 'store']);