"use client";

import { useState, useCallback, useRef, useEffect } from "react";
import { useParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { useStore } from "@/lib/hooks/useStore";
import { getToday } from "@/lib/utils/dates";
import { triggerPointsFloat } from "@/components/shared/PointsAnimation";
import { triggerConfetti } from "@/components/shared/Confetti";

interface UndoState {
  completionId: string;
  choreName: string;
  points: number;
}

export default function ChoresPage() {
  const params = useParams<{ name: string }>();
  const { getProfileByName, getChores, getCompletionsForDate, completeChore, deleteCompletion } =
    useStore();
  const profile = getProfileByName(params.name);
  const [justCompleted, setJustCompleted] = useState<string | null>(null);
  const [undoState, setUndoState] = useState<UndoState | null>(null);
  const undoTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Clean up undo timer on unmount
  useEffect(() => {
    return () => {
      if (undoTimerRef.current) clearTimeout(undoTimerRef.current);
    };
  }, []);

  const handleComplete = useCallback(
    (choreId: string, choreName: string, points: number, event: React.MouseEvent) => {
      if (!profile) return;

      const rect = (event.currentTarget as HTMLElement).getBoundingClientRect();
      const x = rect.right - 40;
      const y = rect.top + rect.height / 2;

      const completion = completeChore(profile.id, choreId, points);
      triggerPointsFloat(points, x, y);

      setJustCompleted(choreId);
      setTimeout(() => setJustCompleted(null), 600);

      // Set up undo toast
      if (undoTimerRef.current) clearTimeout(undoTimerRef.current);
      setUndoState({ completionId: completion.id, choreName, points });
      undoTimerRef.current = setTimeout(() => setUndoState(null), 5000);

      // Confetti on every 5th completion
      const today = getToday();
      const newCount = getCompletionsForDate(profile.id, today).length;
      if (newCount % 5 === 0) {
        triggerConfetti();
      }
    },
    [profile, completeChore, deleteCompletion, getCompletionsForDate]
  );

  const handleUndo = useCallback(() => {
    if (!undoState) return;
    deleteCompletion(undoState.completionId);
    if (undoTimerRef.current) clearTimeout(undoTimerRef.current);
    setUndoState(null);
  }, [undoState, deleteCompletion]);

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
                    handleComplete(chore.id, chore.name, chore.points, e);
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

      {/* Undo toast */}
      <AnimatePresence>
        {undoState && (
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
            className="fixed bottom-24 left-4 right-4 max-w-lg mx-auto z-40"
          >
            <div className="bg-gray-800 text-white rounded-xl px-4 py-3 flex items-center justify-between shadow-lg">
              <span className="text-sm">
                Completed <strong>{undoState.choreName}</strong> (+{undoState.points})
              </span>
              <button
                onClick={handleUndo}
                className="ml-3 text-quest-orange font-bold text-sm shrink-0"
              >
                Undo
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
