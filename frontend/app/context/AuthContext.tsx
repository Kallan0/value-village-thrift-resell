import { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import toast from 'react-hot-toast';
import { api } from '../lib/api';
import { auth, googleProvider, appleProvider, isFirebaseConfigured } from '../config/firebase';
import { signInWithPopup } from 'firebase/auth';

export interface UserProfile {
  id: string;
  name: string;
  firstName?: string;
  lastName?: string;
  email: string;
  phone?: string;
  imageUrl?: string;
  isPremium?: boolean;
  role?: string;
  authProvider?: string;
  shippingAddress?: {
    street?: string;
    city?: string;
    state?: string;
    postalCode?: string;
    country?: string;
  };
}

interface AuthContextType {
  isAuthenticated: boolean;
  user: UserProfile | null;
  token: string | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  loginWithGoogle: () => Promise<boolean>;
  loginWithApple: () => Promise<boolean>;
  requestOtp: (firstName: string, lastName: string, email: string, password: string) => Promise<{ success: boolean; message: string }>;
  verifyOtp: (email: string, otp: string) => Promise<{ success: boolean; message: string }>;
  logout: () => void;
  updateProfile: (updatedData: Partial<UserProfile>) => Promise<boolean>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const TOKEN_KEY = 'value-village-token';

export function AuthProvider({ children }: { children: ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<UserProfile | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Helper to format backend user object
  const formatUser = (userData: any): UserProfile => ({
    id: userData._id || userData.id,
    name: userData.name || `${userData.firstName || ''} ${userData.lastName || ''}`.trim() || 'Thrifter',
    firstName: userData.firstName,
    lastName: userData.lastName,
    email: userData.email,
    phone: userData.phone || '',
    imageUrl: userData.avatarUrl || userData.imageUrl || `https://avatar.vercel.sh/${encodeURIComponent(userData.email)}`,
    isPremium: userData.isPremium || false,
    role: userData.role || 'user',
    authProvider: userData.authProvider || 'local',
    shippingAddress: userData.shippingAddress || {}
  });

  // Load existing session on initial render
  useEffect(() => {
    const initSession = async () => {
      const savedToken = localStorage.getItem(TOKEN_KEY);
      if (!savedToken) {
        setIsLoading(false);
        return;
      }

      setToken(savedToken);

      try {
        const res = await api('/api/users/me');
        if (res.ok) {
          const userData = await res.json();
          setUser(formatUser(userData));
          setIsAuthenticated(true);
        } else {
          // Token expired or invalid
          localStorage.removeItem(TOKEN_KEY);
          setToken(null);
          setUser(null);
          setIsAuthenticated(false);
        }
      } catch (err) {
        console.warn('Could not restore session from backend:', err);
      } finally {
        setIsLoading(false);
      }
    };

    initSession();
  }, []);

  const saveAuthSession = (authToken: string, userData: any) => {
    localStorage.setItem(TOKEN_KEY, authToken);
    setToken(authToken);
    setUser(formatUser(userData));
    setIsAuthenticated(true);
  };

  // --- 1. LOCAL LOGIN ---
  const login = async (email: string, password: string) => {
    try {
      const response = await api('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });
      const data = await response.json();

      if (response.ok && data.token) {
        saveAuthSession(data.token, data.user);
        toast.success(`Welcome back, ${data.user.firstName || 'Thrifter'}!`);
        return true;
      }

      toast.error(data.message || 'Login failed');
      return false;
    } catch (error) {
      console.error('Failed to connect to backend:', error);
      toast.error('Unable to connect to server. Please ensure backend is running.');
      return false;
    }
  };

  // --- 2. GOOGLE LOGIN (FIREBASE) ---
  const loginWithGoogle = async () => {
    if (!isFirebaseConfigured || !auth) {
      toast.error('Firebase credentials are not configured yet in environment variables.');
      return false;
    }

    try {
      toast.loading('Opening Google sign-in...', { id: 'social-login' });
      const userCredential = await signInWithPopup(auth, googleProvider);
      const idToken = await userCredential.user.getIdToken();

      toast.loading('Verifying account with server...', { id: 'social-login' });
      const response = await api('/api/auth/firebase', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ idToken })
      });

      const data = await response.json();

      if (response.ok && data.token) {
        saveAuthSession(data.token, data.user);
        toast.success(data.message || 'Signed in with Google successfully!', { id: 'social-login' });
        return true;
      }

      toast.error(data.message || 'Google sign-in verification failed.', { id: 'social-login' });
      return false;
    } catch (error: any) {
      console.error('Google Sign-In Error:', error);
      if (error.code === 'auth/popup-closed-by-user') {
        toast.dismiss('social-login');
      } else {
        toast.error(error.message || 'Failed to sign in with Google.', { id: 'social-login' });
      }
      return false;
    }
  };

  // --- 3. APPLE LOGIN (FIREBASE) ---
  const loginWithApple = async () => {
    if (!isFirebaseConfigured || !auth) {
      toast.error('Firebase credentials are not configured yet in environment variables.');
      return false;
    }

    try {
      toast.loading('Opening Apple sign-in...', { id: 'social-login' });
      const userCredential = await signInWithPopup(auth, appleProvider);
      const idToken = await userCredential.user.getIdToken();

      toast.loading('Verifying account with server...', { id: 'social-login' });
      const response = await api('/api/auth/firebase', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ idToken })
      });

      const data = await response.json();

      if (response.ok && data.token) {
        saveAuthSession(data.token, data.user);
        toast.success(data.message || 'Signed in with Apple successfully!', { id: 'social-login' });
        return true;
      }

      toast.error(data.message || 'Apple sign-in verification failed.', { id: 'social-login' });
      return false;
    } catch (error: any) {
      console.error('Apple Sign-In Error:', error);
      if (error.code === 'auth/popup-closed-by-user') {
        toast.dismiss('social-login');
      } else {
        toast.error(error.message || 'Failed to sign in with Apple.', { id: 'social-login' });
      }
      return false;
    }
  };

  // --- 4. OTP REGISTRATION ---
  const requestOtp = async (firstName: string, lastName: string, email: string, password: string) => {
    try {
      const response = await api('/api/auth/request-otp', {
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
      const response = await api('/api/auth/verify-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, otp })
      });
      const data = await response.json();

      if (response.ok && data.token) {
        saveAuthSession(data.token, data.user);
        toast.success('Account created successfully!');
        return { success: true, message: data.message };
      }

      return { success: false, message: data.message || 'Verification failed.' };
    } catch (error) {
      console.error('Failed to connect to backend:', error);
      return { success: false, message: 'Unable to connect to the server.' };
    }
  };

  // --- 5. UPDATE PROFILE ---
  const updateProfile = async (updatedData: Partial<UserProfile>): Promise<boolean> => {
    try {
      const response = await api('/api/users/profile', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedData)
      });
      const data = await response.json();

      if (response.ok && data.user) {
        setUser(formatUser(data.user));
        toast.success('Profile updated!');
        return true;
      }

      toast.error(data.message || 'Failed to update profile.');
      return false;
    } catch (error) {
      console.error('Failed to update profile:', error);
      toast.error('Network error updating profile.');
      return false;
    }
  };

  // --- 6. LOGOUT ---
  const logout = () => {
    localStorage.removeItem(TOKEN_KEY);
    setToken(null);
    setUser(null);
    setIsAuthenticated(false);
    if (auth) {
      auth.signOut().catch(() => {});
    }
    toast.success('Logged out successfully.');
  };

  return (
    <AuthContext.Provider value={{
      isAuthenticated,
      user,
      token,
      isLoading,
      login,
      loginWithGoogle,
      loginWithApple,
      requestOtp,
      verifyOtp,
      logout,
      updateProfile
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
}