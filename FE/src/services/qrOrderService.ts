import axios from 'axios';
import { api } from '../Api/AxiosIntance';

// Tạo instance axios riêng cho các route web (không phải api)
const webApi = axios.create({
  baseURL: 'http://192.168.1.191:8000',
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  }
});

export interface MenuItem {
  id: number;
  name: string;
  price: number;
  category: {
    id: number;
    name: string;
  };
  image?: string;
  popular?: boolean;
}

export interface CartItem {
  menu: MenuItem;
  quantity: number;
}

export interface OrderRequest {
  table_number: number;
  items: {
    menu_id: number;
    quantity: number;
    price: number;
  }[];
}

class QrOrderService {
  // Lấy danh sách menu
  async getMenuItems() {
    const response = await api.get('/list-menu');
    return response.data.data;
  }

  // Lấy danh sách categories
  async getCategories() {
    const response = await api.get('/cate');
    return response.data.data;
  }

  // Kiểm tra trạng thái bàn theo table_number
  async checkTableStatus(tableNumber: string) {
    try {
      // Đầu tiên lấy danh sách tất cả các bàn
      const response = await api.get('/table');
      const tables = response.data.data;
      
      // Tìm bàn có table_number khớp với tham số
      const table = tables.find((t: any) => t.table_number === tableNumber);
      
      if (!table) {
        throw new Error(`Không tìm thấy bàn ${tableNumber}`);
      }
      
      return table;
    } catch (error) {
      console.error('Error checking table status:', error);
      throw error;
    }
  }

  // Lấy giỏ hàng - sử dụng webApi vì đây là route web
  async getCart() {
    const response = await webApi.get(`/cart/`);
    return response.data.data;
  }

  // Thêm món vào giỏ hàng - sử dụng webApi vì đây là route web
  async addToCart(menuId: number) {
    const response = await webApi.post(`/cart/add-to-cart`, { menu_id: menuId });
    return response.data;
  }

  // Tăng số lượng món trong giỏ - sử dụng webApi vì đây là route web
  async increaseCartItem(menuId: number) {
    const response = await webApi.post(`/cart/up`, { id: menuId });
    return response.data;
  }

  // Giảm số lượng món trong giỏ - sử dụng webApi vì đây là route web
  async decreaseCartItem(menuId: number) {
    const response = await webApi.post(`/cart/down`, { id: menuId });
    return response.data;
  }

  // Xóa món khỏi giỏ hàng - sử dụng webApi vì đây là route web
  async deleteCartItem(menuId: number) {
    const response = await webApi.post(`/cart/delete`, { id: menuId });
    return response.data;
  }

  // Đặt món với dữ liệu giỏ hàng
  async placeOrder(orderData: { table_number: number }) {
    const response = await webApi.post('/orders/place', orderData);
    return response.data;
  }
  
}

export const qrOrderService = new QrOrderService();
