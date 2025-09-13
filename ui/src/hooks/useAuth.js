import { useState, useEffect } from "react";
import useAuthStore from "@/stores/authStore";

export function useAuth() {
  const [legacyUser, setLegacyUser] = useState(null);
  const [legacyLoading, setLegacyLoading] = useState(true);
  
  // Get Zustand store state
  const { 
    user: storeUser, 
    isAuthenticated: storeAuthenticated, 
    isLoading: storeLoading,
    logout: storeLogout,
    updateUser: storeUpdateUser
  } = useAuthStore();

  useEffect(() => {
    // Check localStorage for legacy authentication (student login)
    const isAuthenticated = localStorage.getItem('isAuthenticated') === 'true';
    const userData = localStorage.getItem('user');
    const token = localStorage.getItem('token');
    
    if (isAuthenticated && userData && token) {
      try {
        const parsedUser = JSON.parse(userData);
        setLegacyUser(parsedUser);
      } catch (error) {
        console.error('Error parsing user data:', error);
        clearLegacyAuthData();
      }
    }
    
    setLegacyLoading(false);
  }, []);

  const clearLegacyAuthData = () => {
    localStorage.removeItem('isAuthenticated');
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    setLegacyUser(null);
  };

  const logout = () => {
    // Clear both legacy and store auth
    clearLegacyAuthData();
    storeLogout();
  };

  const updateUser = (userData) => {
    // Update both legacy and store
    setLegacyUser(userData);
    localStorage.setItem('user', JSON.stringify(userData));
    storeUpdateUser(userData);
  };

  // Determine which auth system is active
  const isStoreAuthenticated = storeAuthenticated && storeUser;
  const isLegacyAuthenticated = !!legacyUser;
  
  return {
    user: storeUser || legacyUser,
    isLoading: storeLoading || legacyLoading,
    isAuthenticated: isStoreAuthenticated || isLegacyAuthenticated,
    logout,
    updateUser,
    // Additional admin-specific properties
    isAdmin: storeUser?.admin === true,
  };
}
