"use client";

import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

export default function Navbar() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const router = useRouter();

  useEffect(() => {
    // Можно заменить на реальную проверку авторизации
    const token = localStorage.getItem("token");
    setIsLoggedIn(!!token);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    router.push("/login");
  };

  return (
    <nav className="bg-blue-600 text-white px-4 py-3 shadow flex justify-between items-center">
      <Link href="/" className="text-xl font-semibold hover:text-gray-200">
        Voting App
      </Link>

      <div className="space-x-4">
        <Link href="/vote" className="hover:underline">Vote</Link>
        {!isLoggedIn ? (
          <>
            <Link href="/login" className="hover:underline">Login</Link>
            <Link href="/register" className="hover:underline">Register</Link>
          </>
        ) : (
          <button onClick={handleLogout} className="hover:underline">Logout</button>
        )}
      </div>
    </nav>
  );
}