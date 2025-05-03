<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Http\Requests\LoginRequest;
use App\Http\Requests\RegisterRequest;
use App\Http\Requests\UserRequest;
use App\Models\User;
use Hash;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class AuthController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $users = User::all();
        if ($users) {
            return response()->json([
                'data' => $users
            ], 201);
        } else {
            return response()->json([
                'message' => 'Không có tài khoản nào',
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
    public function register(RegisterRequest $request)
    {
        $user = User::create([
            'name' => $request->name,
            'email' => $request->email,
            'password' => Hash::make($request->password),
            'role' => $request->role,
        ]);

        if ($user) {
            return response()->json([
                'message' => 'Đăng ký thành công',
                'user' => $user
            ], 201);
        } else {
            return response()->json([
                'message' => 'Đăng ký không thành công',
            ], 401);
        }
    }

    public function login(LoginRequest $request)
    {
        $credentials = $request->only('name', 'password');

        if (Auth::attempt($credentials)) {
            $user = Auth::user();
            $token = $user->createToken('auth_token')->plainTextToken;
            return response()->json([
                'message' => 'Đăng nhập thành công',
                'user' => $user,
                'token' => $token  // ⚠️ Trả về token tại đây
            ], 200);
        }

        return response()->json([
            'message' => 'Email hoặc mật khẩu không đúng'
        ], 401);
    }
    /**
     * Display the specified resource.
     */
    public function logout()
    {
        Auth::logout();
        return response()->json(['message' => 'Đăng xuất thành công']);
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
    public function update(UserRequest $request, string $id)
    {
        $user = User::findOrFail($id);

        $data = [
            'name' => $request->input('name'),
            'phone' => $request->input('phone'),
            'email' => $request->input('email'),
            'role' => $request->input('role'),
        ];

        if ($request->filled('password')) {
            $data['password'] = bcrypt($request->input('password'));
        }

        $user->update($data);

        return response()->json([
            'success' => true,
            'data' => $user
        ]);
    }


    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        $user = User::find($id);

        if (!$user) {
            return response()->json([
                'message' => "Tài khoản không tồn tại"
            ], 404);
        }
        // Xóa tài khoản khỏi database
        $user->delete();

        return response()->json([
            'message' => "Xóa tài khoản thành công"
        ], 200);
    }
}
