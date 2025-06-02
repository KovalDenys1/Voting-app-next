import { useEffect, useState } from "react";
import Layout from "@/components/Layout";

type Party = {
  id: string;
  name: string;
};

export default function VotePage() {
  const [parties, setParties] = useState<Party[]>([]);
  const [message, setMessage] = useState("");

  useEffect(() => {
    fetch("/api/parties")
      .then((res) => res.json())
      .then((data) => setParties(data.parties));
  }, []);

  const handleVote = async (partyId: string) => {
    const res = await fetch("/api/vote", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ partyId }),
    });

    const data = await res.json();
    setMessage(data.message);
  };

  return (
    <Layout>
      <div className="max-w-xl mx-auto bg-white p-6 rounded shadow space-y-4">
        <h1 className="text-2xl font-bold text-center">Vote for a Political Party</h1>

        {parties.length === 0 && <p className="text-center">Loading parties...</p>}

        {parties.map((party) => (
          <button
            key={party.id}
            onClick={() => handleVote(party.id)}
            className="w-full text-left bg-blue-600 text-white font-medium py-2 px-4 rounded hover:bg-blue-700 transition"
          >
            {party.name}
          </button>
        ))}

        {message && (
          <div className="text-center text-green-600 font-medium mt-4">{message}</div>
        )}
      </div>
    </Layout>
  );
}
