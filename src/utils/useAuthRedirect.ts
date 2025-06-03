import { useEffect } from "react";
import { useRouter } from "next/router";

// Custom hook to redirect unauthenticated users to the login page
export default function useAuthRedirect() {
  const router = useRouter();

  useEffect(() => {
    // Check for token in localStorage
    const token = localStorage.getItem("token");
    // If no token, redirect to login page
    if (!token) {
      router.replace("/login");
    }
  }, [router]);
}