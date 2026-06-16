import { createContext, useContext, useState, type ReactNode } from 'react';

// 1. Add register to the interface
interface AuthContextType {
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  register: (firstName: string, lastName: string, email: string, password: string) => Promise<boolean>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

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
        return true; 
      } else {
        alert(data.message);
        return false;
      }
    } catch (error) {
      return false;
    }
  };

  // 2. Add the new register function
  const register = async (firstName: string, lastName: string, email: string, password: string) => {
    try {
      const response = await fetch('http://localhost:5000/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ firstName, lastName, email, password })
      });
      const data = await response.json();
      if (response.ok) {
        // Automatically log them in after a successful registration
        setIsAuthenticated(true);
        return true; 
      } else {
        alert(data.message);
        return false;
      }
    } catch (error) {
      console.error("Failed to connect to backend:", error);
      return false;
    }
  };

  const logout = () => setIsAuthenticated(false);

  return (
    // 3. Expose register to the rest of the app
    <AuthContext.Provider value={{ isAuthenticated, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within an AuthProvider");
  return context;
}