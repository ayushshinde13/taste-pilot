'use client';

import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { getToken, getUserData, setAuthTokens, removeAuthTokens, isAuthenticated as isAuth } from '@/lib/auth';

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  loading: boolean;
  login: (email: string, password: string, rememberMe: boolean) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => void;
  refreshUser: () => Promise<void>;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Initialize auth state from stored tokens
    const initializeAuth = async () => {
      // Only run on the client side
      if (typeof window !== 'undefined') {
        const storedToken = getToken();
        const storedUserData = getUserData();

        if (storedToken && storedUserData) {
          setToken(storedToken);
          setUser(storedUserData);
        }
      }
      setLoading(false);
    };

    initializeAuth();
  }, []);

  const login = async (email: string, password: string, rememberMe: boolean) => {
    setLoading(true);
    
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}/api/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Login failed');
      }

      const { token: newToken, ...userData } = data.data;
      
      // Store tokens and user data
      setAuthTokens(newToken, userData, rememberMe);
      
      setToken(newToken);
      setUser({
        id: userData._id,
        name: userData.name,
        email: userData.email,
        role: userData.role,
      });
    } catch (error: any) {
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const register = async (name: string, email: string, password: string) => {
    setLoading(true);
    
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}/api/auth/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name, email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Registration failed');
      }

      // Automatically log in after successful registration
      // In a real app, you might want to send verification email instead
      return data;
    } catch (error: any) {
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    removeAuthTokens();
    setUser(null);
    setToken(null);
  };

  const refreshUser = async () => {
    if (!token) return;

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}/api/auth/me`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      const data = await response.json();

      if (response.ok) {
        const userData = {
          id: data.data._id,
          name: data.data.name,
          email: data.data.email,
          role: data.data.role,
        };

        setUser(userData);
        
        // Update stored user data to match new info
        if (typeof window !== 'undefined') {
          if (localStorage.getItem('token')) {
            localStorage.setItem('userData', JSON.stringify(userData));
          } else {
            sessionStorage.setItem('userData', JSON.stringify(userData));
          }
        }
      } else {
        // If token is invalid, log out user
        logout();
      }
    } catch (error) {
      console.error('Error refreshing user:', error);
      logout();
    }
  };

  const value = {
    user,
    token,
    loading,
    login,
    register,
    logout,
    refreshUser,
    isAuthenticated: isAuth(),
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};