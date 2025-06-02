import { useState } from "react";
import { useRouter } from "next/router";
import jwt from "jsonwebtoken";
import { GetServerSideProps } from "next";
import { Eye, EyeOff } from "lucide-react";

type Props = {
  email: string;
  token: string;
};

export const getServerSideProps: GetServerSideProps = async (context) => {
  const token = context.query.token as string;

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as { email: string };
    return { props: { email: decoded.email, token } };
  } catch (err) {
    return {
      redirect: {
        destination: "/forgot-password",
        permanent: false,
      },
    };
  }
};

export default function ResetPasswordPage({ email, token }: Props) {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const handleReset = async () => {
    setError("");
    setSuccess("");

    if (password !== confirm) {
      setError("Passwords do not match");
      return;
    }

    const res = await fetch("/api/auth/reset-password", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ token, password }),
    });

    const data = await res.json();
    if (res.ok) {
      setSuccess(data.message);
      setTimeout(() => router.push("/login"), 3000);
    } else {
      setError(data.message || "Something went wrong");
    }
  };

  return (
    <main className="flex min-h-screen items-center justify-center bg-gray-50 px-4">
      <div className="w-full max-w-md bg-white p-6 rounded shadow space-y-4">
        <h1 className="text-xl font-bold text-center">Reset Password</h1>
        <p className="text-center text-sm text-gray-600">Account: <strong>{email}</strong></p>

        {error && <p className="text-red-500 text-sm">{error}</p>}
        {success && <p className="text-green-600 text-sm">{success}</p>}

        <div className="relative">
          <input
            type={showPassword ? "text" : "password"}
            placeholder="New password"
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

        <div className="relative">
          <input
            type={showConfirm ? "text" : "password"}
            placeholder="Confirm password"
            className="w-full border p-2 rounded"
            value={confirm}
            onChange={(e) => setConfirm(e.target.value)}
          />
          <button
            type="button"
            className="absolute right-2 top-2 text-gray-500"
            onClick={() => setShowConfirm(!showConfirm)}
          >
            {showConfirm ? <EyeOff size={20} /> : <Eye size={20} />}
          </button>
        </div>

        <button
          onClick={handleReset}
          className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
        >
          Change Password
        </button>
      </div>
    </main>
  );
}