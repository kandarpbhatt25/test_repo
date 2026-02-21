import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import apiService from '../services/api';

interface User {
  id: string;
  email: string;
  role: string;
  name?: string;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check for existing token on mount
    const token = localStorage.getItem('token');
    if (token) {
      // Validate token by checking if it exists
      // In a real app, you might want to validate the token with the backend
      try {
        // For now, we'll just check if token exists and set a mock user
        // In production, you'd want to decode the JWT or call a /me endpoint
        const mockUser: User = {
          id: '1',
          email: 'user@fleetflow.com',
          role: 'admin',
          name: 'Fleet Manager'
        };
        setUser(mockUser);
      } catch (error) {
        // Invalid token, clear it
        localStorage.removeItem('token');
      }
    }
    setLoading(false);
  }, []);

  const login = async (email: string, password: string) => {
    setLoading(true);
    try {
      const response = await apiService.post('/auth/login', { email, password });
      
      if (response.token) {
        // Store JWT token
        apiService.setToken(response.token);
        
        // Set user data
        const userData: User = {
          id: response.user?.id || '1',
          email: response.user?.email || email,
          role: response.user?.role || 'admin',
          name: response.user?.name || 'Fleet Manager'
        };
        
        setUser(userData);
      } else {
        throw new Error(response.message || 'Login failed');
      }
    } catch (error: any) {
      throw new Error(error.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    apiService.clearToken();
    setUser(null);
  };

  const value: AuthContextType = {
    user,
    isAuthenticated: !!user,
    login,
    logout,
    loading
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}
