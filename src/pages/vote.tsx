import { useEffect, useState } from "react";

type Party = {
  id: string;
  name: string;
};

export default function VotePage() {
  const [parties, setParties] = useState<Party[]>([]);
  const [message, setMessage] = useState("");

  useEffect(() => {
    fetch("/api/parties")
      .then(res => res.json())
      .then(data => setParties(data.parties));
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
    <main className="p-8 max-w-xl mx-auto space-y-4">
      <h1 className="text-2xl font-bold">Vote for a Party</h1>

      {parties.map((party) => (
        <button
          key={party.id}
          onClick={() => handleVote(party.id)}
          className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 mt-2"
        >
          Vote for {party.name}
        </button>
      ))}

<button
  onClick={async () => {
    await fetch("/api/auth/logout");
    window.location.href = "/login"; // перенаправим
  }}
  className="mt-4 w-full bg-red-500 text-white py-2 rounded hover:bg-red-600"
>
  Logout
</button>

      {message && <p className="text-green-600">{message}</p>}
    </main>
  );
}