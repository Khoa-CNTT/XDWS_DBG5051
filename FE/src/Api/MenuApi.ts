import { api } from './AxiosIntance';

export interface Menu {
  id: number;
  name: string;
  description: string;
  price: number;
  image: string;
  category_id: number;
  status: boolean;
  popular?: boolean;
}

export interface Category {
  id: number;
  name: string;
  description: string;
  status: boolean;
}

export const MenuApi = {
  // Lấy danh sách menu
  getMenuList: () => api.get<Menu[]>('/list-menu'),
  
  // Lấy danh sách category
  getCategoryList: () => api.get<Category[]>('/cate'),
  
  // Lấy món ăn phổ biến (AI gợi ý)
  getPopularDishes: () => api.get<Menu[]>('/popular-dishes'),
  
  // Admin APIs
  addMenu: (data: Omit<Menu, 'id'>) => api.post('/admin/add-menu', data),
  updateMenu: (id: number, data: Partial<Menu>) => api.put(`/admin/update-menu/${id}`, data),
  deleteMenu: (id: number) => api.delete(`/admin/cate/${id}`),
  
  // Category Admin APIs
  addCategory: (data: Omit<Category, 'id'>) => api.post('/admin/add-cate', data),
  updateCategory: (id: number, data: Partial<Category>) => api.put(`/admin/update-cate/${id}`, data),
  deleteCategory: (id: number) => api.delete(`/admin/delete-cate/${id}`),
}; 