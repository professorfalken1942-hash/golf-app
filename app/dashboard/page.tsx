"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { supabase } from "@/lib/supabase";

interface Round {
  id: string;
  course_name: string;
  date: string;
  total_strokes: number;
  status: string;
}

export default function Dashboard() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [rounds, setRounds] = useState<Round[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const init = async () => {
      try {
        const { data } = await supabase.auth.getSession();
        if (!data.session) {
          router.push("/login");
          return;
        }
        setUser(data.session.user);

        const { data: roundsData } = await supabase
          .from("rounds")
          .select("id, course_name, date, total_strokes, status")
          .eq("user_id", data.session.user.id)
          .order("date", { ascending: false });

        if (roundsData) setRounds(roundsData);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    init();
  }, [router]);

  const startNewRound = () => {
    router.push("/new-round");
  };

  if (loading) return <div className="flex items-center justify-center min-h-screen">Loading...</div>;

  return (
    <main className="min-h-screen bg-white">
      <nav className="border-b border-[#e8e8e6] py-4 px-4 md:px-8">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <Link href="/" className="text-2xl font-bold text-[#1d7c2f]">
            GolfTracker
          </Link>
          <button
            onClick={async () => {
              await supabase.auth.signOut();
              router.push("/");
            }}
            className="text-sm font-medium text-[#6b6b6b] hover:text-[#1d7c2f]"
          >
            Sign out
          </button>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 md:px-8 py-12">
        <div className="flex items-center justify-between mb-12">
          <div>
            <h1 className="text-4xl font-bold text-[#1d7c2f] mb-2">Welcome back</h1>
            <p className="text-[#6b6b6b]">{user?.email}</p>
          </div>
          <button
            onClick={startNewRound}
            className="px-6 py-3 bg-[#1d7c2f] text-white font-semibold rounded hover:bg-[#2d9e3f]"
          >
            + New Round
          </button>
        </div>

        <div className="bg-[#f9f9f7] rounded border border-[#e8e8e6] overflow-hidden">
          <div className="px-6 py-4 border-b border-[#e8e8e6]">
            <h2 className="text-lg font-bold text-[#1d7c2f]">Recent Rounds</h2>
          </div>
          {rounds.length === 0 ? (
            <div className="px-6 py-12 text-center text-[#6b6b6b]">
              <p>No rounds yet. Start tracking your game!</p>
            </div>
          ) : (
            <div className="divide-y divide-[#e8e8e6]">
              {rounds.map((round) => (
                <Link
                  key={round.id}
                  href={`/round/${round.id}`}
                  className="px-6 py-4 flex items-center justify-between hover:bg-white transition-colors"
                >
                  <div>
                    <p className="font-semibold text-[#1d7c2f]">{round.course_name}</p>
                    <p className="text-sm text-[#6b6b6b]">{round.date}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-bold text-[#1d7c2f]">{round.total_strokes}</p>
                    <p className="text-xs text-[#6b6b6b] uppercase">{round.status}</p>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
