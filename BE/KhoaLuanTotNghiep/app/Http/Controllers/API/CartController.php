<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Models\Menu;
use Illuminate\Http\Request;

class CartController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $cart = session()->get('cart', []);
        $cartItems = [];
        // lấy từng phần tử trong ss
        foreach ($cart as $id => $detail) {
            $menu = Menu::find($id);
            if ($menu) {
                $cartItems[] = [
                    'menu' => $menu,
                    'quantity' => $detail['qty']
                ];
            }
        }

        return response()->json([
            'data' => $cartItems
        ], 200);
    }

    public function upQtyCart(Request $request)
    {
        $cart = session()->get('cart', []);
        $id = $request->id;
        if (isset($cart[$id])) {
            $cart[$id]['qty']++;
        }
        session()->put('cart', $cart);
        return response()->json(['status' => 'success']);
    }
    public function downQtyCart(Request $request)
    {
        $cart = session()->get('cart', []);
        $id = $request->id;

        if (isset($cart[$id])) {
            // Nếu số lượng hiện tại là 1, xóa sản phẩm khỏi giỏ hàng
            if ($cart[$id]['qty'] == 1) {
                unset($cart[$id]);
            } else {
                // Nếu lớn hơn 1, giảm số lượng đi 1
                $cart[$id]['qty']--;
            }
        }

        session()->put('cart', $cart);

        // Trả về phản hồi JSON để xử lý trên frontend
        return response()->json(['status' => 'success']);
    }

    // Bạn đang thiếu return
    public function deleteQtyCart(Request $request)
    {
        $cart = session()->get('cart', []);
        $id = $request->id;
        if (isset($cart[$id])) { // thêm isset kiểm tra kỹ
            unset($cart[$id]);
        }
        session()->put('cart', $cart);

        // Thiếu return nè
        return response()->json(['status' => 'success']);
    }


}
