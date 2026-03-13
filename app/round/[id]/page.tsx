"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";

interface Round {
  id: string;
  course_name: string;
  date: string;
  scores: number[];
  total_strokes: number;
  total_putts: number;
  status: string;
}

export default function RoundPage() {
  const params = useParams();
  const router = useRouter();
  const roundId = params.id as string;
  const [round, setRound] = useState<Round | null>(null);
  const [scores, setScores] = useState<number[]>(Array(18).fill(0));
  const [currentHole, setCurrentHole] = useState(1);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRound = async () => {
      const { data, error } = await supabase
        .from("rounds")
        .select("*")
        .eq("id", roundId)
        .single();

      if (!error && data) {
        setRound(data);
        setScores(data.scores || Array(18).fill(0));
      }
      setLoading(false);
    };

    fetchRound();
  }, [roundId]);

  const updateScore = (hole: number, strokes: number) => {
    const newScores = [...scores];
    newScores[hole - 1] = strokes;
    setScores(newScores);

    // Auto-save to DB
    supabase
      .from("rounds")
      .update({
        scores: newScores,
        total_strokes: newScores.reduce((a, b) => a + b, 0),
      })
      .eq("id", roundId)
      .then(() => {
        if (round) {
          setRound({
            ...round,
            scores: newScores,
            total_strokes: newScores.reduce((a, b) => a + b, 0),
          });
        }
      });
  };

  const finishRound = async () => {
    await supabase.from("rounds").update({ status: "completed" }).eq("id", roundId);
    router.push("/dashboard");
  };

  if (loading) return <div className="flex items-center justify-center min-h-screen">Loading...</div>;
  if (!round) return <div className="flex items-center justify-center min-h-screen">Round not found</div>;

  const totalStrokes = scores.reduce((a, b) => a + b, 0);

  return (
    <main className="min-h-screen bg-[#f9f9f7]">
      {/* Header */}
      <div className="bg-white border-b border-[#e8e8e6] sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 md:px-8 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-[#1d7c2f]">{round.course_name}</h1>
            <p className="text-sm text-[#6b6b6b]">{round.date}</p>
          </div>
          <div className="text-right">
            <p className="text-4xl font-bold text-[#1d7c2f]">{totalStrokes}</p>
            <p className="text-xs text-[#6b6b6b]">Total Strokes</p>
          </div>
        </div>
      </div>

      {/* Scorecard */}
      <div className="max-w-7xl mx-auto px-4 md:px-8 py-8">
        <div className="grid md:grid-cols-2 gap-8">
          {/* Hole Input */}
          <div className="bg-white rounded border border-[#e8e8e6] p-8">
            <div className="text-center mb-8">
              <p className="text-6xl font-bold text-[#1d7c2f]">{currentHole}</p>
              <p className="text-[#6b6b6b]">Hole</p>
            </div>

            <div className="mb-8">
              <label className="block text-sm font-semibold text-[#1d7c2f] mb-3">Strokes</label>
              <div className="flex gap-2">
                {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map((num) => (
                  <button
                    key={num}
                    onClick={() => updateScore(currentHole, num)}
                    className={`flex-1 py-3 border rounded font-semibold transition-colors ${
                      scores[currentHole - 1] === num
                        ? "bg-[#1d7c2f] text-white border-[#1d7c2f]"
                        : "bg-white text-[#1d7c2f] border-[#e8e8e6] hover:border-[#1d7c2f]"
                    }`}
                  >
                    {num}
                  </button>
                ))}
              </div>
            </div>

            {/* Navigation */}
            <div className="flex gap-4">
              <button
                onClick={() => setCurrentHole(Math.max(1, currentHole - 1))}
                disabled={currentHole === 1}
                className="flex-1 py-3 bg-[#e8e8e6] text-[#1d7c2f] font-semibold rounded disabled:opacity-50"
              >
                ← Prev
              </button>
              <button
                onClick={() => setCurrentHole(Math.min(18, currentHole + 1))}
                disabled={currentHole === 18}
                className="flex-1 py-3 bg-[#e8e8e6] text-[#1d7c2f] font-semibold rounded disabled:opacity-50"
              >
                Next →
              </button>
            </div>
          </div>

          {/* Score Summary */}
          <div className="space-y-4">
            <div className="bg-white rounded border border-[#e8e8e6] p-6">
              <h3 className="text-lg font-bold text-[#1d7c2f] mb-4">Front 9</h3>
              <div className="grid grid-cols-9 gap-2">
                {scores.slice(0, 9).map((score, i) => (
                  <button
                    key={i}
                    onClick={() => setCurrentHole(i + 1)}
                    className={`py-2 text-sm font-semibold rounded border transition-colors ${
                      currentHole === i + 1
                        ? "bg-[#1d7c2f] text-white border-[#1d7c2f]"
                        : score === 0
                        ? "bg-[#f9f9f7] border-[#e8e8e6] text-[#6b6b6b]"
                        : "bg-white border-[#1d7c2f] text-[#1d7c2f]"
                    }`}
                  >
                    {score || "—"}
                  </button>
                ))}
              </div>
              <p className="text-right mt-3 text-sm font-semibold text-[#1d7c2f]">
                Total: {scores.slice(0, 9).reduce((a, b) => a + b, 0)}
              </p>
            </div>

            <div className="bg-white rounded border border-[#e8e8e6] p-6">
              <h3 className="text-lg font-bold text-[#1d7c2f] mb-4">Back 9</h3>
              <div className="grid grid-cols-9 gap-2">
                {scores.slice(9, 18).map((score, i) => (
                  <button
                    key={i + 9}
                    onClick={() => setCurrentHole(i + 10)}
                    className={`py-2 text-sm font-semibold rounded border transition-colors ${
                      currentHole === i + 10
                        ? "bg-[#1d7c2f] text-white border-[#1d7c2f]"
                        : score === 0
                        ? "bg-[#f9f9f7] border-[#e8e8e6] text-[#6b6b6b]"
                        : "bg-white border-[#1d7c2f] text-[#1d7c2f]"
                    }`}
                  >
                    {score || "—"}
                  </button>
                ))}
              </div>
              <p className="text-right mt-3 text-sm font-semibold text-[#1d7c2f]">
                Total: {scores.slice(9, 18).reduce((a, b) => a + b, 0)}
              </p>
            </div>

            <button
              onClick={finishRound}
              className="w-full py-4 bg-[#1d7c2f] text-white font-bold rounded hover:bg-[#2d9e3f]"
            >
              Finish Round
            </button>
          </div>
        </div>
      </div>
    </main>
  );
}
