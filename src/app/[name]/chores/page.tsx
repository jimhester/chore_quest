"use client";

import { useParams } from "next/navigation";
import { useStore } from "@/lib/hooks/useStore";
import { getToday } from "@/lib/utils/dates";

export default function ChoresPage() {
  const params = useParams<{ name: string }>();
  const { getProfileByName, getChores, getCompletionsForDate } = useStore();
  const profile = getProfileByName(params.name);

  if (!profile) return null;

  const chores = getChores();
  const today = getToday();
  const todayCompletions = getCompletionsForDate(profile.id, today);
  const completedChoreIds = new Set(todayCompletions.map((c) => c.chore_id));

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-bold">Today&apos;s Chores</h2>
      <p className="text-quest-muted text-sm">
        Tap a chore to mark it done and earn points!
      </p>
      <div className="space-y-3">
        {chores.map((chore) => {
          const isDone = completedChoreIds.has(chore.id);
          return (
            <div
              key={chore.id}
              className={`bg-white rounded-xl p-4 shadow-sm flex items-center gap-3 ${
                isDone ? "opacity-60" : ""
              }`}
            >
              <span className="text-2xl">{chore.icon}</span>
              <div className="flex-1">
                <p className={`font-semibold ${isDone ? "line-through" : ""}`}>
                  {chore.name}
                </p>
                <p className="text-xs text-quest-muted capitalize">
                  {chore.frequency.replace("_", " ")}
                </p>
              </div>
              <span className="text-quest-orange font-bold">
                +{chore.points}
              </span>
              {isDone && <span className="text-quest-green text-lg">✓</span>}
            </div>
          );
        })}
      </div>
    </div>
  );
}
