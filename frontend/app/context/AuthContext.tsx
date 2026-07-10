import { createContext, useContext, useState, type ReactNode } from 'react';

interface AuthContextType {
  isAuthenticated: boolean;
  user: any;
  login: (email: string, password: string) => Promise<boolean>;
  requestOtp: (firstName: string, lastName: string, email: string, password: string) => Promise<{ success: boolean; message: string }>;
  verifyOtp: (email: string, otp: string) => Promise<{ success: boolean; message: string }>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<any>(null);

  const login = async (email: string, password: string) => {
    try {
      const response = await fetch('http://localhost:5000/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });
      const data = await response.json();
      if (response.ok) {
        setIsAuthenticated(true);
        setUser(data.user);
        return true;
      }

      alert(data.message);
      return false;
    } catch (error) {
      console.error('Failed to connect to backend:', error);
      return false;
    }
  };

  const requestOtp = async (firstName: string, lastName: string, email: string, password: string) => {
    try {
      const response = await fetch('http://localhost:5000/api/auth/request-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ firstName, lastName, email, password })
      });
      const data = await response.json();

      if (response.ok) {
        return { success: true, message: data.message };
      }

      return { success: false, message: data.message || 'Unable to send OTP.' };
    } catch (error) {
      console.error('Failed to connect to backend:', error);
      return { success: false, message: 'Unable to connect to the server.' };
    }
  };

  const verifyOtp = async (email: string, otp: string) => {
    try {
      const response = await fetch('http://localhost:5000/api/auth/verify-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, otp })
      });
      const data = await response.json();

      if (response.ok) {
        setIsAuthenticated(true);
        setUser(data.user);
        return { success: true, message: data.message };
      }

      return { success: false, message: data.message || 'Verification failed.' };
    } catch (error) {
      console.error('Failed to connect to backend:', error);
      return { success: false, message: 'Unable to connect to the server.' };
    }
  };

  const logout = () => setIsAuthenticated(false);

  return (
    <AuthContext.Provider value={{ isAuthenticated, user, login, requestOtp, verifyOtp, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
}