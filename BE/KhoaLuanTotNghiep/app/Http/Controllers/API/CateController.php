<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Models\Category;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class CateController extends Controller
{
    
    public function index(): JsonResponse {
        $categories = Category::all();
        if($categories){
            return response()->json([
                'data' => $categories
            ],200);
        }
        else{
            return response()->json([
                'data' =>null,
                'message' => 'Khong co du lieu category'
            ],404);
        }
    }
    public function store(Request $request): JsonResponse {
        $validatedData = $request->validate([
            'name' => 'required|string|max:255',
        ]);
        $categories = Category::create($validatedData);
        if($categories){
            return response()->json([
                'data' => $categories
            ],200);
        }
        else{
            return response()->json([
                'data' =>null,
                'message' => 'Khong co du lieu category'
            ],404);
        }
    }

    public function show(string $id)
    {
        $category = Category::find($id);
        if($category){
            return response()->json([
                'data' => $category,
            ], 200);
        }
        else{
            return response()->json([
                'message' => 'Khong co danh muc nao.'
            ], 404);
        }
    }
    public function update(Request $request, string $id)
    {
        $category = Category::findOrFail($id);
        if(!$category){
            return response()->json([
                'message' => 'Khong co danh muc nao.'
            ], 404);
        }

        $category->update($request->all());
        return response()->json([
            'message'=> 'Cập nhật thành công',
            'data' => $category
        ], 200);
    }

    public function destroy(string $id){
        $category = Category::findOrFail($id);
        if (!$category) {
            return response()->json([
                'message' => "Danh mục không tồn tại"
            ], 401);
        }
        
        $category->delete();
        return response()->json([
            'message' => 'Xóa danh mục thành công.'
        ]);
    }

}
