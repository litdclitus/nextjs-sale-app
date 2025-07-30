export async function POST() {
  // Clear HttpOnly cookie by setting Max-Age=0
  return Response.json(
    { message: "Cookie cleared successfully" }, 
    {
      status: 200,
      headers: { 
        'Set-Cookie': 'sessionToken=; Path=/; HttpOnly; Secure; SameSite=Strict; Max-Age=0' 
      },
    }
  );
}