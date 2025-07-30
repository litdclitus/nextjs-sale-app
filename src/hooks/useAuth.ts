import { useAuthStore } from "@/stores/auth";
import { useEffect } from "react";
import authApiRequest from "@/apiRequests/auth";

export const useAuth = () => {
    const store = useAuthStore();

    return {
        //state
        sessionToken: store.sessionToken,
        isAuthenticated: store.isAuthenticated,
        isHydrated: store.isHydrated,

        //actions
        setSessionToken: store.setSessionToken,
        logout: store.logout,
        hydrate: store.hydrate,
    }
}

export const useLogout = () => {
    const { sessionToken, logout: clearState } = useAuthStore();

    const logout = async (): Promise<void> => {
        // 1. Clear client state immediately (optimistic update)
        clearState();
        
        if (sessionToken) {
            try {
                await authApiRequest.logout(sessionToken);
                // Step 2: Clear HttpOnly cookie (port 3000)
                await fetch('/api/logout', { method: 'POST' });
            } catch (error) {
                console.error("Logout API failed:", error);
            }
        }
    };

    return { logout };
};

// auto hydrate with server token
export const useAuthHydration = (initialServerToken: string) => {
    const { hydrate, isHydrated } = useAuth();

    useEffect(() => {
        if (!isHydrated) {
            hydrate(initialServerToken);
        }
    }, [hydrate, isHydrated, initialServerToken]);

    return isHydrated;
}