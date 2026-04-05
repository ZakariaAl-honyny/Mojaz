import {create} from 'zustand';
import {persist, createJSONStorage} from 'zustand/middleware';

interface User {
  id: string;
  fullName: string;
  email: string;
  role: string;
}

interface AuthState {
  user: User | null;
  accessToken: string | null;
  refreshToken: string | null;
  isAuthenticated: boolean;
  locale: string;
  setAuth: (user: User, accessToken: string, refreshToken: string) => void;
  setTokens: (accessToken: string, refreshToken: string) => void;
  setLocale: (locale: string) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      accessToken: null,
      refreshToken: null,
      isAuthenticated: false,
      locale: 'ar',
      setAuth: (user, accessToken, refreshToken) =>
        set({user, accessToken, refreshToken, isAuthenticated: true}),
      setTokens: (accessToken, refreshToken) =>
        set({accessToken, refreshToken}),
      setLocale: (locale) => set({locale}),
      logout: () =>
        set({user: null, accessToken: null, refreshToken: null, isAuthenticated: false}),
    }),
    {
      name: 'mojaz-auth-storage',
      storage: createJSONStorage(() => localStorage),
    }
  )
);
