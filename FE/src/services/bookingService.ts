import axios from 'axios';
import { authHeader } from '../../src/Api/Login';

const API_URL = 'http://localhost:8000/api';

export interface Booking {
  id: string;
  name: string;
  email: string;
  phone: string;
  guests: number;
  booking_date: string;
  time: string;
  notes?: string;
  withChildren: boolean;
  birthday: boolean;
  window: boolean;
  childrenChair: boolean;
  status: 'pending' | 'confirmed' | 'cancelled';
  tableId?: string;
  createdAt: string;
}

export interface BookingRequest {
  name: string;
  email: string;
  phone: string;
  guests: number;
  booking_date: string;
  time: string;
  notes?: string;
  withChildren: boolean;
  birthday: boolean;
  window: boolean;
  childrenChair: boolean;
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
  updateBookingStatus: async (id: string, status: 'confirmed' | 'cancelled'): Promise<Booking> => {
    const response = await axios.put(`${API_URL}/admin/update-booking/${id}`, { status }, authHeader());
    return response.data.data;
  }
}; 