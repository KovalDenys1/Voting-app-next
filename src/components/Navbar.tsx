import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { jwtDecode } from "jwt-decode";
import { Menu, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

type DecodedToken = {
  email: string;
  exp: number;
};

export default function Navbar() {
  const router = useRouter();
  const [email, setEmail] = useState<string | null>(null);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      try {
        const decoded = jwtDecode<DecodedToken>(token);
        setEmail(decoded.email);
      } catch {
        setEmail(null);
      }
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    router.push("/login");
  };

  const links = email
    ? [
        { href: "/vote", label: "Vote" },
        { href: "/results", label: "Results" },
      ]
    : [
        { href: "/login", label: "Login" },
        { href: "/register", label: "Register" },
      ];

  return (
    <header className="bg-blue-700 text-white px-6 py-4 shadow flex justify-between items-center">
      <h1 className="text-xl font-bold">Voting app by Denys Koval</h1>

      {/* Desktop Nav */}
      <nav className="hidden md:flex gap-4 items-center">
        {links.map((link) => (
          <Link key={link.href} href={link.href} className="hover:underline">
            {link.label}
          </Link>
        ))}
        {email && (
          <>
            <span className="text-sm">Logged in as <strong>{email}</strong></span>
            <button
              onClick={handleLogout}
              className="bg-red-500 hover:bg-red-600 text-white text-sm px-3 py-1 rounded"
            >
              Logout
            </button>
          </>
        )}
      </nav>

      {/* Mobile Toggle */}
      <div className="md:hidden">
        <button onClick={() => setMenuOpen(!menuOpen)}>
          {menuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Nav */}
      <AnimatePresence>
        {menuOpen && (
          <motion.nav
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="absolute top-16 left-0 w-full bg-blue-700 text-white flex flex-col items-center gap-4 py-4 md:hidden z-50"
          >
            {links.map((link) => (
              <Link key={link.href} href={link.href} onClick={() => setMenuOpen(false)}>
                {link.label}
              </Link>
            ))}
            {email && (
              <>
                <span className="text-sm">Logged in as <strong>{email}</strong></span>
                <button
                  onClick={() => {
                    setMenuOpen(false);
                    handleLogout();
                  }}
                  className="bg-red-500 hover:bg-red-600 text-white text-sm px-3 py-1 rounded"
                >
                  Logout
                </button>
              </>
            )}
          </motion.nav>
        )}
      </AnimatePresence>
    </header>
  );
}