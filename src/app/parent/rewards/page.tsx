"use client";

import { useState } from "react";
import { useStore } from "@/lib/hooks/useStore";
import { Reward } from "@/lib/data/types";

type EditingReward = {
  id?: string;
  name: string;
  cost: string;
  icon: string;
};

const EMPTY_REWARD: EditingReward = {
  name: "",
  cost: "50",
  icon: "🎁",
};

const COMMON_ICONS = ["🍬", "🛍️", "🎬", "👫", "🚗", "🍰", "🏨", "❄️", "🎮", "📱", "🎁", "🌈"];

export default function ManageRewards() {
  const { getAllRewards, createReward, updateReward } = useStore();
  const rewards = getAllRewards();
  const [editing, setEditing] = useState<EditingReward | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);

  const startAdd = () => {
    setEditingId(null);
    setEditing({ ...EMPTY_REWARD });
  };

  const startEdit = (reward: Reward) => {
    setEditingId(reward.id);
    setEditing({
      id: reward.id,
      name: reward.name,
      cost: String(reward.cost),
      icon: reward.icon,
    });
  };

  const handleSave = () => {
    if (!editing || !editing.name.trim()) return;
    const cost = Math.max(1, parseInt(editing.cost) || 50);

    if (editingId) {
      updateReward(editingId, {
        name: editing.name.trim(),
        cost,
        icon: editing.icon,
      });
    } else {
      createReward({
        name: editing.name.trim(),
        cost,
        icon: editing.icon,
        is_active: true,
        sort_order: rewards.length,
        profile_id: null,
      });
    }
    setEditing(null);
    setEditingId(null);
  };

  const handleToggleActive = (reward: Reward) => {
    updateReward(reward.id, { is_active: !reward.is_active });
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold">Manage Rewards</h2>
        <button
          onClick={startAdd}
          className="bg-quest-green text-white font-bold px-4 py-2 rounded-lg text-sm"
        >
          + Add Reward
        </button>
      </div>

      {/* Add/Edit form */}
      {editing && (
        <div className="bg-white rounded-xl p-4 shadow-md border-2 border-quest-purple space-y-3">
          <h3 className="font-bold">{editingId ? "Edit Reward" : "New Reward"}</h3>

          {/* Icon picker */}
          <div>
            <label className="text-xs text-quest-muted font-semibold">Icon</label>
            <div className="flex gap-2 flex-wrap mt-1">
              {COMMON_ICONS.map((icon) => (
                <button
                  key={icon}
                  onClick={() => setEditing({ ...editing, icon })}
                  className={`text-2xl p-1 rounded-lg ${
                    editing.icon === icon ? "bg-quest-purple/20 ring-2 ring-quest-purple" : ""
                  }`}
                >
                  {icon}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="text-xs text-quest-muted font-semibold">Name</label>
            <input
              type="text"
              value={editing.name}
              onChange={(e) => setEditing({ ...editing, name: e.target.value })}
              placeholder="Reward name..."
              className="w-full px-3 py-2 rounded-lg border border-gray-200 mt-1 focus:outline-none focus:border-quest-purple"
            />
          </div>

          <div>
            <label className="text-xs text-quest-muted font-semibold">Cost (coins)</label>
            <input
              type="number"
              value={editing.cost}
              onChange={(e) => setEditing({ ...editing, cost: e.target.value })}
              min="1"
              className="w-full px-3 py-2 rounded-lg border border-gray-200 mt-1 focus:outline-none focus:border-quest-purple"
            />
          </div>

          <div className="flex gap-2">
            <button
              onClick={handleSave}
              disabled={!editing.name.trim()}
              className="flex-1 bg-quest-purple text-white font-bold py-2 rounded-lg disabled:opacity-50"
            >
              {editingId ? "Save" : "Add"}
            </button>
            <button
              onClick={() => { setEditing(null); setEditingId(null); }}
              className="px-4 py-2 bg-gray-100 text-quest-muted font-semibold rounded-lg"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Reward list */}
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
            <span className="text-quest-green font-bold text-sm">{reward.cost} coins</span>
            <button
              onClick={() => startEdit(reward)}
              className="text-quest-muted hover:text-quest-purple text-sm px-2"
            >
              Edit
            </button>
            <button
              onClick={() => handleToggleActive(reward)}
              className={`text-sm px-2 font-semibold ${
                reward.is_active ? "text-quest-red" : "text-quest-green"
              }`}
            >
              {reward.is_active ? "Hide" : "Show"}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
