import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { tokenStorage } from '../services/axiosInstance';
import { getCurrentUser } from '../services/authService';

interface AuthContextType {
  isLoggedIn: boolean;
  user: any | null;
  setIsLoggedIn: (v: boolean) => void;
  setUser: (u: any) => void;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  isLoggedIn: false,
  user: null,
  setIsLoggedIn: () => {},
  setUser: () => {},
  refreshUser: async () => {},
});

export function AuthProvider({ children }: { children: ReactNode }) {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState<any | null>(null);

  const refreshUser = async () => {
    try {
      const token = await tokenStorage.getAccessToken();
      if (token) {
        setIsLoggedIn(true);
        const u = await getCurrentUser();
        setUser(u);
      } else {
        setIsLoggedIn(false);
        setUser(null);
      }
    } catch {
      setIsLoggedIn(false);
      setUser(null);
    }
  };

  useEffect(() => {
    refreshUser();
  }, []);

  return (
    <AuthContext.Provider value={{ isLoggedIn, user, setIsLoggedIn, setUser, refreshUser }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
