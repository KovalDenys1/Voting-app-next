import { useState } from "react";
import { useRouter } from "next/router";
import { Eye, EyeOff } from "lucide-react";
import Link from "next/link";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  // Handle login form submission
  const handleLogin = async () => {
    const res = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    const data = await res.json();

    if (res.ok) {
      // Save token to localStorage and redirect to vote page
      localStorage.setItem("token", data.token);
      router.push("/vote");
    } else {
      setError(data.message || "Login failed");
    }
  };

  return (
    <main className="flex min-h-screen items-center justify-center bg-gray-50 px-4">
      <div className="w-full max-w-sm space-y-4 p-6 bg-white border rounded shadow">
        <h1 className="text-xl font-bold text-center">Login</h1>
        {/* Display error message if login fails */}
        {error && <p className="text-red-500 text-sm">{error}</p>}
        
        {/* Email input field */}
        <input
          type="email"
          placeholder="Email"
          className="w-full border p-2 rounded"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        {/* Password input field with show/hide toggle */}
        <div className="relative">
          <input
            type={showPassword ? "text" : "password"}
            placeholder="Password"
            className="w-full border p-2 rounded"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <button
            type="button"
            className="absolute right-2 top-2 text-gray-500"
            onClick={() => setShowPassword(!showPassword)}
          >
            {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
          </button>
        </div>

        {/* Login button */}
        <button
          onClick={handleLogin}
          className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
        >
          Login
        </button>

        {/* Link to forgot password page */}
        <p className="text-sm text-center">
          <Link href="/forgot-password" className="text-blue-500 hover:underline">Forgot password?</Link>
        </p>
        {/* Link to register page */}
        <p className="text-sm text-center">
          {"Don't have an account? "}
          <Link href="/register" className="text-blue-500 hover:underline">Register</Link>
        </p>
      </div>
    </main>
  );
}