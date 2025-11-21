// context/AuthContext.tsx
'use client';

import { createContext, useContext, useEffect, useState, ReactNode } from 'react';

export interface User {
  id: string;
  name: string;
  age?: number;
  email: string;
  phone?: string;
  password: string;
  address?: string;
  city?: string;
  country?: string;
  postalCode?: string;
  nationality?: string;
  cnic?: string;
  role: 'admin' | 'user';
  createdAt?: string;
}

interface SignupData {
  name: string;
  age: string;
  email: string;
  phone: string;
  password: string;
  address: string;
  city: string;
  country: string;
  postalCode: string;
  nationality: string;
  cnic: string;
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<boolean>;
  adminLogin: (email: string, password: string) => Promise<boolean>;
  signup: (userData: SignupData) => Promise<boolean>;
  logout: () => void;
  loading: boolean;
  isAuthenticated: boolean;
  isAdmin: boolean;
  isUser: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const API_BASE_URL = 'http://localhost:5000';

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // ✅ Role checking functions
  const isAdmin = user?.role === 'admin';
  const isUser = user?.role === 'user';

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const token = localStorage.getItem('token');
        const userData = localStorage.getItem('user_data');
        
        if (token && userData) {
          const parsedUser = JSON.parse(userData);
          setUser(parsedUser);
          setIsAuthenticated(true);
          console.log('✅ User restored from storage:', parsedUser.email);
        }
      } catch (error) {
        console.error('Auth check failed:', error);
        localStorage.removeItem('token');
        localStorage.removeItem('user_data');
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, []);

  // ✅ Public Login (for normal users) - USING NESTJS BACKEND
  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      setLoading(true);
      console.log('🔐 Attempting login for:', email);

      const response = await fetch(`${API_BASE_URL}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      console.log('📡 Login response status:', response.status);

      if (response.ok) {
        const data = await response.json();
        console.log('✅ Login successful:', data.user);
        
        // ✅ Store both token and user data
        localStorage.setItem('token', data.token);
        localStorage.setItem('user_data', JSON.stringify(data.user));
        setUser(data.user);
        setIsAuthenticated(true);
        
        return true;
      } else {
        const errorData = await response.json();
        console.error('❌ Login failed:', errorData);
        return false;
      }
    } catch (error) {
      console.error('🚨 Login network error:', error);
      return false;
    } finally {
      setLoading(false);
    }
  };

  // ✅ Admin Login (Only for admin role) - USING NESTJS BACKEND
  const adminLogin = async (email: string, password: string): Promise<boolean> => {
    try {
      setLoading(true);
      console.log('👑 Attempting admin login for:', email);

      const response = await fetch(`${API_BASE_URL}/auth/admin-login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      console.log('📡 Admin login response status:', response.status);

      if (response.ok) {
        const data = await response.json();
        console.log('✅ Admin login successful:', data.user);
        
        // ✅ Store both token and user data
        localStorage.setItem('token', data.token);
        localStorage.setItem('user_data', JSON.stringify(data.user));
        setUser(data.user);
        setIsAuthenticated(true);
        
        return true;
      } else {
        const errorData = await response.json();
        console.error('❌ Admin login failed:', errorData);
        return false;
      }
    } catch (error) {
      console.error('🚨 Admin login network error:', error);
      return false;
    } finally {
      setLoading(false);
    }
  };

  // ✅ Signup Function - USING NESTJS BACKEND
  const signup = async (userData: SignupData): Promise<boolean> => {
    try {
      setLoading(true);
      console.log('📝 Attempting signup for:', userData.email);

      const response = await fetch(`${API_BASE_URL}/auth/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
      });

      console.log('📡 Signup response status:', response.status);

      if (response.ok) {
        const data = await response.json();
        console.log('✅ Signup successful:', data.user);
        
        // ✅ Store both token and user data
        localStorage.setItem('token', data.token);
        localStorage.setItem('user_data', JSON.stringify(data.user));
        setUser(data.user);
        setIsAuthenticated(true);
        
        alert('Account created successfully! You are now logged in.');
        return true;
      } else {
        const errorData = await response.json();
        console.error('❌ Signup failed:', errorData);
        alert(errorData.message || 'Failed to create account. Please try again.');
        return false;
      }
    } catch (error) {
      console.error('🚨 Signup network error:', error);
      alert('An error occurred during signup. Please try again.');
      return false;
    } finally {
      setLoading(false);
    }
  };

  // ✅ Create Admin User (for testing)
  const createAdminUser = async (): Promise<boolean> => {
    try {
      console.log('👑 Creating admin user...');
      
      const response = await fetch(`${API_BASE_URL}/auth/create-admin`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        const data = await response.json();
        console.log('✅ Admin user created:', data);
        alert(`Admin user created successfully!\nEmail: admin@supplimax.com\nPassword: admin123`);
        return true;
      } else {
        console.error('❌ Failed to create admin user');
        return false;
      }
    } catch (error) {
      console.error('🚨 Create admin error:', error);
      return false;
    }
  };

  // ✅ Test Backend Connection
  const testBackendConnection = async (): Promise<boolean> => {
    try {
      console.log('🔗 Testing backend connection...');
      
      const response = await fetch(`${API_BASE_URL}/auth/health`);
      
      if (response.ok) {
        const data = await response.json();
        console.log('✅ Backend is running:', data);
        alert(`Backend Status: ${data.status}\nMessage: ${data.message}`);
        return true;
      } else {
        console.error('❌ Backend health check failed');
        alert('Backend is not responding properly');
        return false;
      }
    } catch (error) {
      console.error('🚨 Backend connection failed:', error);
      alert('Cannot connect to backend! Make sure it\'s running on port 5000.');
      return false;
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user_data');
    setUser(null);
    setIsAuthenticated(false);
    console.log('✅ User logged out');
  };

  const value: AuthContextType = {
    user,
    login,
    adminLogin,
    signup,
    logout,
    loading,
    isAuthenticated,
    isAdmin,
    isUser
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}