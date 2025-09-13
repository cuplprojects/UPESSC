import { create } from 'zustand';
import { persist } from 'zustand/middleware';

const useAuthStore = create(
    persist(
        (set, get) => ({
            // Auth state
            user: null,
            isAuthenticated: false,
            isLoading: false,

            // Login action
            login: (userData) => {
                set({
                    user: userData,
                    isAuthenticated: true,
                    isLoading: false,
                });
            },

            // Logout action
            logout: () => {
                set({
                    user: null,
                    isAuthenticated: false,
                    isLoading: false,
                });
                // Clear session storage
                sessionStorage.removeItem('auth-storage');
                // Navigate to root
                window.location.href = '/';
            },

            // Set loading state
            setLoading: (loading) => {
                set({ isLoading: loading });
            },

            // Update user data
            updateUser: (userData) => {
                set({ user: userData });
            },

            // Check if user is admin
            isAdmin: () => {
                const { user } = get();
                return user?.admin === true;
            },
        }),
        {
            name: 'auth-storage',
            storage: {
                getItem: (name) => {
                    const str = sessionStorage.getItem(name);
                    if (!str) return null;
                    return JSON.parse(str);
                },
                setItem: (name, value) => {
                    sessionStorage.setItem(name, JSON.stringify(value));
                },
                removeItem: (name) => {
                    sessionStorage.removeItem(name);
                },
            },
        }
    )
);

export default useAuthStore;