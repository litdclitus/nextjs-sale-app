"use client";

import { useRouter } from "next/navigation";

const ButtonRedirect = () => {
  const router = useRouter();
  return (
    <button
      onClick={() => router.push("/login")}
      className="text-blue-500 hover:text-blue-700"
    >
      Back to Login
    </button>
  );
};
export default ButtonRedirect;
