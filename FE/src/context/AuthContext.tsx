import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

// User interface
export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  orders: string[]; // Array of order IDs
}

interface AuthContextType {
  currentUser: User | null;
  login: (email: string, password: string) => Promise<User>;
  register: (name: string, email: string, phone: string, password: string) => Promise<User>;
  logout: () => void;
  isAuthenticated: boolean;
  updateUserOrders: (orderId: string) => void;
  getUserById: (userId: string) => User | null;
}

// Local storage keys
const USER_STORAGE_KEY = 'gogi_current_user';
const USERS_STORAGE_KEY = 'gogi_users';

// Create context
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Provider component
export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [users, setUsers] = useState<User[]>([]);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Load user data from localStorage on mount
  useEffect(() => {
    const storedUser = localStorage.getItem(USER_STORAGE_KEY);
    const storedUsers = localStorage.getItem(USERS_STORAGE_KEY);

    if (storedUser) {
      try {
        const userData = JSON.parse(storedUser);
        setCurrentUser(userData);
        setIsAuthenticated(true);
      } catch (e) {
        console.error('Failed to parse stored user:', e);
      }
    }

    if (storedUsers) {
      try {
        const usersData = JSON.parse(storedUsers);
        setUsers(usersData);
      } catch (e) {
        console.error('Failed to parse stored users:', e);
      }
    } else {
      // Initialize with some demo users if none exist
      const initialUsers = [
        {
          id: 'user_1',
          name: 'Nguyễn Văn A',
          email: 'user@example.com',
          phone: '0912345678',
          password: 'password123',
          orders: []
        }
      ];
      setUsers(initialUsers);
      localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(initialUsers));
    }
  }, []);

  // Save users to localStorage when they change
  useEffect(() => {
    if (users.length > 0) {
      localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(users));
    }
  }, [users]);

  // Save current user to localStorage when it changes
  useEffect(() => {
    if (currentUser) {
      localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(currentUser));
    } else {
      localStorage.removeItem(USER_STORAGE_KEY);
    }
  }, [currentUser]);

  // Login function
  const login = async (email: string, password: string): Promise<User> => {
    // In a real app, this would make an API call
    // Here we're just simulating authentication using localStorage

    // Find user by email and password
    const user = users.find(u => {
      // @ts-ignore - password is not in the User interface but is in our local storage
      return u.email === email && u.password === password;
    });

    if (!user) {
      return Promise.reject(new Error('Invalid email or password'));
    }

    // Remove password before setting as current user
    const { password: _, ...userWithoutPassword } = user as any;

    setCurrentUser(userWithoutPassword);
    setIsAuthenticated(true);

    return Promise.resolve(userWithoutPassword);
  };

  // Register function
  const register = async (name: string, email: string, phone: string, password: string): Promise<User> => {
    // Check if email already exists
    if (users.some(u => u.email === email)) {
      return Promise.reject(new Error('Email already in use'));
    }

    // Create new user
    const newUser = {
      id: `user_${Date.now()}`,
      name,
      email,
      phone,
      // @ts-ignore - Adding password for storage but not in interface
      password,
      orders: []
    };

    // Add to users array
    setUsers(prevUsers => [...prevUsers, newUser]);

    // Set as current user (without password)
    const { password: _, ...userWithoutPassword } = newUser as any;

    setCurrentUser(userWithoutPassword);
    setIsAuthenticated(true);

    return Promise.resolve(userWithoutPassword);
  };

  // Logout function
  const logout = () => {
    setCurrentUser(null);
    setIsAuthenticated(false);
    localStorage.removeItem(USER_STORAGE_KEY);
  };

  // Add order ID to user's orders
  const updateUserOrders = (orderId: string) => {
    if (!currentUser) return;

    // Update current user
    const updatedUser = {
      ...currentUser,
      orders: [...currentUser.orders, orderId]
    };

    setCurrentUser(updatedUser);

    // Update in users array
    setUsers(prevUsers =>
      prevUsers.map(user =>
        user.id === currentUser.id
          ? { ...user, orders: [...(user.orders || []), orderId] }
          : user
      )
    );
  };

  // Get user by ID
  const getUserById = (userId: string): User | null => {
    const user = users.find(u => u.id === userId);
    return user || null;
  };

  // Context value
  const value = {
    currentUser,
    login,
    register,
    logout,
    isAuthenticated,
    updateUserOrders,
    getUserById
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

// Hook to use auth context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
// Compare this snippet from src/pages/Home/Home.tsx: