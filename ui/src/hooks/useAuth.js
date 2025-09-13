import { useState, useEffect } from "react";

export function useAuth() {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check localStorage for authentication
    const isAuthenticated = localStorage.getItem('isAuthenticated') === 'true';
    const userData = localStorage.getItem('user');
    const token = localStorage.getItem('token');
    
    if (isAuthenticated && userData && token) {
      try {
        const parsedUser = JSON.parse(userData);
        setUser(parsedUser);
      } catch (error) {
        console.error('Error parsing user data:', error);
        clearAuthData();
      }
    }
    
    setIsLoading(false);
  }, []);

  const clearAuthData = () => {
    localStorage.removeItem('isAuthenticated');
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    setUser(null);
  };

  const logout = () => {
    clearAuthData();
    // Navigate to root and reload to ensure clean state
    window.location.href = '/';
  };

  const updateUser = (userData) => {
    setUser(userData);
    localStorage.setItem('user', JSON.stringify(userData));
  };

  return {
    user,
    isLoading,
    isAuthenticated: !!user,
    logout,
    updateUser,
  };
}
