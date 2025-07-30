"use client";

import { ModeToggle } from "./mode-toggle";
import Link from "next/link";
import { useAppContext } from "@/app/AppProvider";

export default function Header() {
  const { sessionToken } = useAppContext();
  const isAuth = sessionToken ? true : false;

  return (
    <header className="p-4">
      <div className="flex justify-end">
        <ul className="flex gap-4">
          <li>
            <Link href="/">Home</Link>
          </li>
          {isAuth ? (
            <li>
              <Link href="/me">Profile</Link>
            </li>
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
