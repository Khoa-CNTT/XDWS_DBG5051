<?php

use App\Http\Controllers\API\AuthController;
use App\Http\Controllers\API\BookingController;
use App\Http\Controllers\API\CartController;
use App\Http\Controllers\API\CateController;
use App\Http\Controllers\API\ChatbotController;
use App\Http\Controllers\API\CheckoutController;
use App\Http\Controllers\API\MenuController;
use App\Http\Controllers\API\OrderController;
use App\Http\Controllers\API\RateController;
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
        // Tai Khoan
        Route::get('/admin/list-user', [AuthController::class, 'index']);
        //add
        Route::post('/admin/add-user', [AuthController::class, 'register']);
        // update
        Route::put('/admin/update-user/{id}', [AuthController::class, 'update']);
        //delete
        Route::delete('/admin/user/{id}', [AuthController::class, 'destroy']);

        // Quan ly ban
        // add
        Route::post('/admin/add-table', [TableController::class, 'store']);
        // update
        Route::put('/admin/update-table/{id}', [TableController::class, 'update']);
        // delete
        Route::delete('/admin/table/{id}', [TableController::class, 'destroy']);

        //Danh muc
        // add
        Route::post('/admin/add-cate', [CateController::class, 'store']);
        // update
        Route::put('/admin/update-cate/{id}', [CateController::class, 'update']);
        // delete
        Route::delete('/admin/delete-cate/{id}', [CateController::class, 'destroy']);

        //Menu
        // add
        Route::post('/admin/add-menu', [MenuController::class, 'store']);
        // update
        Route::put('/admin/update-menu/{id}', [MenuController::class, 'update']);
        // delete
        Route::delete('/admin/cate/{id}', [MenuController::class, 'destroy']);

        //Quan ly Dat ban
        Route::get('/admin/list-booking', [BookingController::class, 'index']);
        //câp nhật đơn đặt bàn
        Route::put('/admin/update-booking/{id}', [BookingController::class, 'update']);

        //Đơn hàng
        //Update
        Route::put('/admin/update-order/{id}', [OrderController::class, 'update']);
        //Thống kê        
        Route::get('/admin/dashboard', [ReportController::class, 'getChartData']);

    });

    // 🔹 Chỉ staff mới có quyền vào route này
    Route::middleware('role:staff')->group(function () {
        Route::get('/staff/dashboard', function () {
            return response()->json(['message' => 'Chào mừng Staff!']);
        });
        // Các API khác cần đăng nhập mới được dùng
        Route::post('/logout', [AuthController::class, 'logout']);


    });
});

// Danh mục 
Route::get('/cate', [CateController::class, 'index']);

// ban
Route::get('/table', [TableController::class, 'index']);

//Menu
Route::get('/list-menu', [MenuController::class, 'index']);

// Đơn hàng
Route::get('/order', [OrderController::class, 'index']);

// Đơn hàng chi tiết
Route::get('/order-item/{id}', [OrderController::class, 'show']);


//AI gợi ý món ăn
Route::get('/popular-dishes', [MenuController::class, 'getPopularMenus']);

//Dat ban
Route::post('/booking', [BookingController::class, 'store']);


//Chatbox
Route::post('/chatbox', [ChatbotController::class, 'ask']);

//Đánh giá
Route::get('/rating/form/{order_id}', [RateController::class, 'getFoodByOrder']);
Route::post('/rating/submit', [RateController::class, 'submitRating']);

//Thanh toán
//list
Route::get('/payment', [CheckoutController::class, 'getOrdersGroupedByTable']);
//vnpay
Route::post('/vnpay_payment', [CheckoutController::class, 'vnpay_payment']);
//phản hồi VNpay
Route::get('/vnpay_callback', [CheckoutController::class, 'vnpay_callback'])->name('vnpay.callback');
//phản hồi cash, card
Route::post('/internal_payment', [CheckoutController::class, 'internal_payment']);
