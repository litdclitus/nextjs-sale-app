"use client";

import { ModeToggle } from "./mode-toggle";
import Link from "next/link";
import { useAuth, useLogout } from "@/hooks/useAuth";
import { Button } from "./ui/button";
import { useRouter } from "next/navigation";

export default function Header() {
  const { isAuthenticated, isHydrated } = useAuth();
  const { logout } = useLogout();
  const router = useRouter();

  // 🔥 Logout handler
  const handleLogout = async () => {
    try {
      await logout();
      router.push("/login");
    } catch (error) {
      console.error("Logout failed:", error);
      router.push("/login");
    }
  };

  if (!isHydrated) {
    return (
      <header className="p-4">
        <div className="flex justify-end">
          <div className="animate-pulse">
            <div className="h-4 bg-gray-300 rounded w-20"></div>
          </div>
        </div>
      </header>
    );
  }

  return (
    <header className="p-4">
      <div className="flex justify-end">
        <ul className="flex gap-4 items-center">
          <li>
            <Link href="/">Home</Link>
          </li>
          {isAuthenticated ? (
            <>
              <li>
                <Link href="/me">Profile</Link>
              </li>
              <li>
                <Button className="cursor-pointer" variant="destructive" onClick={handleLogout}>
                  Logout
                </Button>
              </li>
            </>
          ) : (
            <>
              <li>
                <Link href="/login">Login</Link>
              </li>
              <li>
                <Link href="/register">Register</Link>
              </li>
            </>
          )}
          <li className="flex items-center">
            <ModeToggle />
          </li>
        </ul>
      </div>
    </header>
  );
}
