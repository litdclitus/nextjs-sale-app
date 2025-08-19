import { cookies } from "next/headers";
import authApiRequest from "@/apiRequests/auth";
import { SlideSessionResType } from "@api/schemaValidations/auth.schema";

export async function POST(request: Request) {
    const cookieStore = await cookies();
    const sessionToken = cookieStore.get('sessionToken');
    
    if (!sessionToken) {
        return Response.json({error: "Session token not found"}, {status: 401});
    }
    
    try {
        // Call backend slide-session API to renew token
        const slideResult: SlideSessionResType = await authApiRequest.slideSession(sessionToken.value);
        
        const { token, expiresAt } = slideResult.data;
        const expiresDate = new Date(expiresAt).toUTCString();
        
        // Set new token in httpOnly cookie
        return Response.json(
            { 
                message: slideResult.message,
                data: {
                    expiresAt: expiresAt
                }
            }, 
            {
                status: 200,
                headers: { 
                    'Set-Cookie': `sessionToken=${token}; Path=/; HttpOnly; Secure; SameSite=Lax; Expires=${expiresDate}` 
                },
            }
        );
    } catch (error) {
        console.error('Slide session error:', error);
        return Response.json({error: "Failed to renew session"}, {status: 500});
    }
}