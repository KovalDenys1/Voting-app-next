import "@/styles/globals.css";
import type { AppProps } from "next/app";

// Main App component that wraps all pages
export default function App({ Component, pageProps }: AppProps) {
  // Render the current page component with its props
  return <Component {...pageProps} />;
}