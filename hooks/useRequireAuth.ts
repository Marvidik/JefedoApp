import { useEffect } from 'react';
import { useRouter } from 'expo-router';
import { useAuth } from '../context/AuthContext';
import { tokenStorage } from '../services/axiosInstance';

export function useRequireAuth() {
  const { isLoggedIn, setIsLoggedIn, setUser } = useAuth();
  const router = useRouter();

  useEffect(() => {
    const checkAuth = async () => {
      const token = await tokenStorage.getAccessToken();
      if (!token || !isLoggedIn) {
        setIsLoggedIn(false);
        setUser(null);
        router.replace('/login');
      }
    };
    
    checkAuth();
  }, [isLoggedIn]);

  return { isLoggedIn };
}
