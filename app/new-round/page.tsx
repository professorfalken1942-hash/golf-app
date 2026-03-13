"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";

interface Course {
  id: string;
  name: string;
  location: string;
  par: number;
}

export default function NewRound() {
  const router = useRouter();
  const [courses, setCourses] = useState<Course[]>([]);
  const [selectedCourse, setSelectedCourse] = useState<string>("");
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const init = async () => {
      const { data } = await supabase.auth.getSession();
      if (!data.session) {
        router.push("/login");
        return;
      }
      setUser(data.session.user);

      const { data: coursesData } = await supabase.from("courses").select("id, name, location, par");
      if (coursesData) setCourses(coursesData);
      setLoading(false);
    };

    init();
  }, [router]);

  const startRound = async () => {
    if (!selectedCourse || !user) return;

    const course = courses.find((c) => c.id === selectedCourse);
    if (!course) return;

    const { data, error } = await supabase
      .from("rounds")
      .insert([
        {
          user_id: user.id,
          course_id: selectedCourse,
          course_name: course.name,
          date: new Date().toISOString().split("T")[0],
          scores: Array(18).fill(0),
          status: "in-progress",
        },
      ])
      .select();

    if (!error && data) {
      router.push(`/round/${data[0].id}`);
    }
  };

  if (loading) return <div className="flex items-center justify-center min-h-screen">Loading...</div>;

  return (
    <main className="min-h-screen bg-white">
      <nav className="border-b border-[#e8e8e6] py-4 px-4 md:px-8">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <button
            onClick={() => router.back()}
            className="text-[#1d7c2f] font-semibold hover:text-[#2d9e3f]"
          >
            ← Back
          </button>
        </div>
      </nav>

      <div className="max-w-2xl mx-auto px-4 md:px-8 py-12">
        <h1 className="text-4xl font-bold text-[#1d7c2f] mb-8">Start a New Round</h1>

        <div className="space-y-6">
          <div>
            <label className="block text-sm font-semibold text-[#1d7c2f] mb-3">Select Course</label>
            <select
              value={selectedCourse}
              onChange={(e) => setSelectedCourse(e.target.value)}
              className="w-full px-4 py-3 border border-[#e8e8e6] rounded focus:outline-none focus:border-[#1d7c2f]"
            >
              <option value="">Choose a course...</option>
              {courses.map((course) => (
                <option key={course.id} value={course.id}>
                  {course.name} — {course.location} (Par {course.par})
                </option>
              ))}
            </select>
          </div>

          <button
            onClick={startRound}
            disabled={!selectedCourse}
            className="w-full px-6 py-4 bg-[#1d7c2f] text-white font-semibold rounded hover:bg-[#2d9e3f] disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Start Round
          </button>
        </div>
      </div>
    </main>
  );
}
