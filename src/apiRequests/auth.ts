import http from "@/lib/http";
import { LoginBodyType, LoginResType, RegisterBodyType, RegisterResType, SlideSessionResType } from "@api/schemaValidations/auth.schema";

const authApiRequest = {
    login: (body: LoginBodyType) => http.post<LoginResType>('/auth/login', body),
    register: (body: RegisterBodyType) => http.post<RegisterResType>('/auth/register', body),
    
    // 🍪 Cookie management - Next.js API (port 3000)
    auth: (body: { sessionToken: string; expiresAt: string }) => http.post('/api/auth', body, { baseUrl: '' }),
    
    // 🔐 Business logic with Bearer token - Backend API (port 4000)  
    logout: (sessionToken: string) => http.post('/auth/logout', {}, {
        headers: {
            'Authorization': `Bearer ${sessionToken}`
        }
    }),
    slideSession: (sessionToken: string) => http.post<SlideSessionResType>('/auth/slide-session', { }, { 
        headers: {
            'Authorization': `Bearer ${sessionToken}`
        }
    }),
    
    // 🔄 Client-side slide session - Next.js API (port 3000)
    slideSessionClient: () => http.post<{ data: { expiresAt: string }, message: string }>('/api/slide-session', {}, { baseUrl: '' }),
}

export default authApiRequest;