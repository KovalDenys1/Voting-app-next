import useAuthRedirect from "@/utils/useAuthRedirect";
import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import Layout from "@/components/Layout";

type Party = {
  id: string;
  name: string;
  votes?: number;
};

export default function VotePage() {
  useAuthRedirect();
  const router = useRouter();

  // Redirect to login if token is missing
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/login");
    }
  }, [router]);

  const [parties, setParties] = useState<Party[]>([]);
  const [message, setMessage] = useState("");
  const [votedPartyId, setVotedPartyId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  // Fetch all parties from the API
  useEffect(() => {
    fetch("/api/parties")
      .then((res) => res.json())
      .then((data) => setParties(data.parties));
  }, []);

  // Handle voting for a party
  const handleVote = async (partyId: string) => {
    setLoading(true);
    const res = await fetch("/api/vote", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ partyId }),
    });

    const data = await res.json();
    setLoading(false);

    if (res.ok) {
      setMessage(data.message);
      setVotedPartyId(partyId);
    } else {
      setMessage(data.message || "Voting failed");
    }
  };

  return (
    <Layout>
      <div className="max-w-xl mx-auto bg-white p-6 rounded shadow space-y-4 mt-10">
        <h1 className="text-2xl font-bold text-center text-gray-800">Vote for a Political Party</h1>

        {/* Show loading message if parties are not loaded */}
        {parties.length === 0 && <p className="text-center text-gray-500">Loading parties...</p>}

        {/* Render party buttons */}
        {parties.map((party) => (
          <button
            key={party.id}
            onClick={() => handleVote(party.id)}
            className={`w-full text-left py-2 px-4 rounded transition font-medium
              ${votedPartyId === party.id ? "bg-green-600 text-white" : "bg-blue-600 text-white hover:bg-blue-700"}
              ${votedPartyId ? "opacity-60 cursor-not-allowed" : ""}
            `}
            disabled={!!votedPartyId || loading}
          >
            {party.name}
          </button>
        ))}

        {/* Show message after voting */}
        {message && (
          <div className="text-center text-green-600 font-medium mt-4">{message}</div>
        )}
      </div>
    </Layout>
  );
}