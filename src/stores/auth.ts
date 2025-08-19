import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

interface AuthState {
  sessionToken: string;
  expiresAt: string;
  isAuthenticated: boolean;
  isHydrated: boolean;
  setSessionToken: (sessionToken: string, expiresAt?: string) => void;
  logout: () => void;
  hydrate: (serverToken: string, expiresAt?: string) => void;
}

export const useAuthStore = create<AuthState>()(
    // add persist middleware
    persist(
      (set) => ({
        // Initial state
        sessionToken: "",
        expiresAt: "",
        isAuthenticated: false,
        isHydrated: false,
        // Actions
        setSessionToken: (token: string, expiresAt?: string) => {
          set({
            sessionToken: token,
            expiresAt: expiresAt || "",
            isAuthenticated: !!token,
            isHydrated: true,
          });
        },
        
        // 🔄 Pure state management - only clear state
        logout: () => {
          set({
            sessionToken: "",
            expiresAt: "",
            isAuthenticated: false,
            isHydrated: true,
          });
        },
        // Fix hydrate logic (trust server only)
        hydrate: (serverToken: string, expiresAt?: string) => {
          // 🔥 Always trust server, never fallback localStorage
          set({
            sessionToken: serverToken,
            expiresAt: expiresAt || "",
            isAuthenticated: !!serverToken,
            isHydrated: true,
          });
        }
      }),
      {
        name: 'auth-storage', 
        storage: createJSONStorage(() => localStorage),

        // only persist sessionToken, expiresAt and isAuthenticated
        partialize: (state) => ({
            sessionToken: state.sessionToken,
            expiresAt: state.expiresAt,
            isAuthenticated: state.isAuthenticated,
            // not persist isHydrated (always false when reload page)
        }),
    }
  )
);