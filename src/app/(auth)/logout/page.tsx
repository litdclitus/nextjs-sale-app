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

  return <div>Logging out...</div>;
};

export default LogoutPage;
