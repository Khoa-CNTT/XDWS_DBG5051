import axios from 'axios';
import { authHeader } from '../Api/Login';

const API_URL = 'http://localhost:8000/api';

export interface Booking {
  id: string;
  customer_name: string;
  name: string;
  email: string;
  phone: string;
  guests: number;
  booking_date: string;
  booking_time: string;
  time: string;
  note?: string;
  status: 'pending' | 'confirmed' | 'cancelled';
  tableId?: string;
  created_at: string;
  updated_at: string;
}

export interface BookingRequest {
  customer_name: string;
  email: string;
  phone: string;
  guests: number;
  booking_date: string;
  booking_time: string;
  note?: string;
}

export const bookingService = {
  // Get all bookings
  getAllBookings: async (): Promise<Booking[]> => {
    const response = await axios.get(`${API_URL}/admin/list-booking`, authHeader());
    return response.data.data;
  },

  // Create new booking
  createBooking: async (bookingData: BookingRequest): Promise<Booking> => {
    const response = await axios.post(`${API_URL}/booking`, bookingData, authHeader());
    return response.data.data;
  },

  // Update booking status
  updateBookingStatus: async (id: string, status: 'confirmed' | 'cancelled', tableId?: string): Promise<Booking> => {
    const payload = { status };
    if (tableId && status === 'confirmed') {
      Object.assign(payload, { tableId });
    }
    const response = await axios.put(`${API_URL}/admin/update-booking/${id}`, payload, authHeader());
    return response.data.data;
  }
}; 
