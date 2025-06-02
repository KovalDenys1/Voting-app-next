"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { Menu, X } from "lucide-react";

export default function Layout({ children }: { children: React.ReactNode }) {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("token");
    setIsLoggedIn(!!token);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    setIsLoggedIn(false);
    router.push("/login");
  };

  const toggleMenu = () => setMenuOpen((prev) => !prev);

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <header className="bg-blue-700 text-white px-6 py-4 shadow">
        <div className="flex justify-between items-center">
          <h1 className="text-xl font-bold">Norwegian Voting</h1>
          <button onClick={toggleMenu} className="md:hidden">
            {menuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
          <nav className="hidden md:flex space-x-4">
            <Link href="/vote" className="hover:underline">Vote</Link>
            <Link href="/results" className="hover:underline">Results</Link>
            {!isLoggedIn ? (
              <>
                <Link href="/login" className="hover:underline">Login</Link>
                <Link href="/register" className="hover:underline">Register</Link>
              </>
            ) : (
              <button onClick={handleLogout} className="hover:underline">Logout</button>
            )}
          </nav>
        </div>

        {menuOpen && (
          <nav className="flex flex-col mt-4 space-y-2 md:hidden">
            <Link href="/vote" className="hover:underline" onClick={toggleMenu}>Vote</Link>
            <Link href="/results" className="hover:underline" onClick={toggleMenu}>Results</Link>
            {!isLoggedIn ? (
              <>
                <Link href="/login" className="hover:underline" onClick={toggleMenu}>Login</Link>
                <Link href="/register" className="hover:underline" onClick={toggleMenu}>Register</Link>
              </>
            ) : (
              <button onClick={() => { handleLogout(); toggleMenu(); }} className="hover:underline">Logout</button>
            )}
          </nav>
        )}
      </header>

      <main className="flex-1 p-6">{children}</main>
    </div>
  );
}