// import { api } from '../Api/AxiosIntance';

// export interface MenuItem {
//   id: number;
//   name: string;
//   price: number;
//   category: {
//     id: number;
//     name: string;
//   };
//   image?: string;
//   popular?: boolean;
// }

// export interface CartItem {
//   id: number;
//   menu_id: number;
//   quantity: number;
//   price: number;
//   menu: MenuItem;
// }

// export interface OrderRequest {
//   number_table: number;
//   items: {
//     menu_id: number;
//     quantity: number;
//     price: number;
//   }[];
// }

// class QrOrderService {
//   // Lấy danh sách menu
//   async getMenuItems() {
//     const response = await api.get('/list-menu');
//     return response.data.data;
//   }

//   // Lấy danh sách categories
//   async getCategories() {
//     const response = await api.get('/cate');
//     return response.data.data;
//   }

//   // Kiểm tra trạng thái bàn
//   async checkTableStatus(tableId: number) {
//     const response = await api.get(`/table/${tableId}`);
//     return response.data.data;
//   }

//   // Lấy giỏ hàng
//   async getCart(tableId: number) {
//     const response = await api.get(`/table/${tableId}/cart`);
//     return response.data.data;
//   }

//   // Tăng số lượng món trong giỏ
//   async increaseCartItem(menuId: number, tableId: number) {
//     const response = await api.post(`/table/${tableId}/cart/up`, { menu_id: menuId });
//     return response.data;
//   }

//   // Giảm số lượng món trong giỏ
//   async decreaseCartItem(menuId: number, tableId: number) {
//     const response = await api.post(`/table/${tableId}/cart/down`, { menu_id: menuId });
//     return response.data;
//   }

//   // Đặt món
//   async placeOrder(orderData: OrderRequest) {
//     const response = await api.post('/orders/place', orderData);
//     return response.data;
//   }
// }

// export const qrOrderService = new QrOrderService(); 
import { api } from '../Api/AxiosIntance';

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
  id: number;
  menu_id: number;
  quantity: number;
  price: number;
  menu: MenuItem;
}

export interface OrderRequest {
  number_table: number;
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

  // Kiểm tra trạng thái bàn
  async checkTableStatus(tableId: number) {
    const response = await api.get(`/table/${tableId}`);
    return response.data.data;
  }

  // Lấy giỏ hàng
  async getCart(tableId: number) {
    const response = await api.get(`/cart`);
    return response.data.data;
  }

  // Tăng số lượng món trong giỏ
  async increaseCartItem(menuId: number, tableId: number) {
    const response = await api.post(`/cart/up`, { menu_id: menuId });
    return response.data;
  }

  // Giảm số lượng món trong giỏ
  async decreaseCartItem(menuId: number, tableId: number) {
    const response = await api.post(`/cart/down`, { menu_id: menuId });
    return response.data;
  }

  // Đặt món
  async placeOrder(orderData: OrderRequest) {
    const response = await api.post('/orders/place', orderData);
    return response.data;
  }
}

export const qrOrderService = new QrOrderService(); 