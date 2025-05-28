import { useRouter } from "next/router";
import { useEffect, useState } from "react";

export default function VerifyPage() {
  const router = useRouter();
  const [message, setMessage] = useState("Verifying...");

  useEffect(() => {
    const token = router.query.token;
    if (!token || typeof token !== "string") return;

    fetch(`/api/auth/verify?token=${token}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.message === "Email confirmed") {
          setMessage("Email confirmed successfully! You can now log in.");
          setTimeout(() => router.push("/login"), 3000);
        } else {
          setMessage(data.message);
        }
      });
  }, [router.query.token]);

  return (
    <main className="flex min-h-screen items-center justify-center">
      <div className="p-6 border rounded shadow text-center">
        <h1 className="text-xl font-bold">Email Verification</h1>
        <p className="mt-4">{message}</p>
      </div>
    </main>
  );
}