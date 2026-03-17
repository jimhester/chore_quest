"use client";

import { useParams } from "next/navigation";
import { useStore } from "@/lib/hooks/useStore";

export default function RewardsPage() {
  const params = useParams<{ name: string }>();
  const { getProfileByName, getRewards } = useStore();
  const profile = getProfileByName(params.name);

  if (!profile) return null;

  const rewards = getRewards(profile.id);

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-bold">Rewards Store</h2>
      <p className="text-quest-muted text-sm">
        Spend your points on awesome rewards!
      </p>
      <div className="space-y-3">
        {rewards.map((reward) => {
          const canAfford = profile.current_points >= reward.cost;
          return (
            <div
              key={reward.id}
              className={`bg-white rounded-xl p-4 shadow-sm flex items-center gap-3 ${
                !canAfford ? "opacity-50" : ""
              }`}
            >
              <span className="text-2xl">{reward.icon}</span>
              <div className="flex-1">
                <p className="font-semibold">{reward.name}</p>
              </div>
              <span
                className={`font-bold ${
                  canAfford ? "text-quest-green" : "text-quest-muted"
                }`}
              >
                {reward.cost} pts
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
