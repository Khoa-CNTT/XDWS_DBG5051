<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;

class ChatbotController extends Controller
{
     public function ask(Request $request)
    {
        $message = $request->input('message');

        // Gửi tới Flask (chatbot Python)
        $response = Http::post('http://127.0.0.1:5000/chat', [
            'message' => $message
        ]);

        // Trả kết quả về cho React
        return response()->json([
            'response' => $response->json()['response'] ?? 'Không có phản hồi từ chatbot'
        ]);
    }
}
