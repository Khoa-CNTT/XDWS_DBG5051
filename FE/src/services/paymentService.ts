import { authHeader } from '../Api/Login';
import { api } from '../Api/AxiosIntance';

const API_URL = 'http://192.168.10.96:8000/api';

export interface Payment {
  id: number;
  order_id: number;
  amount: number;
  method: 'cash' | 'card' | 'VNPay';
  status: 'pending' | 'completed' | 'failed';
  created_at: string;
  updated_at: string;
}

export interface PaymentRequest {
  order_id: number;
  amount: number;
  method: 'cash' | 'card' | 'VNPay';
}

export interface VNPayRequest {
  order_id: number;
  amount: number;
}

export interface VNPayResponse {
  payment_url: string;
}

export interface PaymentResponse extends Payment {
  review_url?: string;
  qr_code_base64?: string;
}

export const paymentService = {
  // Xử lý thanh toán tiền mặt
  processInternalPayment: async (paymentData: PaymentRequest): Promise<PaymentResponse> => {
    const response = await api.post(
      `/internal_payment`, 
      paymentData, 
      authHeader()
    );
    
    // Kiểm tra và xử lý dữ liệu trả về
    const responseData = response.data;
    
    // Log để debug
    console.log('Payment API response:', responseData);
    
    return {
      ...responseData.data,
      review_url: responseData.review_url || '',
      qr_code_base64: responseData.qr_code_base64 || ''
    };
  },
  
  // Xử lý thanh toán VNPay
  processVnPayPayment: async (paymentData: VNPayRequest): Promise<VNPayResponse> => {
    const response = await api.post(
      `/vnpay_payment`, 
      paymentData, 
      authHeader()
    );
    return response.data;
  }
};

























