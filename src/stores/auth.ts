import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

interface AuthState {
  sessionToken: string;
  isAuthenticated: boolean;
  isHydrated: boolean;
  setSessionToken: (sessionToken: string) => void;
  logout: () => void;
  hydrate: (serverToken: string) => void;
}

export const useAuthStore = create<AuthState>()(
    // add persist middleware
    persist(
      (set) => ({
        // Initial state
        sessionToken: "",
        isAuthenticated: false,
        isHydrated: false,
        // Actions
        setSessionToken: (token: string) => {
          set({
            sessionToken: token,
            isAuthenticated: !!token,
            isHydrated: true,
          });
        },
        
        // 🔄 Pure state management - only clear state
        logout: () => {
          set({
            sessionToken: "",
            isAuthenticated: false,
            isHydrated: true,
          });
        },
        // Fix hydrate logic (trust server only)
        hydrate: (serverToken: string) => {
          // 🔥 Always trust server, never fallback localStorage
          set({
            sessionToken: serverToken,
            isAuthenticated: !!serverToken,
            isHydrated: true,
          });
        }
      }),
      {
        name: 'auth-storage', 
        storage: createJSONStorage(() => localStorage),

        // only persist sessionToken and isAuthenticated
        partialize: (state) => ({
            sessionToken: state.sessionToken,
            isAuthenticated: state.isAuthenticated,
            // not persist isHydrated (always false when reload page)
        }),
    }
  )
);