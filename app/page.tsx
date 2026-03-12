"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

export default function Home() {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check auth status
    setLoading(false);
  }, []);

  if (loading) return <div className="flex items-center justify-center min-h-screen">Loading...</div>;

  return (
    <main className="min-h-screen bg-white">
      {/* Nav */}
      <nav className="border-b border-[#e8e8e6] py-4 px-4 md:px-8">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <h1 className="text-2xl font-bold text-[#1d7c2f]">GolfTracker</h1>
          <div className="flex gap-4">
            {user ? (
              <>
                <Link href="/dashboard" className="text-sm font-medium text-[#6b6b6b] hover:text-[#1d7c2f]">
                  Dashboard
                </Link>
                <button className="text-sm font-medium text-[#6b6b6b] hover:text-[#1d7c2f]">
                  Sign out
                </button>
              </>
            ) : (
              <>
                <Link href="/login" className="text-sm font-medium text-[#6b6b6b] hover:text-[#1d7c2f]">
                  Log in
                </Link>
                <Link href="/signup" className="px-4 py-2 bg-[#1d7c2f] text-white text-sm rounded hover:bg-[#2d9e3f]">
                  Sign up
                </Link>
              </>
            )}
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="min-h-screen flex flex-col justify-center items-center px-4 text-center">
        <h2 className="text-5xl md:text-7xl font-bold text-[#1d7c2f] mb-6">
          Track Your<br />Golf Game
        </h2>
        <p className="text-lg text-[#6b6b6b] max-w-xl mb-12">
          Real-time scorecard. Distance to hole. Round stats. Everything you need on the course.
        </p>
        <div className="flex gap-4">
          <Link
            href="/signup"
            className="px-8 py-4 bg-[#1d7c2f] text-white font-semibold rounded hover:bg-[#2d9e3f]"
          >
            Get Started
          </Link>
          <Link
            href="#features"
            className="px-8 py-4 border-2 border-[#1d7c2f] text-[#1d7c2f] font-semibold rounded hover:bg-[#f9f9f7]"
          >
            Learn More
          </Link>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="py-24 px-4 bg-[#f9f9f7]">
        <div className="max-w-7xl mx-auto">
          <h3 className="text-4xl font-bold text-[#1d7c2f] mb-16 text-center">Features</h3>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              { title: "Live Scorecard", desc: "Enter scores hole-by-hole in real time" },
              { title: "GPS Distance", desc: "See distance to the pin on every shot" },
              { title: "Instant Stats", desc: "Track GIR, putts, fairways, and more" },
            ].map((f) => (
              <div key={f.title} className="p-8 bg-white rounded border border-[#e8e8e6]">
                <h4 className="text-xl font-bold text-[#1d7c2f] mb-3">{f.title}</h4>
                <p className="text-[#6b6b6b]">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
