
export async function POST(request: Request) {
    const res = await request.json();
    const sessionToken = res.data.token;
    if (!sessionToken) {
        return Response.json({error: "Session token not found"}, {status: 401});
    }
 
  return Response.json({res}, {
    status: 200,
    headers: { 'Set-Cookie': `sessionToken=${sessionToken}; Path=/; HttpOnly; Secure; SameSite=Strict` },
  });
}