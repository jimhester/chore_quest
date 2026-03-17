"use client";

import Link from "next/link";
import { useStore } from "@/lib/hooks/useStore";

export default function FamilyDashboard() {
  const { getProfiles } = useStore();
  const profiles = getProfiles();
  const kids = profiles.filter((p) => p.role === "kid");

  return (
    <main className="min-h-screen flex flex-col items-center justify-center p-6">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-extrabold text-quest-purple mb-2">
          ChoreQuest
        </h1>
        <p className="text-quest-muted text-lg">Who&apos;s ready to earn some points?</p>
      </div>

      <div className="flex flex-col sm:flex-row gap-6 w-full max-w-md">
        {kids.map((kid) => (
          <Link
            key={kid.id}
            href={`/${kid.name.toLowerCase()}`}
            className="flex-1 bg-white rounded-2xl shadow-md hover:shadow-lg transition-shadow p-8 text-center group"
          >
            <div className="text-5xl mb-4 group-hover:scale-110 transition-transform">
              {kid.pet_type === "cat"
                ? "🐱"
                : kid.pet_type === "dog"
                ? "🐶"
                : "🌟"}
            </div>
            <h2 className="text-2xl font-bold text-quest-text mb-1">
              {kid.name}
            </h2>
            <p className="text-quest-muted">
              {kid.current_points > 0
                ? `${kid.current_points} pts`
                : "Tap to start!"}
            </p>
          </Link>
        ))}
      </div>

      <Link
        href="/parent"
        className="mt-12 text-quest-muted hover:text-quest-purple text-sm transition-colors"
      >
        🔒 Parent Mode
      </Link>
    </main>
  );
}
