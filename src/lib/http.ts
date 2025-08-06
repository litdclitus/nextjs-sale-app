import envConfig from "@/config";
import { useAuthStore } from "@/stores/auth";
import { redirect } from "next/navigation";


type CustomOptions = RequestInit & {
    baseUrl?: string;
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

const request = async <ResponseType> (method: string, url: string, options: CustomOptions | undefined) => {
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

    const requestOptions: RequestInit = {
        method,
        headers,
        body,
        ...options,
    };

    const response = await fetch(fullUrl, requestOptions);
    if (!response.ok) {
        if (response.status === ENTITY_ERROR_CODE) {
            throw new HttpError({ status: response.status, payload: await response.json() });
        }
        else if (response.status === AUTHENTICATION_ERROR_CODE) {
            // TODO: Handle authentication error
            if (typeof window !== 'undefined') {
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
    post: <ResponseType>(url: string, body: unknown, options?: CustomOptions | undefined) => request<ResponseType>('POST', url, { ...options, body: JSON.stringify(body) }),
    put: <ResponseType>(url: string, body: unknown, options?: CustomOptions | undefined) => request<ResponseType>('PUT', url, { ...options, body: JSON.stringify(body) }),
    delete: <ResponseType>(url: string, options?: CustomOptions | undefined) => request<ResponseType>('DELETE', url, options),
}

export default http;
export { HttpError };