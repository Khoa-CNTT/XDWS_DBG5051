import axios from 'axios';
import { authHeader } from '../Api/Login';
import { Order } from './orderService';

const API_URL = 'http://192.168.1.191:8000/api';

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

export const paymentService = {
  // Xử lý thanh toán tiền mặt
  processInternalPayment: async (paymentData: PaymentRequest): Promise<Payment> => {
    const response = await axios.post(
      `${API_URL}/internal_payment`, 
      paymentData, 
      authHeader()
    );
    return response.data.data;
  },
  
  // Xử lý thanh toán VNPay
  processVnPayPayment: async (paymentData: VNPayRequest): Promise<VNPayResponse> => {
    const response = await axios.post(
      `${API_URL}/vnpay_payment`, 
      paymentData, 
      authHeader()
    );
    return response.data;
  }
};

























