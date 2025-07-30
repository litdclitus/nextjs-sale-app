import envConfig from "@/config";

type CustomOptions = RequestInit & {
    baseUrl?: string;
}

class HttpError extends Error {
    status: number;
    payload: unknown;
    constructor({ status, payload }: { status: number; payload: unknown }) {
        super('Http Error');
        this.name = "HttpError";
        this.status = status;
        this.payload = payload;
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
        throw new HttpError({ status: response.status, payload: await response.json() });
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