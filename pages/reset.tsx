import { useRouter } from "next/router";
import { useEffect, useState } from "react";

export default function ResetConfirmPage() {
  const router = useRouter();
  const [newPassword, setNewPassword] = useState("");
  const [message, setMessage] = useState("");
  const [token, setToken] = useState("");

  // Extract token from query parameters
  useEffect(() => {
    const t = router.query.token;
    if (typeof t === "string") setToken(t);
  }, [router.query.token]);

  // Handle password reset form submission
  const handleReset = async () => {
    const res = await fetch("/api/auth/reset-confirm", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ token, newPassword }),
    });

    const data = await res.json();
    setMessage(data.message);

    // Redirect to login page after successful reset
    if (res.ok) {
      setTimeout(() => router.push("/login"), 3000);
    }
  };

  return (
    <main className="flex min-h-screen items-center justify-center">
      <div className="max-w-sm w-full p-6 border rounded shadow text-center">
        <h1 className="text-xl font-bold mb-4">Set New Password</h1>
        {/* New password input field */}
        <input
          type="password"
          placeholder="New password"
          className="w-full border p-2 rounded"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
        />
        {/* Reset password button */}
        <button
          onClick={handleReset}
          className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 mt-4"
        >
          Reset Password
        </button>
        {/* Display message after reset attempt */}
        {message && <p className="mt-4">{message}</p>}
      </div>
    </main>
  );
}