"use client";

import authApiRequest from "@/apiRequests/auth";
import { useEffect } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

const LogoutPage = () => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const sessionToken = searchParams.get("sessionToken");
    const force = searchParams.get("force");
    if (sessionToken && force) {
      authApiRequest.logout(sessionToken);
      router.push(`/login?redirectFrom=${pathname}`);
    }
  }, [searchParams, router, pathname]);

  return (
    <div>
      <div className="flex flex-col items-center justify-center h-screen">
        <div className="flex flex-col items-center justify-center h-screen">
          <h1 className="text-2xl font-bold">Logging out...</h1>
          <p className="text-sm text-gray-500">
            Please wait while we log you out...
          </p>
        </div>
      </div>
    </div>
  );
};

export default LogoutPage;
