import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import jwt from "jsonwebtoken";
import { Eye, EyeOff } from "lucide-react";

export default function ResetPasswordPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  // Decode token from query and extract email
  useEffect(() => {
    const { token } = router.query;
    if (typeof token === "string") {
      try {
        const decoded = jwt.decode(token) as { email?: string };
        if (decoded?.email) setEmail(decoded.email);
      } catch {
        setError("Invalid token");
      }
    }
  }, [router.query]);

  // Handle password reset form submission
  const handleSubmit = async () => {
    setError("");
    setSuccess("");

    const token = router.query.token;
    if (!token || typeof token !== "string") {
      setError("Missing token");
      return;
    }

    const res = await fetch("/api/auth/reset-password", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ token, password, confirmPassword: confirm }),
    });

    const data = await res.json();
    if (res.ok) {
      setSuccess(data.message);
      setPassword("");
      setConfirm("");
    } else {
      setError(data.message);
    }
  };

  return (
    <main className="flex items-center justify-center min-h-screen bg-gray-100 px-4">
      <div className="bg-white p-6 rounded shadow max-w-md w-full space-y-4">
        <h1 className="text-xl font-bold text-center">Reset Password</h1>
        {/* Display email if available */}
        {email && (
          <p className="text-center text-sm text-gray-600">
            Account: <span className="font-medium">{email}</span>
          </p>
        )}

        {/* Display error and success messages */}
        {error && <p className="text-red-500 text-sm text-center">{error}</p>}
        {success && <p className="text-green-600 text-sm text-center">{success}</p>}

        {/* New password input field with show/hide toggle */}
        <div className="relative">
          <input
            type={showPassword ? "text" : "password"}
            placeholder="New password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full border p-2 rounded"
          />
          <button
            type="button"
            className="absolute right-2 top-2 text-gray-500"
            onClick={() => setShowPassword((prev) => !prev)}
          >
            {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
          </button>
        </div>

        {/* Confirm password input field with show/hide toggle */}
        <div className="relative">
          <input
            type={showConfirm ? "text" : "password"}
            placeholder="Confirm password"
            value={confirm}
            onChange={(e) => setConfirm(e.target.value)}
            className="w-full border p-2 rounded"
          />
          <button
            type="button"
            className="absolute right-2 top-2 text-gray-500"
            onClick={() => setShowConfirm((prev) => !prev)}
          >
            {showConfirm ? <EyeOff size={20} /> : <Eye size={20} />}
          </button>
        </div>

        {/* Change password button */}
        <button
          onClick={handleSubmit}
          className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
        >
          Change Password
        </button>
      </div>
    </main>
  );
}