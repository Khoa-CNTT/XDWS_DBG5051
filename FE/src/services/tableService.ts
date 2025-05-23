import axios from 'axios';
import { authHeader } from '../Api/Login';
import { api } from '../Api/AxiosIntance';

export interface Table {
  id: string;
  table_number: string;
  status: 'available' | 'reserved' | 'occupied';
  qr_code?: string;
}

export interface TableRequest {
  table_number?: string;
  status?: 'available' | 'reserved' | 'occupied';
}

export const tableService = {
  // Get all tables
  getAllTables: async (): Promise<Table[]> => {
    const response = await api.get(`/table`, authHeader());
    return response.data.data;
  },
  
  // Get table by ID
  getTableById: async (id: string): Promise<Table> => {
    // Using the show method from your PHP controller
    const response = await api.get(`/table/${id}`, authHeader());
    return response.data.data;
  },
  
  // Create new table
  createTable: async (tableData: TableRequest): Promise<Table> => {
    try {
      // Validate dữ liệu đầu vào
      if (!tableData.table_number || tableData.table_number.toString().trim() === '') {
        throw new Error('Số bàn không được để trống');
      }

      // Đảm bảo table_number là string và chuyển đổi status thành chữ thường
      const payload = {
        table_number: String(tableData.table_number).trim(),
        status: (tableData.status || 'available').toLowerCase()
      };
      
      console.log("Dữ liệu tạo bàn:", payload);
      
      // Lấy token từ localStorage
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('Không tìm thấy token xác thực');
      }

      // Gửi dữ liệu với cấu trúc mới
      const response = await api.post(`/admin/add-table`, payload,authHeader());
      
      if (!response.data || !response.data.data) {
        throw new Error('Dữ liệu trả về không hợp lệ');
      }
      
      return response.data.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.error('Chi tiết lỗi:', {
          status: error.response?.status,
          data: error.response?.data,
          message: error.message,
          requestData: error.config?.data
        });
        if (error.response?.status === 401) {
          throw new Error('Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.');
        }
        if (error.response?.status === 422) {
          const errorMessage = error.response.data?.message || 'Dữ liệu không hợp lệ';
          throw new Error(errorMessage);
        }
        if (error.response?.status === 500) {
          console.error('Server error details:', error.response.data);
          throw new Error('Lỗi server: Vui lòng thử lại sau');
        }
        throw new Error(error.response?.data?.message || 'Không thể tạo bàn mới');
      }
      throw error;
    }
  },
  
  // Update table
  updateTable: async (id: string, tableData: TableRequest): Promise<Table> => {
    // Gửi cả table_number và status trong payload
    const payload = {
      table_number: tableData.table_number,  // Sử dụng table_number hiện tại
      status: tableData.status
    };
    
    console.log("Updating table with payload:", payload);
    const response = await api.put(`/admin/update-table/${id}`, payload, authHeader());
    return response.data.data;
  },
  
  // Update table status only
  updateTableStatus: async (id: string, newStatus: string): Promise<Table> => {
    const payload = { status: newStatus }; 
    try {
        const response = await api.put(`/admin/update-table/${id}`, payload, authHeader());
        return response.data.data;
    } catch (error) {
        console.error('Error updating table status:', error);
        throw error; // Xử lý lỗi nếu cần
    }
  },

  // Delete table
  deleteTable: async (id: string): Promise<void> => {
    await api.delete(`/admin/table/${id}`, authHeader());
  }
};
