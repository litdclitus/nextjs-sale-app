import { ModeToggle } from "./mode-toggle";
import Link from "next/link";

export default function Header() {
  return (
    <header className="p-4">
      <div className="flex justify-end">
        <ul className="flex gap-4">
          <li>
            <Link href="/">Home</Link>
          </li>
          <li>
            <Link href="/login">Login</Link>
          </li>
          <li>
            <Link href="/register">Register</Link>
          </li>
          <li className="flex items-center">
            <ModeToggle />
          </li>
        </ul>
      </div>
    </header>
  );
}
