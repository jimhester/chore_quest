"use client";

import { useState, useCallback } from "react";
import { useParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { useStore } from "@/lib/hooks/useStore";
import { getToday } from "@/lib/utils/dates";
import { triggerPointsFloat } from "@/components/shared/PointsAnimation";
import { triggerConfetti } from "@/components/shared/Confetti";

export default function ChoresPage() {
  const params = useParams<{ name: string }>();
  const { getProfileByName, getChores, getCompletionsForDate, completeChore } =
    useStore();
  const profile = getProfileByName(params.name);
  const [justCompleted, setJustCompleted] = useState<string | null>(null);

  const handleComplete = useCallback(
    (choreId: string, points: number, event: React.MouseEvent) => {
      if (!profile) return;

      const rect = (event.currentTarget as HTMLElement).getBoundingClientRect();
      const x = rect.right - 40;
      const y = rect.top + rect.height / 2;

      completeChore(profile.id, choreId, points);
      triggerPointsFloat(points, x, y);

      setJustCompleted(choreId);
      setTimeout(() => setJustCompleted(null), 600);

      // Confetti on every 5th completion
      const today = getToday();
      const newCount = getCompletionsForDate(profile.id, today).length;
      if (newCount % 5 === 0) {
        triggerConfetti();
      }
    },
    [profile, completeChore, getCompletionsForDate]
  );

  if (!profile) return null;

  const chores = getChores();
  const today = getToday();
  const todayCompletions = getCompletionsForDate(profile.id, today);
  const completedChoreIds = new Set(todayCompletions.map((c) => c.chore_id));

  // For "daily" chores, count how many times completed today
  const completionCounts = new Map<string, number>();
  todayCompletions.forEach((c) => {
    completionCounts.set(c.chore_id, (completionCounts.get(c.chore_id) || 0) + 1);
  });

  const todayPoints = todayCompletions.reduce(
    (sum, c) => sum + c.points_earned,
    0
  );

  return (
    <div className="space-y-4">
      {/* Today's summary bar */}
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold">Today&apos;s Chores</h2>
        <div className="text-sm font-semibold text-quest-muted">
          {todayCompletions.length} done · {todayPoints} pts
        </div>
      </div>
      <p className="text-quest-muted text-sm">
        Tap a chore to mark it done and earn points!
      </p>

      <div className="space-y-3">
        <AnimatePresence>
          {chores.map((chore) => {
            // Daily chores can only be done once per day
            const isDailyDone =
              chore.frequency === "daily" && completedChoreIds.has(chore.id);
            const isJustDone = justCompleted === chore.id;
            const timesCompleted = completionCounts.get(chore.id) || 0;

            return (
              <motion.button
                key={chore.id}
                layout
                onClick={(e) => {
                  if (!isDailyDone) {
                    handleComplete(chore.id, chore.points, e);
                  }
                }}
                disabled={isDailyDone}
                whileTap={isDailyDone ? undefined : { scale: 0.97 }}
                className={`w-full bg-white rounded-xl p-4 shadow-sm flex items-center gap-3 text-left transition-all ${
                  isDailyDone
                    ? "opacity-50"
                    : "active:bg-gray-50 cursor-pointer"
                }`}
              >
                {/* Icon with completion animation */}
                <div className="relative">
                  <span className="text-2xl">{chore.icon}</span>
                  <AnimatePresence>
                    {isJustDone && (
                      <motion.div
                        initial={{ scale: 0, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 0, opacity: 0 }}
                        className="absolute -top-1 -right-1 w-5 h-5 bg-quest-green rounded-full flex items-center justify-center"
                      >
                        <span className="text-white text-xs">✓</span>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                <div className="flex-1 min-w-0">
                  <p
                    className={`font-semibold ${isDailyDone ? "line-through text-quest-muted" : ""}`}
                  >
                    {chore.name}
                  </p>
                  <p className="text-xs text-quest-muted capitalize">
                    {chore.frequency.replace("_", " ")}
                    {timesCompleted > 0 && !isDailyDone && (
                      <span className="ml-1 text-quest-green">
                        · done {timesCompleted}x today
                      </span>
                    )}
                  </p>
                </div>

                <span
                  className={`font-bold whitespace-nowrap ${isDailyDone ? "text-quest-muted" : "text-quest-orange"}`}
                >
                  +{chore.points}
                </span>

                {isDailyDone && (
                  <span className="text-quest-green text-lg">✓</span>
                )}
              </motion.button>
            );
          })}
        </AnimatePresence>
      </div>
    </div>
  );
}
