// frontend/src/stores/authStore.ts
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { authAPI } from '@/lib/api';

interface User {
  id: number;
  username: string;
  email: string;
  role: string;
}

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isAdmin: boolean;
  login: (username: string, password: string) => Promise<void>;
  logout: () => void;
  checkAuth: () => boolean;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      isAuthenticated: false,
      isAdmin: false,

      login: async (email: string, password: string) => {
        try {
          const response = await authAPI.login(email, password);
          
          // Debug: Log the full response to see structure
          console.log('Full response:', response);
          console.log('response.data:', response.data);
          console.log('response.data.data:', response.data.data);
          
          // Backend returns: { success: true, message: "...", data: { token, user } }
          // Axios wraps it, so: response.data = { success, message, data: {...} }
          const responseData = response.data.data || response.data;
          const { token, user } = responseData;

          console.log('Extracted token:', token);
          console.log('Extracted user:', user);

          localStorage.setItem('auth_token', token);
          localStorage.setItem('user', JSON.stringify(user));

          set({
            user,
            token,
            isAuthenticated: true,
            isAdmin: user.role === 'admin',
          });
        } catch (error) {
          console.error('Login failed:', error);
          throw error;
        }
      },

      logout: () => {
        localStorage.removeItem('auth_token');
        localStorage.removeItem('user');

        set({
          user: null,
          token: null,
          isAuthenticated: false,
          isAdmin: false,
        });
      },

      checkAuth: () => {
        const token = localStorage.getItem('auth_token');
        const userStr = localStorage.getItem('user');

        if (token && userStr) {
          try {
            const user = JSON.parse(userStr);
            set({
              user,
              token,
              isAuthenticated: true,
              isAdmin: user.role === 'admin',
            });
            return true;
          } catch {
            return false;
          }
        }
        return false;
      },
    }),
    {
      name: 'auth-storage',
    }
  )
);
