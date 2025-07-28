import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

const privatePaths = ["/me"];
const authPaths = ["/login", "/register"];
 
// This function can be marked `async` if using `await` inside
export function middleware(request: NextRequest) {
  const sessionToken = request.cookies.get("sessionToken")?.value;
  const isPrivatePath = privatePaths.some((path) =>
    request.nextUrl.pathname.startsWith(path)
  );
  const isAuthPath = authPaths.some((path) =>
    request.nextUrl.pathname.startsWith(path)
  );
  if (isPrivatePath && !sessionToken) {
    return NextResponse.redirect(new URL("/login", request.url));
  } else if (isAuthPath && sessionToken) {
    return NextResponse.redirect(new URL("/me", request.url));
  }
  return NextResponse.next();
}
 
// See "Matching Paths" below to learn more
export const config = {
  matcher: [...privatePaths, ...authPaths],
};