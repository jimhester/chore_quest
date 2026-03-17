"use client";

import { useStore } from "@/lib/hooks/useStore";

export default function ManageRewards() {
  const { getAllRewards } = useStore();
  const rewards = getAllRewards();

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-bold">Manage Rewards</h2>
      <p className="text-quest-muted text-sm">Coming soon — add, edit, and manage rewards.</p>
      <div className="space-y-2">
        {rewards.map((reward) => (
          <div
            key={reward.id}
            className={`bg-white rounded-xl p-3 shadow-sm flex items-center gap-3 ${
              !reward.is_active ? "opacity-50" : ""
            }`}
          >
            <span className="text-xl">{reward.icon}</span>
            <span className="flex-1 font-medium">{reward.name}</span>
            <span className="text-quest-green font-bold">{reward.cost} pts</span>
          </div>
        ))}
      </div>
    </div>
  );
}
