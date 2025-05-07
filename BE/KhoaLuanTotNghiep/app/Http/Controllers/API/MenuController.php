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

            $uploadDirectory = public_path('upload/menu');
            if (!file_exists($uploadDirectory)) {
                mkdir($uploadDirectory, 0777, true); // Tạo thư mục nếu không tồn tại
            }

            // Di chuyển file
            $file->move($uploadDirectory, $name);

            $data['image'] = $name;
        }

        $menu = new Menu();
        $menu->fill($data);
        $menu->save();

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
        $menu = Menu::findOrFail($id);
        $data = $request->all();

        // Chuyển danh sách hình ảnh hiện tại thành mảng
        $exitImg = json_decode($menu->image, true) ?? [];

        // Lấy danh sách hình ảnh cần xóa từ request
        $deleteImages = $request->input('delete_images', []);

        // Xử lý xóa các ảnh trong danh sách
        foreach ($deleteImages as $deleteImg) {
            if (($key = array_search($deleteImg, $exitImg)) !== false) {
                unset($exitImg[$key]);
                $filePath = public_path('upload/menu/' . $deleteImg);
                if (file_exists($filePath)) {
                    unlink($filePath);
                }
            }
        }

        // Đảm bảo chỉ còn các ảnh còn lại sau khi xóa
        $exitImg = array_values($exitImg);

        // Xử lý thêm ảnh mới (chỉ một ảnh)
        if ($request->hasFile('image')) {
            $file = $request->file('image');
            // Lấy tên ảnh
            $name = $file->getClientOriginalName();
            // Lưu ảnh vào thư mục
            $path = public_path('upload/menu/' . $name);
            $file->move(public_path('upload/menu'), $name);

            // Lưu tên ảnh vào mảng mới
            $newImg = [$name];
        }

        // Kết hợp ảnh cũ và ảnh mới
        $allImage = array_merge($exitImg, $newImg ?? []);

        // Cập nhật lại dữ liệu hình ảnh trong mảng
        $data['image'] = json_encode($allImage);

        // Cập nhật menu
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

        if (isset($cart[$MenuID])) {
            // Nếu có thì tăng số lượng
            $cart[$MenuID]['qty']++;
        } else {
            // Nếu không có thì thêm sản phẩm vào giỏ hàng với số lượng là 1
            $cart[$MenuID] = [
                'qty' => 1
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
