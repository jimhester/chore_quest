"use client";

import Link from "next/link";
import { useStore } from "@/lib/hooks/useStore";
import { getPetStage, getPetEmoji, getPetStageName, calculatePetMood, getPetMoodEmoji } from "@/lib/utils/pet";
import { getToday } from "@/lib/utils/dates";

export default function FamilyDashboard() {
  const { getProfiles, getCompletionsForDate, getChores, recalculateStreak } = useStore();
  const profiles = getProfiles();
  const kids = profiles.filter((p) => p.role === "kid");
  const today = getToday();
  const chores = getChores();

  // Recalculate streaks on load
  kids.forEach((kid) => recalculateStreak(kid.id));

  // Reload profiles after streak recalculation
  const updatedKids = getProfiles().filter((p) => p.role === "kid");

  // Today's activity per kid
  const kidActivity = updatedKids.map((kid) => {
    const completions = getCompletionsForDate(kid.id, today);
    const points = completions.reduce((sum, c) => sum + c.points_earned, 0);
    const choreNames = completions.map((c) => {
      const chore = chores.find((ch) => ch.id === c.chore_id);
      return chore?.name || "Unknown";
    });
    return { kid, completions, points, choreNames };
  });

  // Family streak: min streak across all kids
  const familyStreak = updatedKids.length > 0
    ? Math.min(...updatedKids.map((k) => k.current_streak))
    : 0;

  // Weekly points (sum of last 7 days)
  const weeklyPoints = updatedKids.map((kid) => {
    let total = 0;
    for (let i = 0; i < 7; i++) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const dateStr = d.toLocaleDateString("en-CA", { timeZone: "America/New_York" });
      const completions = getCompletionsForDate(kid.id, dateStr);
      total += completions.reduce((sum, c) => sum + c.points_earned, 0);
    }
    return { kid, total };
  });

  return (
    <main className="min-h-screen p-6 max-w-lg mx-auto">
      {/* Header */}
      <div className="text-center mb-6">
        <h1 className="text-3xl font-extrabold text-quest-purple">
          ChoreQuest
        </h1>
        <p className="text-quest-muted">Who&apos;s ready to earn some coins?</p>
      </div>

      {/* Pets side by side */}
      <div className="flex gap-4 mb-6">
        {updatedKids.map((kid) => {
          const hasPet = kid.pet_type !== null;
          const stage = getPetStage(kid.lifetime_points);
          const todayCount = getCompletionsForDate(kid.id, today).length;
          const mood = calculatePetMood(todayCount, kid.current_streak, todayCount > 0 ? 0 : null);

          return (
            <Link
              key={kid.id}
              href={`/${kid.name.toLowerCase()}`}
              className="flex-1 bg-white rounded-2xl shadow-md hover:shadow-lg transition-shadow p-5 text-center group"
            >
              <div className="text-5xl mb-2 group-hover:scale-110 transition-transform">
                {hasPet ? getPetEmoji(kid.pet_type!, stage) : "🥚"}
              </div>
              {hasPet && (
                <p className="text-sm">
                  {getPetMoodEmoji(mood)} {kid.pet_name}
                </p>
              )}
              <h2 className="text-xl font-bold text-quest-text mt-1">
                {kid.name}
              </h2>
              <p className="text-sm text-quest-muted">
                {hasPet ? `${getPetStageName(stage)} · Lv.${stage}` : "Tap to start!"}
              </p>
              <div className="flex justify-center gap-3 mt-2 text-xs">
                <span className="text-quest-orange font-bold">🪙 {kid.current_points}</span>
                {kid.current_streak > 0 && (
                  <span className="text-quest-red font-bold">🔥 {kid.current_streak}</span>
                )}
              </div>
            </Link>
          );
        })}
      </div>

      {/* Family streak */}
      {familyStreak > 0 && (
        <div className="bg-gradient-to-r from-quest-orange to-quest-red text-white rounded-2xl p-4 text-center mb-6">
          <p className="text-sm font-semibold opacity-90">Family Streak</p>
          <p className="text-3xl font-extrabold">🔥 {familyStreak} days</p>
          <p className="text-xs opacity-80 mt-1">Everyone&apos;s been doing chores!</p>
        </div>
      )}

      {/* Today's activity */}
      <div className="bg-white rounded-2xl shadow-sm p-4 mb-6">
        <h2 className="font-bold text-lg mb-3">Today&apos;s Activity</h2>
        {kidActivity.every((a) => a.completions.length === 0) ? (
          <p className="text-quest-muted text-sm">No chores done yet today. Let&apos;s go!</p>
        ) : (
          <div className="space-y-3">
            {kidActivity.map(({ kid, completions, points, choreNames }) => (
              <div key={kid.id} className="flex items-start gap-3">
                <div className="text-2xl">
                  {kid.pet_type === "cat" ? "🐱" : kid.pet_type === "dog" ? "🐶" : "🌟"}
                </div>
                <div className="flex-1">
                  <p className="font-semibold text-sm">{kid.name}</p>
                  {completions.length > 0 ? (
                    <p className="text-xs text-quest-muted">
                      {completions.length} chore{completions.length !== 1 ? "s" : ""} · {points} coins
                    </p>
                  ) : (
                    <p className="text-xs text-quest-muted">Nothing yet</p>
                  )}
                </div>
                {completions.length > 0 && (
                  <span className="text-quest-green font-bold text-sm">✓</span>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Weekly leaderboard */}
      <div className="bg-white rounded-2xl shadow-sm p-4 mb-6">
        <h2 className="font-bold text-lg mb-3">This Week</h2>
        <div className="space-y-2">
          {weeklyPoints
            .sort((a, b) => b.total - a.total)
            .map(({ kid, total }, idx) => (
              <div key={kid.id} className="flex items-center gap-3">
                <span className="text-lg">
                  {idx === 0 && total > 0 ? "🥇" : idx === 1 && total > 0 ? "🥈" : ""}
                </span>
                <span className="flex-1 font-semibold">{kid.name}</span>
                <span className="text-quest-orange font-bold">{total} coins</span>
              </div>
            ))}
        </div>
      </div>

      {/* Parent mode link */}
      <div className="text-center">
        <Link
          href="/parent"
          className="text-quest-muted hover:text-quest-purple text-sm transition-colors"
        >
          🔒 Parent Mode
        </Link>
      </div>
    </main>
  );
}
