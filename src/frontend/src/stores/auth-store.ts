import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { UserRole } from '@/lib/enums';

// ============================================================
// Parse JWT exp claim to use as cookie expiration
// Falls back to 60 minutes if parsing fails
// ============================================================
function getTokenExpiry(token: string): Date {
  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    if (payload.exp) {
      return new Date(payload.exp * 1000);
    }
  } catch {
    // Malformed token — use fallback
  }
  const fallback = new Date();
  fallback.setMinutes(fallback.getMinutes() + 60);
  return fallback;
}

interface User {
  id: string;
  fullName: string;
  email: string;
  role: UserRole;
  phoneNumber?: string;
  nationalId?: string;
  createdAt?: string;
  
  // Official Profile Fields (Local Cache)
  address?: string;
  city?: string;
  region?: string;
  dateOfBirth?: string;
  gender?: number;
  nationality?: string;
  bloodType?: number;
  isEmailVerified?: boolean;
  isPhoneVerified?: boolean;
  isLocked?: boolean;
  isSecurityBlocked?: boolean;
}

interface AuthState {
  user: User | null;
  accessToken: string | null;
  refreshToken: string | null;
  isAuthenticated: boolean;
  locale: string;
  _hasHydrated: boolean;
  setAuth: (user: User, accessToken: string, refreshToken: string) => void;
  setTokens: (accessToken: string, refreshToken: string) => void;
  setLocale: (locale: string) => void;
  logout: () => void;
  updateUser: (user: Partial<User>) => void;
  setHasHydrated: (state: boolean) => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      accessToken: null,
      refreshToken: null,
      isAuthenticated: false,
      locale: 'ar',
      _hasHydrated: false,

      setHasHydrated: (state) => set({ _hasHydrated: state }),

      setAuth: (user, accessToken, refreshToken) => {
        set({ user, accessToken, refreshToken, isAuthenticated: true });
        // Set cookies for middleware — access cookie expires with JWT
        if (typeof document !== 'undefined') {
          const accessExpiry = getTokenExpiry(accessToken);
          const refreshExpiry = new Date();
          refreshExpiry.setDate(refreshExpiry.getDate() + 7);

          document.cookie = `accessToken=${accessToken}; path=/; expires=${accessExpiry.toUTCString()}; sameSite=Lax`;
          document.cookie = `refreshToken=${refreshToken}; path=/; expires=${refreshExpiry.toUTCString()}; sameSite=Lax`;
        }
      },

      setTokens: (accessToken, refreshToken) => {
        // Set cookies FIRST (so middleware sees fresh tokens on next navigation)
        if (typeof document !== 'undefined') {
          const accessExpiry = getTokenExpiry(accessToken);
          const refreshExpiry = new Date();
          refreshExpiry.setDate(refreshExpiry.getDate() + 7);

          document.cookie = `accessToken=${accessToken}; path=/; expires=${accessExpiry.toUTCString()}; sameSite=Lax`;
          document.cookie = `refreshToken=${refreshToken}; path=/; expires=${refreshExpiry.toUTCString()}; sameSite=Lax`;
        }
        // Then update Zustand state
        set({ accessToken, refreshToken });
      },

      setLocale: (locale) => set({ locale }),

      logout: () => {
        set({
          user: null,
          accessToken: null,
          refreshToken: null,
          isAuthenticated: false,
        });
        // Clear cookies AND localStorage to prevent phantom rehydration
        if (typeof document !== 'undefined') {
          document.cookie = 'accessToken=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT; sameSite=Lax';
          document.cookie = 'refreshToken=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT; sameSite=Lax';
          try {
            localStorage.removeItem('mojaz-auth-storage');
          } catch {
            // Ignore storage errors in edge cases
          }
        }
      },

      updateUser: (userData) => {
        set((state) => ({
          user: state.user ? { ...state.user, ...userData } : null
        }));
      },
    }),
    {
      name: 'mojaz-auth-storage',
      storage: createJSONStorage(() => localStorage), // FIX BUG-01: cross-tab persistence
      partialize: (state) => ({
        user: state.user,
        accessToken: state.accessToken,
        refreshToken: state.refreshToken,
        isAuthenticated: state.isAuthenticated,
        locale: state.locale,
      }),
      onRehydrateStorage: () => (state) => {
        // Called AFTER Zustand has finished reading from localStorage
        // This is the REAL hydration signal — not a useState(false) hack
        state?.setHasHydrated(true);
      },
    }
  )
);
