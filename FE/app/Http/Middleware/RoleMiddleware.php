<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;
use Illuminate\Support\Facades\Log;

class RoleMiddleware
{
    public function handle(Request $request, Closure $next, $role): Response
    {
        // Log chi tiết request
        Log::info('RoleMiddleware - Request Details', [
            'url' => $request->fullUrl(),
            'method' => $request->method(),
            'headers' => $request->headers->all(),
            'token' => $request->bearerToken(),
            'required_role' => $role
        ]);

        // Kiểm tra authentication
        if (!auth()->check()) {
            Log::warning('RoleMiddleware - User not authenticated', [
                'url' => $request->fullUrl()
            ]);
            return response()->json(['message' => 'Unauthenticated'], 401);
        }

        $user = auth()->user();
        Log::info('RoleMiddleware - User Details', [
            'user_id' => $user->id,
            'user_role' => $user->role,
            'required_role' => $role
        ]);

        // Kiểm tra role
        if ($user->role !== $role) {
            Log::warning('RoleMiddleware - Role mismatch', [
                'user_role' => $user->role,
                'required_role' => $role,
                'user_id' => $user->id
            ]);
            return response()->json(['message' => 'Bạn không có quyền truy cập!'], 403);
        }

        Log::info('RoleMiddleware - Access granted', [
            'user_id' => $user->id,
            'user_role' => $user->role,
            'url' => $request->fullUrl()
        ]);

        return $next($request);
    }
} 