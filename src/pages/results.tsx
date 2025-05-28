import { useEffect, useState } from "react";

type Result = {
  id: string;
  name: string;
  votes: number;
};

export default function ResultsPage() {
  const [results, setResults] = useState<Result[]>([]);

  useEffect(() => {
    fetch("/api/results")
      .then((res) => res.json())
      .then((data) => setResults(data.results));
  }, []);

  return (
    <main className="p-8 max-w-xl mx-auto space-y-4">
      <h1 className="text-2xl font-bold text-center">Voting Results</h1>
      {results.map((party) => (
        <div
          key={party.id}
          className="flex justify-between border p-2 rounded"
        >
          <span>{party.name}</span>
          <span className="font-bold">{party.votes}</span>
        </div>
      ))}
    </main>
  );
}