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
        const userData = localStorage.getItem('user_data');
        
        if (userData) {
          const parsedUser = JSON.parse(userData);
          setUser(parsedUser);
          setIsAuthenticated(true);
        }
      } catch (error) {
        console.error('Auth check failed:', error);
        localStorage.removeItem('user_data');
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, []);

  // ✅ Public Login (for normal users)
  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      setLoading(true);
      const response = await fetch(`${API_BASE_URL}/users?email=${email}`);
      
      if (response.ok) {
        const users = await response.json();
        
        if (users.length > 0) {
          const userData = users[0];
          
          // ✅ Check password
          if (userData.password === password) {
            localStorage.setItem('user_data', JSON.stringify(userData));
            setUser(userData);
            setIsAuthenticated(true);
            
            console.log('Login successful:', userData);
            return true;
          } else {
            console.log('Invalid password');
            return false;
          }
        } else {
          console.log('User not found');
          return false;
        }
      }
      return false;
    } catch (error) {
      console.error('Login failed:', error);
      return false;
    } finally {
      setLoading(false);
    }
  };

  // ✅ Admin Login (Only for admin role)
  const adminLogin = async (email: string, password: string): Promise<boolean> => {
    try {
      setLoading(true);
      const response = await fetch(`${API_BASE_URL}/users?email=${email}`);
      
      if (response.ok) {
        const users = await response.json();
        
        if (users.length > 0) {
          const userData = users[0];
          
          // ✅ Check password and role
          if (userData.password === password) {
            // ✅ STRICT CHECK: Only admin can login
            if (userData.role === 'admin') {
              localStorage.setItem('user_data', JSON.stringify(userData));
              setUser(userData);
              setIsAuthenticated(true);
              
              console.log('Admin login successful:', userData);
              return true;
            } else {
              console.log('Access denied: Admin privileges required');
              return false;
            }
          } else {
            console.log('Invalid admin credentials');
            return false;
          }
        } else {
          console.log('Admin user not found');
          return false;
        }
      }
      return false;
    } catch (error) {
      console.error('Admin login failed:', error);
      return false;
    } finally {
      setLoading(false);
    }
  };

  // ✅ Signup Function - FIXED ROLE ISSUE
  const signup = async (userData: SignupData): Promise<boolean> => {
    try {
      setLoading(true);

      // ✅ Check if email already exists
      const checkResponse = await fetch(`${API_BASE_URL}/users?email=${userData.email}`);
      const existingUsers = await checkResponse.json();
      
      if (existingUsers.length > 0) {
        alert('Email already exists. Please use a different email.');
        return false;
      }

      // ✅ Create new user with proper role
      const newUser = {
        ...userData,
        id: Date.now().toString(),
        age: parseInt(userData.age),
        role: 'user' as const, // ✅ Explicitly set role
        createdAt: new Date().toISOString()
      };

      console.log('Creating user:', newUser);

      const response = await fetch(`${API_BASE_URL}/users`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newUser),
      });

      if (response.ok) {
        const createdUser = await response.json();
        console.log('User created successfully:', createdUser);
        
        // ✅ Auto login after signup
        const loginSuccess = await login(userData.email, userData.password);
        if (loginSuccess) {
          alert('Account created successfully! You are now logged in.');
          return true;
        } else {
          alert('Account created but login failed. Please try logging in manually.');
          return true;
        }
      } else {
        alert('Failed to create account. Please try again.');
        return false;
      }
    } catch (error) {
      console.error('Signup failed:', error);
      alert('An error occurred during signup. Please try again.');
      return false;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem('user_data');
    setUser(null);
    setIsAuthenticated(false);
    console.log('User logged out');
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