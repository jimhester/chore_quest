"use client";

import { useState } from "react";
import { useStore } from "@/lib/hooks/useStore";
import { Chore } from "@/lib/data/types";

type EditingChore = {
  id?: string;
  name: string;
  points: string;
  frequency: Chore["frequency"];
  icon: string;
};

const EMPTY_CHORE: EditingChore = {
  name: "",
  points: "10",
  frequency: "daily",
  icon: "✨",
};

const COMMON_ICONS = ["🧹", "🍽️", "🐟", "🎒", "🛁", "🧥", "📚", "🔧", "🏃", "🌟", "✨", "💪"];

export default function ManageChores() {
  const { getAllChores, createChore, updateChore } = useStore();
  const chores = getAllChores();
  const [editing, setEditing] = useState<EditingChore | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);

  const startAdd = () => {
    setEditingId(null);
    setEditing({ ...EMPTY_CHORE });
  };

  const startEdit = (chore: Chore) => {
    setEditingId(chore.id);
    setEditing({
      id: chore.id,
      name: chore.name,
      points: String(chore.points),
      frequency: chore.frequency,
      icon: chore.icon,
    });
  };

  const handleSave = () => {
    if (!editing || !editing.name.trim()) return;
    const points = Math.max(1, parseInt(editing.points) || 10);

    if (editingId) {
      updateChore(editingId, {
        name: editing.name.trim(),
        points,
        frequency: editing.frequency,
        icon: editing.icon,
      });
    } else {
      createChore({
        name: editing.name.trim(),
        points,
        frequency: editing.frequency,
        icon: editing.icon,
        is_active: true,
        sort_order: chores.length,
      });
    }
    setEditing(null);
    setEditingId(null);
  };

  const handleToggleActive = (chore: Chore) => {
    updateChore(chore.id, { is_active: !chore.is_active });
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold">Manage Chores</h2>
        <button
          onClick={startAdd}
          className="bg-quest-green text-white font-bold px-4 py-2 rounded-lg text-sm"
        >
          + Add Chore
        </button>
      </div>

      {/* Add/Edit form */}
      {editing && (
        <div className="bg-white rounded-xl p-4 shadow-md border-2 border-quest-purple space-y-3">
          <h3 className="font-bold">{editingId ? "Edit Chore" : "New Chore"}</h3>

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
              placeholder="Chore name..."
              className="w-full px-3 py-2 rounded-lg border border-gray-200 mt-1 focus:outline-none focus:border-quest-purple"
            />
          </div>

          <div className="flex gap-3">
            <div className="flex-1">
              <label className="text-xs text-quest-muted font-semibold">Coins</label>
              <input
                type="number"
                value={editing.points}
                onChange={(e) => setEditing({ ...editing, points: e.target.value })}
                min="1"
                className="w-full px-3 py-2 rounded-lg border border-gray-200 mt-1 focus:outline-none focus:border-quest-purple"
              />
            </div>
            <div className="flex-1">
              <label className="text-xs text-quest-muted font-semibold">Frequency</label>
              <select
                value={editing.frequency}
                onChange={(e) =>
                  setEditing({ ...editing, frequency: e.target.value as Chore["frequency"] })
                }
                className="w-full px-3 py-2 rounded-lg border border-gray-200 mt-1 focus:outline-none focus:border-quest-purple"
              >
                <option value="daily">Daily</option>
                <option value="per_meal">Per Meal</option>
                <option value="as_needed">As Needed</option>
              </select>
            </div>
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

      {/* Chore list */}
      <div className="space-y-2">
        {chores.map((chore) => (
          <div
            key={chore.id}
            className={`bg-white rounded-xl p-3 shadow-sm flex items-center gap-3 ${
              !chore.is_active ? "opacity-50" : ""
            }`}
          >
            <span className="text-xl">{chore.icon}</span>
            <div className="flex-1 min-w-0">
              <span className="font-medium">{chore.name}</span>
              <span className="text-xs text-quest-muted ml-2 capitalize">
                {chore.frequency.replace("_", " ")}
              </span>
            </div>
            <span className="text-quest-orange font-bold text-sm">{chore.points} coins</span>
            <button
              onClick={() => startEdit(chore)}
              className="text-quest-muted hover:text-quest-purple text-sm px-2"
            >
              Edit
            </button>
            <button
              onClick={() => handleToggleActive(chore)}
              className={`text-sm px-2 font-semibold ${
                chore.is_active ? "text-quest-red" : "text-quest-green"
              }`}
            >
              {chore.is_active ? "Hide" : "Show"}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
