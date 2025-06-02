import { useEffect, useState } from "react";
import Layout from "@/components/Layout";

type Result = {
  party: {
    name: string;
  };
  count: number;
};

export default function ResultsPage() {
  const [results, setResults] = useState<Result[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/results")
      .then((res) => res.json())
      .then((data) => {
        setResults(data.results);
        setLoading(false);
      });
  }, []);

  return (
    <Layout>
      <div className="max-w-xl mx-auto bg-white p-6 rounded shadow space-y-4">
        <h1 className="text-2xl font-bold text-center">Voting Results</h1>

        {loading ? (
          <p className="text-center">Loading results...</p>
        ) : results.length === 0 ? (
          <p className="text-center text-gray-500">No votes yet.</p>
        ) : (
          <ul className="space-y-2">
            {results.map((r, i) => (
              <li key={i} className="flex justify-between">
                <span>{r.party.name}</span>
                <span className="font-semibold">{r.count} votes</span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </Layout>
  );
}
