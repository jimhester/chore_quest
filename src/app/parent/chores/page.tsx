"use client";

import { useStore } from "@/lib/hooks/useStore";

export default function ManageChores() {
  const { getAllChores } = useStore();
  const chores = getAllChores();

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-bold">Manage Chores</h2>
      <p className="text-quest-muted text-sm">Coming soon — add, edit, and manage chores.</p>
      <div className="space-y-2">
        {chores.map((chore) => (
          <div
            key={chore.id}
            className={`bg-white rounded-xl p-3 shadow-sm flex items-center gap-3 ${
              !chore.is_active ? "opacity-50" : ""
            }`}
          >
            <span className="text-xl">{chore.icon}</span>
            <span className="flex-1 font-medium">{chore.name}</span>
            <span className="text-quest-orange font-bold">{chore.points} pts</span>
          </div>
        ))}
      </div>
    </div>
  );
}
