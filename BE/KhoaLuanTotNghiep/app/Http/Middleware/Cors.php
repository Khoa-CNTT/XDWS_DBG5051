<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class Cors
{
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next): Response
    {
        return $next($request)
        ->header('Access-Control-Allow-Origin','http://192.168.10.96:5173')
        ->header('Access-Control-Allow-Methods','GET, POST, PUT, DELETE, OPTION')
        ->header('Access-Control-Allow-Headers','Origin, Content-Type, Accept, Authorization, X-Request-With')
        ->header('Access-Control-Allow-Credentials','true');
    }
}
