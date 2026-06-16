// src/store/authStore.ts

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { User } from '@/types';

interface TenantInfo {
  id: string;
  name: string;
  apiKey: string;
}

interface AuthState {
  token: string | null;
  user: User | null;
  tenant: TenantInfo | null;
  isAuthenticated: boolean;
  // Actions
  setAuth: (token: string, user: User, tenant: TenantInfo) => void;
  clearAuth: () => void;
  updateUser: (user: Partial<User>) => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      token: null,
      user: null,
      tenant: null,
      isAuthenticated: false,

      setAuth: (token, user, tenant) =>
        set({ token, user, tenant, isAuthenticated: true }),

      clearAuth: () =>
        set({ token: null, user: null, tenant: null, isAuthenticated: false }),

      updateUser: (partial) =>
        set((state) => ({
          user: state.user ? { ...state.user, ...partial } : null,
        })),
    }),
    {
      name: 'auth-storage',
      // Only persist these keys
      partialize: (state) => ({
        token: state.token,
        user: state.user,
        tenant: state.tenant,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
);