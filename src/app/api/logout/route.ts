import authApiRequest from "@/apiRequests/auth";
import { HttpError } from "@/lib/http";
import { cookies } from "next/headers";

export async function POST(request: Request) {
  const cookieStore = await cookies();
  const sessionToken = cookieStore.get('sessionToken');
  const res = await request.json();

  const force = res.force as boolean || undefined
  if (force) {
    return Response.json(
      { message: "Force logout" }, 
      {
        status: 200,
        headers: { 
          'Set-Cookie': 'sessionToken=; Path=/; HttpOnly; Secure; SameSite=Strict; Max-Age=0' 
        },
      }
    );
  }

  if (!sessionToken) {
    return Response.json(
      { message: "No session token found" }, 
      {
        status: 400,
      }
    );
  }
  try {
    await authApiRequest.logout(sessionToken.value);
    return Response.json(
      { message: "Cookie cleared successfully" }, 
      {
        status: 200,
        headers: { 
          'Set-Cookie': 'sessionToken=; Path=/; HttpOnly; Secure; SameSite=Strict; Max-Age=0' 
        },
      }
    );
  } catch (error) {
    if (error instanceof HttpError) {
      return Response.json(error.payload, { status: error.status });
    }else {
    return Response.json(
      { message: "Failed to logout" }, 
      {
          status: 500,
        }
      );
    }
  }
}