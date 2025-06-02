import Link from "next/link";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-gray-100 text-gray-900 flex flex-col">
      <nav className="bg-white shadow p-4 flex justify-between items-center">
        <h1 className="font-bold text-lg">🇳🇴 Voting App</h1>
        <div className="space-x-4 text-sm">
          <Link href="/vote" className="hover:underline">Vote</Link>
          <Link href="/results" className="hover:underline">Results</Link>
          <Link href="/logout" className="hover:underline text-red-600">Logout</Link>
        </div>
      </nav>
      <main className="flex-grow p-4">{children}</main>
      <footer className="text-center text-sm text-gray-500 p-4 bg-white border-t">
        &copy; {new Date().getFullYear()} Voting App. All rights reserved.
      </footer>
    </div>
  );
}
