export async function POST(request: Request) {
    const res = await request.json();
    const sessionToken = res.sessionToken as string;
    const expiresAt = res.expiresAt as string;
    if (!sessionToken) {
        return Response.json({error: "Session token not found"}, {status: 401});
    }
    
    const expireDate = new Date(expiresAt).toUTCString();
  return Response.json({res}, {
    status: 200,
    headers: { 'Set-Cookie': `sessionToken=${sessionToken}; Path=/; HttpOnly; Secure; SameSite=Lax; Expires=${expireDate}` },
  });
}