// import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
// import { login as loginAPI } from '../Api/Login'; // Fix import path casing

// // User interface
// export interface AdminUser {
//   id: string;
//   name: string;
//   email: string;
//   role: 'admin' | 'staff';
// }

// interface AuthContextType {
//   currentUser: AdminUser | null;
//   login: (email: string, password: string) => Promise<AdminUser>;
//   logout: () => void;
//   isAuthenticated: boolean;
// }

// // Local storage key
// const ADMIN_STORAGE_KEY = 'smartorder_admin_user';

// // Create context
// const AuthContext = createContext<AuthContextType | undefined>(undefined);

// // Provider component
// export const AuthProvider = ({ children }: { children: ReactNode }) => {
//   const [currentUser, setCurrentUser] = useState<AdminUser | null>(null);
//   const [isAuthenticated, setIsAuthenticated] = useState(false);

//   // Load user data from localStorage on mount
//   useEffect(() => {
//     const storedUser = localStorage.getItem(ADMIN_STORAGE_KEY);
//     if (storedUser) {
//       try {
//         const userData = JSON.parse(storedUser);
//         setCurrentUser(userData);
//         setIsAuthenticated(true);
//       } catch (e) {
//         console.error('Failed to parse stored user:', e);
//       }
//     }
//   }, []);

//   // Save current user to localStorage when it changes
//   useEffect(() => {
//     if (currentUser) {
//       localStorage.setItem(ADMIN_STORAGE_KEY, JSON.stringify(currentUser));
//     } else {
//       localStorage.removeItem(ADMIN_STORAGE_KEY);
//     }
//   }, [currentUser]);

//   // Login function
//   const login = async (email: string, password: string): Promise<AdminUser> => {
//     try {
//       const response = await loginAPI(email, password);
//       setCurrentUser(response);
//       setIsAuthenticated(true);
//       return response;
//     } catch (error) {
//       throw new Error('Invalid email or password');
//     }
//   };

//   // Logout function
//   const logout = () => {
//     setCurrentUser(null);
//     setIsAuthenticated(false);
//     localStorage.removeItem(ADMIN_STORAGE_KEY);
//     localStorage.clear();
//   };

//   // Context value
//   const value = {
//     currentUser,
//     login,
//     logout,
//     isAuthenticated
//   };

//   return (
//     <AuthContext.Provider value={value}>
//       {children}
//     </AuthContext.Provider>
//   );
// };

// // Hook to use auth context
// export const useAuth = () => {
//   const context = useContext(AuthContext);
//   if (context === undefined) {
//     throw new Error('useAuth must be used within an AuthProvider');
//   }
//   return context;
// };