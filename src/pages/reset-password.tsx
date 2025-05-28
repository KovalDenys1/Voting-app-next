import { useState } from "react";

export default function ResetPasswordRequest() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");

  const handleRequest = async () => {
    const res = await fetch("/api/auth/reset-request", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email }),
    });

    const data = await res.json();
    setMessage(data.message);
  };

  return (
    <main className="flex min-h-screen items-center justify-center">
      <div className="max-w-sm w-full p-6 border rounded shadow">
        <h1 className="text-xl font-bold text-center">Reset Password</h1>
        <input
          type="email"
          placeholder="Enter your email"
          className="w-full border p-2 rounded mt-4"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <button
          onClick={handleRequest}
          className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 mt-4"
        >
          Send Reset Link
        </button>
        {message && <p className="mt-4 text-center">{message}</p>}
      </div>
    </main>
  );
}