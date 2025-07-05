import { useState, useEffect } from 'react';
import { User, signOut } from 'firebase/auth';
import { auth } from '../firebase';
import { toast } from 'sonner';
import { useTranslation } from 'react-i18next';

export const useAuth = () => {
  const { t } = useTranslation();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (user) => {
      setUser(user);
      setLoading(false);

      if (user) {
        // User is signed in
        try {
          const token = await user.getIdToken();
          localStorage.setItem("token", token);
          localStorage.setItem("currentUser", JSON.stringify({
            uid: user.uid,
            email: user.email,
            displayName: user.displayName
          }));
          setIsAuthenticated(true);
        } catch (error) {
          console.error('Error getting user token:', error);
          // If token is invalid, sign out
          await signOut(auth);
          localStorage.removeItem("token");
          localStorage.removeItem("currentUser");
          setIsAuthenticated(false);
        }
      } else {
        // User is signed out
        localStorage.removeItem("token");
        localStorage.removeItem("currentUser");
        setIsAuthenticated(false);
      }
    });

    return () => unsubscribe();
  }, []);

  const logout = async () => {
    try {
      await signOut(auth);
      localStorage.removeItem("token");
      localStorage.removeItem("currentUser");
      setIsAuthenticated(false);
      toast.success(t('logoutSuccess'));
    } catch (error) {
      console.error('Error signing out:', error);
      toast.error(t('errorLogout'));
    }
  };

  const validateToken = async () => {
    if (!user) return false;

    try {
      const token = await user.getIdToken(true); // Force refresh
      localStorage.setItem("token", token);
      return true;
    } catch (error) {
      console.error('Token validation failed:', error);
      await logout();
      return false;
    }
  };

  return {
    user,
    loading,
    isAuthenticated,
    logout,
    validateToken
  };
}; 