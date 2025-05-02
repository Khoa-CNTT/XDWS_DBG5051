import { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { MenuItem } from '../data/menuData';

// Order types
export interface OrderItem extends MenuItem {
  quantity: number;
}

export type OrderStatus =
  | 'pending'    // Initial state when an order is placed
  | 'preparing'  // Kitchen has seen and started preparing
  | 'ready'      // Order is ready for serving
  | 'delivered'  // Order has been delivered to the table
  | 'cancelled'; // Order has been cancelled

export interface Order {
  id: string;
  tableId: string;
  items: OrderItem[];
  total: number;
  note?: string;
  status: OrderStatus;
  timestamp: string; // ISO string
  estimatedTime?: number; // in minutes
}

interface OrderContextType {
  orders: Order[];
  addOrder: (order: Omit<Order, 'id' | 'status'>) => string;
  updateOrderStatus: (orderId: string, status: OrderStatus) => void;
  updateOrderEstimatedTime: (orderId: string, time: number) => void;
  getOrdersByStatus: (status: OrderStatus | OrderStatus[]) => Order[];
  getOrdersByTable: (tableId: string) => Order[];
  getActiveOrderForTable: (tableId: string) => Order | undefined;
  clearCompletedOrders: () => void;
}

const OrderContext = createContext<OrderContextType | undefined>(undefined);

// Local storage key
const ORDERS_STORAGE_KEY = 'gogi_orders';

export const OrderProvider = ({ children }: { children: ReactNode }) => {
  const [orders, setOrders] = useState<Order[]>([]);

  // Load orders from localStorage on mount
  useEffect(() => {
    const storedOrders = localStorage.getItem(ORDERS_STORAGE_KEY);
    if (storedOrders) {
      try {
        setOrders(JSON.parse(storedOrders));
      } catch (e) {
        console.error('Failed to parse stored orders:', e);
      }
    }
  }, []);

  // Save orders to localStorage when they change
  useEffect(() => {
    localStorage.setItem(ORDERS_STORAGE_KEY, JSON.stringify(orders));
  }, [orders]);

  const addOrder = (orderData: Omit<Order, 'id' | 'status'>): string => {
    const id = `order_${Date.now()}`;
    const newOrder: Order = {
      ...orderData,
      id,
      status: 'pending',
    };

    setOrders(prevOrders => [...prevOrders, newOrder]);
    return id;
  };

  const updateOrderStatus = (orderId: string, status: OrderStatus) => {
    setOrders(prevOrders =>
      prevOrders.map(order =>
        order.id === orderId ? { ...order, status } : order
      )
    );
  };

  const updateOrderEstimatedTime = (orderId: string, time: number) => {
    setOrders(prevOrders =>
      prevOrders.map(order =>
        order.id === orderId ? { ...order, estimatedTime: time } : order
      )
    );
  };

  const getOrdersByStatus = (status: OrderStatus | OrderStatus[]): Order[] => {
    if (Array.isArray(status)) {
      return orders.filter(order => status.includes(order.status));
    }
    return orders.filter(order => order.status === status);
  };

  const getOrdersByTable = (tableId: string): Order[] => {
    return orders.filter(order => order.tableId === tableId);
  };

  const getActiveOrderForTable = (tableId: string): Order | undefined => {
    return orders.find(
      order =>
        order.tableId === tableId &&
        ['pending', 'preparing', 'ready'].includes(order.status)
    );
  };

  const clearCompletedOrders = () => {
    setOrders(prevOrders =>
      prevOrders.filter(order =>
        !['delivered', 'cancelled'].includes(order.status)
      )
    );
  };

  const value = {
    orders,
    addOrder,
    updateOrderStatus,
    updateOrderEstimatedTime,
    getOrdersByStatus,
    getOrdersByTable,
    getActiveOrderForTable,
    clearCompletedOrders,
  };

  return (
    <OrderContext.Provider value={value}>
      {children}
    </OrderContext.Provider>
  );
};

export const useOrders = () => {
  const context = useContext(OrderContext);
  if (context === undefined) {
    throw new Error('useOrders must be used within an OrderProvider');
  }
  return context;
};
