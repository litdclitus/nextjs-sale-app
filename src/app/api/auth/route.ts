import { decodeJWT } from "@/lib/utils";

type PayloadJWT = {
    userId: number;
    tokenType: string;
    iat: number;
    exp: number;
}


export async function POST(request: Request) {
    const res = await request.json();
    const sessionToken = res.sessionToken as string;
    if (!sessionToken) {
        return Response.json({error: "Session token not found"}, {status: 401});
    }
    
    const payload = decodeJWT<PayloadJWT>(sessionToken);
    const expiresAt = new Date(payload.exp * 1000).toUTCString();
  return Response.json({res}, {
    status: 200,
    headers: { 'Set-Cookie': `sessionToken=${sessionToken}; Path=/; HttpOnly; Secure; SameSite=Lax; Expires=${expiresAt}` },
  });
}