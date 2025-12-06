import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import axios from '../utils/axios';

interface User {
  id: number;
  name: string;
  email: string;
}

interface AuthContextType {
  user: User | null;
  signUp: (name: string, email: string, password: string, password_confirmation: string) => Promise<{ error: string | null }>;
  signIn: (email: string, password: string) => Promise<{ error: string | null }>;
  signOut: () => Promise<void>;
  fetchUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [user, setUser] = useState<User | null>(null);
  const [initializing, setInitializing] = useState(true);

  // CSRF + API request helper
  const getCsrfCookie = async () => {
    try {
      await axios.get('/sanctum/csrf-cookie', { withCredentials: true });
    } catch (error) {
      console.error('Failed to get CSRF cookie', error);
    }
  };

  // Fetch authenticated user
  const fetchUser = async () => {
    try {
      await getCsrfCookie();
      const res = await axios.get('/api/user');
      setUser(res.data.user);
    } catch (error) {
      setUser(null);
    } finally {
      setInitializing(false);
    }
  };

  useEffect(() => {
    fetchUser();
  }, []);

  const signUp = async (name: string, email: string, password: string, password_confirmation: string) => {
    try {
      await getCsrfCookie();
      const res = await axios.post(
        '/api/register',
        { name, email, password, password_confirmation }
      );
      setUser(res.data.user);
      return { error: null };
    } catch (error: any) {
      if (axios.isAxiosError(error)) {
        // Return Laravel validation messages if any
        const msg =
          error.response?.data?.message ||
          (error.response?.data?.errors
            ? Object.values(error.response.data.errors).flat().join(', ')
            : error.message);
        return { error: msg };
      }
      return { error: error.message || 'An unknown error occurred' };
    }
  };

  const signIn = async (email: string, password: string) => {
    try {
      await getCsrfCookie();
      const res = await axios.post(
        '/api/login',
        { email, password }
      );
      setUser(res.data.user);
      return { error: null };
    } catch (error: any) {
      if (axios.isAxiosError(error)) {
        const msg =
          error.response?.data?.message ||
          (error.response?.data?.errors
            ? Object.values(error.response.data.errors).flat().join(', ')
            : error.message);
        return { error: msg };
      }
      return { error: error.message || 'An unknown error occurred' };
    }
  };

  const signOut = async () => {
    try {
      await getCsrfCookie();
      await axios.post('/api/logout', {});
      setUser(null);
    } catch (error) {
      console.error(error);
    }
  };

  // Show nothing while checking auth on initial load
  if (initializing) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#0f172a] via-[#1e293b] to-[#0f172a] flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-16 h-16 border-4 border-pink-500/30 border-t-pink-500 rounded-full animate-spin"></div>
          <p className="text-white/60 text-sm">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <AuthContext.Provider value={{ user, signUp, signIn, signOut, fetchUser }}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
};
