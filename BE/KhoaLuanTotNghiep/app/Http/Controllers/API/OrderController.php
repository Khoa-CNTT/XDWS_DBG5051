<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Models\Order;
use App\Models\OrderItem;
use Illuminate\Http\Request;

class OrderController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $order = Order::with('items.menu', 'table')->get(); // thêm 'table'
        if ($order) {
            return response()->json([
                'data' => $order,
            ], 200);
        } else {
            return response()->json([
                'message' => 'Không có đơn hàng nào.',
            ], 200);
        }
    }

    /**
     * Show the form for creating a new resource.
     */
    public function placeOrder(Request $request)
    {
        $cart = session()->get('cart', []);

        if (empty($cart)) {
            return response()->json(['message' => 'Giỏ hàng trống!'], 400);
        }

        $totalPrice = 0;

        // Tính tổng tiền đúng cách
        foreach ($cart as $menuId => $item) {
            $totalPrice += $item['price'] * $item['qty'];
        }

        $order = Order::create([
            'table_number' => $request->table_number,
            'total_price' => $totalPrice,
            'status' => 'pending',
        ]);


        foreach ($cart as $menuId => $item) {
            OrderItem::create([
                'order_id' => $order->id,
                'menu_id' => $menuId, // vì key là menu_id
                'quantity' => $item['qty'],
            ]);
        }

        session()->forget('cart'); // Xóa giỏ hàng sau khi đặt đơn

        return response()->json(['message' => 'Đặt hàng thành công!', 'order' => $order], 201);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        //
    }

    /**
     * Display the specified resource.
     */
    public function show($id)
    {
        $order = Order::with('items.menu', 'table')->find($id);

        if (!$order) {
            return response()->json(['message' => 'Order not found'], 404);
        }

        return response()->json($order);
    }


    /**
     * Show the form for editing the specified resource.
     */
    public function edit(string $id)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        //
    }
}
