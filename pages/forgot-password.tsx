import { useState } from "react";
import Link from "next/link";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  // Handle form submission for password reset
  const handleSubmit = async () => {
    const res = await fetch("/api/auth/forgot-password", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email }),
    });

    const data = await res.json();

    if (res.ok) {
      setMessage("Password reset link has been sent to your email.");
      setError("");
    } else {
      setError(data.message || "Something went wrong.");
      setMessage("");
    }
  };

  return (
    <main className="flex min-h-screen items-center justify-center">
      <div className="w-full max-w-sm space-y-4 p-6 border rounded shadow bg-white">
        <h1 className="text-xl font-bold text-center">Forgot Password</h1>

        {/* Success and error messages */}
        {message && <p className="text-green-600 text-sm">{message}</p>}
        {error && <p className="text-red-500 text-sm">{error}</p>}

        {/* Email input field */}
        <input
          type="email"
          placeholder="Enter your email"
          className="w-full border p-2 rounded"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        {/* Submit button */}
        <button
          onClick={handleSubmit}
          className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
        >
          Send reset link
        </button>

        {/* Link to login page */}
        <p className="text-sm text-center">
          <Link href="/login" className="text-blue-500 hover:underline">
            Back to login
          </Link>
        </p>
      </div>
    </main>
  );
}