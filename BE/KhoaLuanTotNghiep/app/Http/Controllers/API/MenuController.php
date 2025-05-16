<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Http\Requests\MenuRequest;
use App\Models\Menu;
use App\Services\AIRecommendationService;
use Intervention\Image\Laravel\Facades\Image;
use Illuminate\Http\Request;

class MenuController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $menu = Menu::with('category')->get();
        if ($menu) {
            return response()->json([
                'data' => $menu,
            ], 200);
        } else {
            return response()->json([
                'message' => "Không có món nào "
            ], 401);
        }
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(MenuRequest $request)
    {
        $data = $request->all();

        if ($request->hasFile('image')) {
            $file = $request->file('image');
            $name = $file->getClientOriginalName();
            // Lưu tên file vào cột 'image'
            $data['image'] = $name;
            // Di chuyển file hình ảnh vào thư mục lưu trữ mong muốn
            $file->move('upload/menu', $name);
        }

        $menu = Menu::create($data);

        if ($menu) {
            return response()->json([
                'message' => 'Thêm món thành công',
                'data' => $menu
            ], 201);
        } else {
            return response()->json([
                'message' => 'Thêm món thất bại.',
            ], 401);
        }
    }



    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        $menu = Menu::find($id);
        if ($menu) {
            return response()->json([
                'data' => $menu,
            ], 200);
        } else {
            return response()->json([
                'message' => "Không tìm thấy món cần tìm. "
            ], 401);
        }
    }
    /**
     * Update the specified resource in storage.
     */
    public function update(MenuRequest $request, string $id)
    {
        $menu = Menu::find($id);
        if (!$menu) {
            return response()->json([
                'message' => "Món không tồn tại"
            ], 404);
        }
        $data = $request->all();
        if ($request->hasFile('image')) {
            $file = $request->file('image');
            $name = $file->getClientOriginalName();
            // Lưu tên file vào cột 'image'
            $data['image'] = $name;
            // Di chuyển file hình ảnh vào thư mục lưu trữ mong muốn
            $file->move('upload/menu', $name);
        }

        $menu->update($data);

        if (!$menu) {
            return response()->json([
                'message' => "Món không tồn tại"
            ], 401);
        }

        return response()->json([
            'message' => 'Cập nhật món thành công.',
            'data' => $menu
        ]);
    }


    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        $menu = Menu::findOrFail($id);
        if (!$menu) {
            return response()->json([
                'message' => "Món không tồn tại"
            ], 401);
        }

        $menu->delete();
        return response()->json([
            'message' => 'Xóa món thành công.'
        ]);
    }

    public function addToCart(Request $request)
    {
        $MenuID = $request->input('menu_id');
        $cart = session()->get('cart', []);

        $menu = Menu::find($MenuID);
        if (!$menu) {
            return response()->json(['message' => 'Không tìm thấy món ăn!'], 404);
        }

        if (isset($cart[$MenuID])) {
            // Nếu đã có trong giỏ thì tăng số lượng
            $cart[$MenuID]['qty']++;
        } else {
            // Thêm món mới vào giỏ hàng
            $cart[$MenuID] = [
                'qty' => 1,
                'price' => $menu->price,
                'name' => $menu->name, 
                'image' => $menu->image 
            ];
        }

        session()->put('cart', $cart);
        return response()->json(['message' => 'Thêm vào giỏ hàng thành công!', 'cart' => $cart]);
    }


    public function getPopularMenus(AIRecommendationService $service)
    {
        $recommendedDishes = $service->getRecommendedDishes(8); // ví dụ lấy 8 món

        return response()->json($recommendedDishes);
    }



}
