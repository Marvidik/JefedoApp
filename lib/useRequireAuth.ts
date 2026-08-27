import { useEffect } from 'react';
import { router } from 'expo-router';
import { useAuth } from '../context/AuthContext';

/**
 * Redirect unauthenticated users to the login page.
 * Call this at the top of any screen that requires auth.
 */
export function useRequireAuth() {
  const { isLoggedIn } = useAuth();

  useEffect(() => {
    if (!isLoggedIn) {
      router.replace('/(auth)/login');
    }
  }, [isLoggedIn]);

  return isLoggedIn;
}
