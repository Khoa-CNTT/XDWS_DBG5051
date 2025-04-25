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
     * Show the form for creating a new resource.
     */
    public function create()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(MenuRequest $request)
    {
        $data = $request->all();
        $aa = [];
        if ($request->hasFile('image')) {
            foreach ($request->file('image') as $xx) {
                $image = Image::read($xx);
                //lay ten hinh anh
                $name = $xx->getClientOriginalName();
                //luu hinh anh
                $path = public_path('upload/menu' . $name);
                $image->save($path);

                $aa[] = $name;
            }
        }
        $data['image'] = json_encode(($aa));
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
     * Show the form for editing the specified resource.
     */
    public function edit(string $id)
    {

    }

    /**
     * Update the specified resource in storage.
     */
    public function update(MenuRequest $request, string $id)
    {
        $menu = Menu::findOrFail($id);
        $data = $request->all();
        $exitImg = json_decode($menu->image, true) ?? []; // chuyen ds hinh anh thanh mang
        $deleteImages = $request->input('delete_images', []); //lay ds hinh anh can xoa tu request
        foreach ($deleteImages as $deleteImg) {
            if (($key = array_search($deleteImg, $exitImg)) == true) {
                unset($exitImg[$key]);
                if (file_exists(public_path('storage/menu/' . $deleteImg))) {
                    unlink(public_path('storage/menu/' . $deleteImg));
                }
            }
        }
        $exitImg = array_values($exitImg);

        $newImg = [];
        if ($request->hasFile('image')) {
            foreach ($request->file('image') as $key => $aa) {
                $image = Image::read($aa);
                //Lay ten hinh anh
                $name = $aa->getClientOriginalName();
                //dua vao thu muc 
                $path = public_path('storage/menu' . $name);

                $image->save($path);
            }
        }

        $allImage = array_merge($exitImg, $newImg);

        $data['image'] = json_encode($allImage);

        $menu->update($data);
        if (!$menu) {
            return response()->json([
                'message' => "Món không tồn tại"
            ], 401);
        }

        $menu->update($request->all());
        return response()->json([
            'message' => 'Cập nhật món thành công.'
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
        $recommendedDishes  = $service->getRecommendedDishes(8); // ví dụ lấy 8 món

        return response()->json($recommendedDishes );
    }

}
