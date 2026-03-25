"use client";

import { useState } from "react";
import { useStore } from "@/lib/hooks/useStore";

export default function HistoryPage() {
  const { getAllCompletions, getAllRedemptions, getProfileById, getAllChores, getAllRewards, deleteCompletion } =
    useStore();
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);

  const completions = getAllCompletions();
  const redemptions = getAllRedemptions();
  const chores = getAllChores();
  const rewards = getAllRewards();

  // Build a unified timeline sorted by date descending
  type TimelineItem =
    | { type: "completion"; id: string; profileId: string; name: string; points: number; date: string; icon: string }
    | { type: "redemption"; id: string; profileId: string; name: string; points: number; date: string; icon: string };

  const timeline: TimelineItem[] = [
    ...completions.map((c) => {
      const chore = chores.find((ch) => ch.id === c.chore_id);
      return {
        type: "completion" as const,
        id: c.id,
        profileId: c.profile_id,
        name: chore?.name || "Unknown chore",
        points: c.points_earned,
        date: c.completed_at,
        icon: chore?.icon || "✅",
      };
    }),
    ...redemptions.map((r) => {
      const reward = rewards.find((rw) => rw.id === r.reward_id);
      return {
        type: "redemption" as const,
        id: r.id,
        profileId: r.profile_id,
        name: reward?.name || "Unknown reward",
        points: r.points_spent,
        date: r.redeemed_at,
        icon: reward?.icon || "🎁",
      };
    }),
  ].sort((a, b) => b.date.localeCompare(a.date));

  const handleDelete = (completionId: string) => {
    deleteCompletion(completionId);
    setConfirmDeleteId(null);
  };

  // Group by date
  const groupedByDate = new Map<string, TimelineItem[]>();
  timeline.forEach((item) => {
    const dateKey = item.date.substring(0, 10);
    const existing = groupedByDate.get(dateKey) || [];
    existing.push(item);
    groupedByDate.set(dateKey, existing);
  });

  const formatDate = (dateStr: string) => {
    const d = new Date(dateStr + "T12:00:00");
    const today = new Date().toISOString().substring(0, 10);
    const yesterday = new Date(Date.now() - 86400000).toISOString().substring(0, 10);
    if (dateStr === today) return "Today";
    if (dateStr === yesterday) return "Yesterday";
    return d.toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" });
  };

  const formatTime = (isoString: string) => {
    return new Date(isoString).toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
    });
  };

  if (timeline.length === 0) {
    return (
      <div className="space-y-4">
        <h2 className="text-xl font-bold">Activity History</h2>
        <p className="text-quest-muted text-sm">No activity yet. Completions and redemptions will appear here.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-bold">Activity History</h2>
      <p className="text-quest-muted text-sm">
        Tap the × on any chore completion to remove it and refund coins.
      </p>

      {Array.from(groupedByDate.entries()).map(([dateKey, items]) => (
        <div key={dateKey}>
          <h3 className="text-sm font-bold text-quest-muted mb-2">{formatDate(dateKey)}</h3>
          <div className="space-y-2">
            {items.map((item) => {
              const profile = getProfileById(item.profileId);
              const isConfirming = confirmDeleteId === item.id;

              return (
                <div
                  key={item.id}
                  className="bg-white rounded-xl p-3 shadow-sm flex items-center gap-3"
                >
                  <span className="text-xl">{item.icon}</span>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-sm">{item.name}</p>
                    <p className="text-xs text-quest-muted">
                      {profile?.name || "Unknown"} · {formatTime(item.date)}
                    </p>
                  </div>
                  <span
                    className={`text-sm font-bold ${
                      item.type === "completion" ? "text-quest-green" : "text-quest-red"
                    }`}
                  >
                    {item.type === "completion" ? "+" : "-"}{item.points}
                  </span>

                  {/* Delete button for completions only */}
                  {item.type === "completion" && (
                    isConfirming ? (
                      <div className="flex gap-1">
                        <button
                          onClick={() => handleDelete(item.id)}
                          className="text-xs bg-quest-red text-white px-2 py-1 rounded-lg font-bold"
                        >
                          Remove
                        </button>
                        <button
                          onClick={() => setConfirmDeleteId(null)}
                          className="text-xs bg-gray-100 text-quest-muted px-2 py-1 rounded-lg"
                        >
                          Cancel
                        </button>
                      </div>
                    ) : (
                      <button
                        onClick={() => setConfirmDeleteId(item.id)}
                        className="text-quest-muted hover:text-quest-red text-lg leading-none px-1"
                        title="Remove completion"
                      >
                        ×
                      </button>
                    )
                  )}
                </div>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
}
