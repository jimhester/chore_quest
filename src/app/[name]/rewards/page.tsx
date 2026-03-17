"use client";

import { useState, useCallback } from "react";
import { useParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { useStore } from "@/lib/hooks/useStore";

export default function RewardsPage() {
  const params = useParams<{ name: string }>();
  const { getProfileByName, getRewards, redeemReward } = useStore();
  const profile = getProfileByName(params.name);
  const [justRedeemed, setJustRedeemed] = useState<string | null>(null);
  const [confirmId, setConfirmId] = useState<string | null>(null);

  const handleRedeem = useCallback(
    (rewardId: string) => {
      if (!profile) return;
      const result = redeemReward(profile.id, rewardId);
      if (result) {
        setJustRedeemed(rewardId);
        setConfirmId(null);
        setTimeout(() => setJustRedeemed(null), 1500);
      }
    },
    [profile, redeemReward]
  );

  if (!profile) return null;

  const rewards = getRewards(profile.id);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold">Rewards Store</h2>
        <div className="text-sm font-semibold text-quest-orange">
          ⭐ {profile.current_points} pts available
        </div>
      </div>
      <p className="text-quest-muted text-sm">
        Spend your points on awesome rewards!
      </p>

      <div className="space-y-3">
        {rewards.map((reward) => {
          const canAfford = profile.current_points >= reward.cost;
          const isRedeeming = confirmId === reward.id;
          const wasJustRedeemed = justRedeemed === reward.id;

          return (
            <motion.div
              key={reward.id}
              layout
              className={`bg-white rounded-xl shadow-sm overflow-hidden ${
                !canAfford && !wasJustRedeemed ? "opacity-50" : ""
              }`}
            >
              <button
                onClick={() => {
                  if (wasJustRedeemed) return;
                  if (canAfford) {
                    setConfirmId(isRedeeming ? null : reward.id);
                  }
                }}
                disabled={!canAfford || wasJustRedeemed}
                className="w-full p-4 flex items-center gap-3 text-left"
              >
                <span className="text-2xl">{reward.icon}</span>
                <div className="flex-1">
                  <p className="font-semibold">{reward.name}</p>
                </div>
                <AnimatePresence mode="wait">
                  {wasJustRedeemed ? (
                    <motion.span
                      key="redeemed"
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="text-quest-green font-bold text-sm"
                    >
                      Redeemed! 🎉
                    </motion.span>
                  ) : (
                    <motion.span
                      key="cost"
                      className={`font-bold ${
                        canAfford ? "text-quest-green" : "text-quest-muted"
                      }`}
                    >
                      {reward.cost} pts
                    </motion.span>
                  )}
                </AnimatePresence>
              </button>

              {/* Confirmation slide-down */}
              <AnimatePresence>
                {isRedeeming && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="overflow-hidden"
                  >
                    <div className="px-4 pb-4 flex gap-2">
                      <button
                        onClick={() => handleRedeem(reward.id)}
                        className="flex-1 bg-quest-green text-white font-bold py-2 rounded-lg"
                      >
                        Spend {reward.cost} pts
                      </button>
                      <button
                        onClick={() => setConfirmId(null)}
                        className="px-4 py-2 bg-gray-100 text-quest-muted font-semibold rounded-lg"
                      >
                        Cancel
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
