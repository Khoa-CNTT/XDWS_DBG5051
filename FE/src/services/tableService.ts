import axios from 'axios';
import { authHeader } from '../Api/Login';

const API_URL = 'http://localhost:8000/api';

export interface Table {
  id: string;
  table_number: string;
  status: 'available' | 'reserved' | 'occupied';
  qr_code?: string;
}

export interface TableRequest {
  table_number: string;
  status?: 'available' | 'reserved' | 'occupied';
}

export const tableService = {
  // Get all tables
  getAllTables: async (): Promise<Table[]> => {
    const response = await axios.get(`${API_URL}/table`, authHeader());
    return response.data.data;
  },

  // Get table by ID
  getTableById: async (id: string): Promise<Table> => {
    const response = await axios.get(`${API_URL}/table/${id}`, authHeader());
    return response.data.data;
  },

  // Create new table
  createTable: async (tableData: TableRequest): Promise<Table> => {
    const response = await axios.post(`${API_URL}/admin/add-table`, tableData, authHeader());
    return response.data.data;
  },

  // Update table
  updateTable: async (id: string, tableData: TableRequest): Promise<Table> => {
    const response = await axios.put(`${API_URL}/admin/update-table/${id}`, tableData, authHeader());
    return response.data.data;
  },

  // Delete table
  deleteTable: async (id: string): Promise<void> => {
    await axios.delete(`${API_URL}/admin/table/${id}`, authHeader());
  }
}; 