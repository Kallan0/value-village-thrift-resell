import { createContext, useContext, useState, type ReactNode } from 'react';

// 1. Define the exact shape of your User so the Sidebar doesn't crash
export interface UserProfile {
  id: string; // MongoDB ObjectId as a string
  name: string;
  email: string;
  phone?: string;
  imageUrl?: string;
  isPremium?: boolean;
}

interface AuthContextType {
  isAuthenticated: boolean;
  user: UserProfile | null; // Upgraded from 'any'
  login: (email: string, password: string) => Promise<boolean>;
  requestOtp: (firstName: string, lastName: string, email: string, password: string) => Promise<{ success: boolean; message: string }>;
  verifyOtp: (email: string, otp: string) => Promise<{ success: boolean; message: string }>;
  logout: () => void;
  updateProfile: (updatedData: Partial<UserProfile>) => void; // Added for the Sidebar Editor!
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<UserProfile | null>(null);

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
        // Map backend DB user to frontend profile shape (adding fallbacks if DB is missing fields)
        setUser({
          id: data.user._id,
          name: `${data.user.firstName} ${data.user.lastName}`.trim() || data.user.name,
          email: data.user.email,
          phone: data.user.phone || "+91 XXXXX XXXXX", // Fallback until they edit it
          imageUrl: data.user.imageUrl || "https://avatar.vercel.sh/" + data.user.email,
          isPremium: data.user.isPremium || false
        });
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
        setUser({
          id: data.user._id,
          name: `${data.user.firstName} ${data.user.lastName}`.trim() || data.user.name,
          email: data.user.email,
          phone: data.user.phone || "+91 XXXXX XXXXX",
          imageUrl: data.user.imageUrl || "https://avatar.vercel.sh/" + data.user.email,
          isPremium: data.user.isPremium || false
        });
        return { success: true, message: data.message };
      }

      return { success: false, message: data.message || 'Verification failed.' };
    } catch (error) {
      console.error('Failed to connect to backend:', error);
      return { success: false, message: 'Unable to connect to the server.' };
    }
  };

  // 2. The Sidebar Editor Function
  const updateProfile = (updatedData: Partial<UserProfile>) => {
    if (user) {
      setUser({ ...user, ...updatedData });
    }
  };

  // 3. CRITICAL UX FIX: Clear the user data on logout!
  const logout = () => {
    setIsAuthenticated(false);
    setUser(null); 
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, user, login, requestOtp, verifyOtp, logout, updateProfile }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
}