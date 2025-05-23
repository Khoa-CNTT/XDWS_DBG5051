import axios from 'axios';

const API_URL = 'http://192.168.10.96:8000/api';

export interface OrderItem {
  id: number;
  menu_id: number;
  quantity: number;
  price: number;
  menu: {
    id: number;
    name: string;
    price: number;
  };
}

export interface Order {
  id: number;
  table_id: number;
  total_price: number;
  status: 'pending' | 'completed' | 'cancelled';
  items: OrderItem[];
  table: {
    id: number;
    table_number?: string;
  };
  created_at: string;
  updated_at: string;
}

export const orderService = {
  // Lấy danh sách đơn hàng
  getAllOrders: async (): Promise<Order[]> => {
    const response = await axios.get(`${API_URL}/order`);
    return response.data.data;
  },

  // Lấy chi tiết đơn hàng
  getOrderById: async (id: number): Promise<Order> => {
    const response = await axios.get(`${API_URL}/order-item/${id}`);
    return response.data;
  },

  // Cập nhật trạng thái đơn hàng
  updateOrderStatus: async (id: number, status: Order['status']): Promise<Order> => {
    const response = await axios.put(`${API_URL}/order-item/${id}`, { status });
    return response.data;
  }
}; 
