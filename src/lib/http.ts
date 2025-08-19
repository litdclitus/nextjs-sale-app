import envConfig from "@/config";
import { useAuthStore } from "@/stores/auth";
import { redirect } from "next/navigation";


type CustomOptions = Omit<RequestInit, 'body'> & {
    baseUrl?: string;
    body?: unknown;
}

// Types for validation errors
export interface ValidationError {
    field: string;
    message: string;
}

export interface ApiErrorPayload {
    message?: string;
    errors?: ValidationError[];
    statusCode?: number;
}

const ENTITY_ERROR_CODE = 422;
const AUTHENTICATION_ERROR_CODE = 401;

class HttpError extends Error {
    status: number;
    payload: ApiErrorPayload;
    constructor({ status, payload }: { status: number; payload: ApiErrorPayload }) {
        super('Http Error');
        this.name = "HttpError";
        this.status = status;
        this.payload = payload;
    }

    // Check if this is a validation error (422)
    isValidationError(): boolean {
        return this.status === ENTITY_ERROR_CODE && !!this.payload.errors && this.payload.errors.length > 0;
    }

    // Get validation errors
    getValidationErrors(): ValidationError[] {
        return this.payload.errors || [];
    }

    // Get error message
    getErrorMessage(fallback: string = "An error occurred"): string {
        return this.payload.message || fallback;
    }
}

// Function to check if token needs renewal
const shouldRenewToken = (): boolean => {
    if (typeof window === 'undefined') return false; // Skip on server-side
    
    const authStore = useAuthStore.getState();
    const { sessionToken, expiresAt } = authStore;
    
    if (!sessionToken || !expiresAt) return false;
    
    const now = new Date().getTime();
    const expires = new Date(expiresAt).getTime();
    const timeUntilExpiry = expires - now;
    
    // Renew if token expires within 5 minutes (300000ms)
    return timeUntilExpiry <= 300000 && timeUntilExpiry > 0;
};

// Function to renew session token
const renewSessionToken = async (): Promise<void> => {
    try {
        // Use fetch directly to avoid circular dependency
        const response = await fetch('/api/slide-session', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
        });
        
        if (response.ok) {
            const result = await response.json();
            if (result.data?.expiresAt) {
                // Update the auth store with new expiration time
                const authStore = useAuthStore.getState();
                authStore.setSessionToken(authStore.sessionToken, result.data.expiresAt);
                console.log('✅ Session token renewed successfully, new expiry:', result.data.expiresAt);
            }
        } else {
            console.warn('❌ Failed to renew session token - response not ok:', response.status);
        }
    } catch (error) {
        console.warn('❌ Failed to renew session token:', error);
    }
};

const request = async <ResponseType> (method: string, url: string, options: CustomOptions | undefined) => {
    // Check if we need to renew token before making the request
    // But skip renewal if we're already calling the slide-session endpoint to prevent circular dependency
    if (shouldRenewToken() && !url.includes('/slide-session')) {
        await renewSessionToken();
    }

    const body = options?.body ? JSON.stringify(options.body) : undefined;
    const baseHeaders = {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
    }

    // if not pass baseUrl or baseUrl is undefined, use envConfig.NEXT_PUBLIC_API_ENDPOINT
    // if pass baseUrl, use it. Pass '' means call API to nextjs server
    const headers = options?.headers ? { ...baseHeaders, ...options.headers } : baseHeaders;
    const baseUrl = options?.baseUrl === undefined ? envConfig.NEXT_PUBLIC_API_ENDPOINT : options.baseUrl;
    const fullUrl = url.startsWith('/') ? `${baseUrl}${url}` : `${baseUrl}/${url}`;

    const { body: _, ...restOptions } = options || {};
    const requestOptions: RequestInit = {
        method,
        headers,
        body: body as BodyInit | null | undefined,
        ...restOptions,
    };

    const response = await fetch(fullUrl, requestOptions);
    if (!response.ok) {
        if (response.status === ENTITY_ERROR_CODE) {
            throw new HttpError({ status: response.status, payload: await response.json() });
        }
        else if (response.status === AUTHENTICATION_ERROR_CODE) {
            // TODO: Handle authentication error
            if (typeof window !== 'undefined') {
                // CLIENT SIDE
                await fetch('/api/logout', {
                    method: 'POST',
                    body: JSON.stringify({ force: true }),
                    headers: {
                        ...baseHeaders,
                    },
                });
                // Clear client session token
                const authStore = useAuthStore.getState();
                authStore.setSessionToken('');
                window.location.href = '/login';
            }else {
                // SERVER SIDE
               const sessionToken = (options?.headers as unknown as { Authorization: string })?.Authorization?.split('Bearer ')[1];
               redirect(`/logout?sessionToken=${sessionToken}&force=true`);
            }
        }
        else {
            throw new HttpError({ status: response.status, payload: { message: "An error occurred" } });
        }
    }
    
    return response.json() as Promise<ResponseType>;
}

const http = {
    get: <ResponseType>(url: string, options?: CustomOptions | undefined) => request<ResponseType>('GET', url, options),
    post: <ResponseType>(url: string, body: unknown, options?: CustomOptions | undefined) => request<ResponseType>('POST', url, { ...options, body }),
    put: <ResponseType>(url: string, body: unknown, options?: CustomOptions | undefined) => request<ResponseType>('PUT', url, { ...options, body }),
    delete: <ResponseType>(url: string, options?: CustomOptions | undefined) => request<ResponseType>('DELETE', url, options),
}

export default http;
export { HttpError };