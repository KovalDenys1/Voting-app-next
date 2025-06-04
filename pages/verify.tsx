import { useRouter } from "next/router";
import { useEffect, useState } from "react";

export default function VerifyPage() {
  const router = useRouter();
  const [message, setMessage] = useState("Verifying...");
  const [status, setStatus] = useState<"pending" | "success" | "error">("pending");

  // Request verification from the API when the token is present in the query
  useEffect(() => {
    const token = router.query.token;
    if (!token || typeof token !== "string") return;

    fetch(`/api/auth/verify?token=${token}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.message === "Email confirmed") {
          setMessage("Email confirmed successfully! You can now log in.");
          setStatus("success");
        } else {
          setMessage(data.message);
          setStatus("error");
        }
      });
  }, [router.query.token]);

  // Redirect to login page after successful verification
  useEffect(() => {
    if (status === "success") {
      router.push("/login");
    }
  }, [status, router]);

  return (
    <main className="flex min-h-screen items-center justify-center">
      <div className="p-6 border rounded shadow text-center">
        <h1 className="text-xl font-bold">Email Verification</h1>
        {/* Display verification status message */}
        <p className="mt-4">{message}</p>
      </div>
    </main>
  );
}