"use client";

import { useStore } from "@/lib/hooks/useStore";

export default function ParentOverview() {
  const { getProfiles } = useStore();
  const kids = getProfiles().filter((p) => p.role === "kid");

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-bold">Family Overview</h2>
      <div className="grid gap-4">
        {kids.map((kid) => (
          <div key={kid.id} className="bg-white rounded-xl p-4 shadow-sm">
            <h3 className="font-bold text-lg">{kid.name}</h3>
            <div className="grid grid-cols-3 gap-4 mt-2 text-center">
              <div>
                <p className="text-xl font-bold text-quest-orange">
                  {kid.current_points}
                </p>
                <p className="text-xs text-quest-muted">Points</p>
              </div>
              <div>
                <p className="text-xl font-bold text-quest-purple">
                  {kid.lifetime_points}
                </p>
                <p className="text-xs text-quest-muted">Lifetime</p>
              </div>
              <div>
                <p className="text-xl font-bold text-quest-red">
                  🔥 {kid.current_streak}
                </p>
                <p className="text-xs text-quest-muted">Streak</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
