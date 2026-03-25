"use client";

import { useState } from "react";
import { useParams } from "next/navigation";
import { useStore } from "@/lib/hooks/useStore";
import {
  getPetStage,
  getPetEmoji,
  getPetStageName,
  getStageProgress,
  getNextStageThreshold,
} from "@/lib/utils/pet";

export default function PetPage() {
  const params = useParams<{ name: string }>();
  const { getProfileByName, updateProfile } = useStore();
  const profile = getProfileByName(params.name);

  const [selectedType, setSelectedType] = useState<"cat" | "dog" | null>(null);
  const [petName, setPetName] = useState("");

  if (!profile) return null;

  // Pet setup flow
  if (!profile.pet_type) {
    return (
      <div className="space-y-6 text-center">
        <h2 className="text-2xl font-bold">Choose Your Pet!</h2>
        <p className="text-quest-muted">
          Pick a companion to grow with you on your quest!
        </p>

        <div className="flex gap-6 justify-center">
          {(["cat", "dog"] as const).map((type) => (
            <button
              key={type}
              onClick={() => setSelectedType(type)}
              className={`p-6 rounded-2xl border-2 transition-all ${
                selectedType === type
                  ? "border-quest-purple bg-quest-purple/10 scale-105"
                  : "border-gray-200 bg-white hover:border-quest-purple/50"
              }`}
            >
              <span className="text-6xl block mb-2">
                {type === "cat" ? "🐱" : "🐶"}
              </span>
              <span className="font-bold capitalize">{type}</span>
            </button>
          ))}
        </div>

        {selectedType && (
          <div className="space-y-4">
            <input
              type="text"
              value={petName}
              onChange={(e) => setPetName(e.target.value)}
              placeholder="Name your pet..."
              className="w-full max-w-xs mx-auto block px-4 py-3 rounded-xl border border-gray-200 text-center text-lg font-semibold focus:outline-none focus:border-quest-purple"
            />
            {petName.trim() && (
              <button
                onClick={() => {
                  updateProfile(profile.id, {
                    pet_type: selectedType,
                    pet_name: petName.trim(),
                  });
                }}
                className="bg-quest-purple text-white font-bold px-8 py-3 rounded-full hover:bg-quest-purple/90 transition-colors"
              >
                Let&apos;s go!
              </button>
            )}
          </div>
        )}
      </div>
    );
  }

  // Pet view
  const stage = getPetStage(profile.lifetime_points);
  const progress = getStageProgress(profile.lifetime_points);
  const nextThreshold = getNextStageThreshold(stage);

  return (
    <div className="space-y-6 text-center">
      <div className="bg-white rounded-2xl shadow-sm p-8">
        <div className="text-8xl mb-4">
          {getPetEmoji(profile.pet_type, stage)}
        </div>
        <h2 className="text-2xl font-bold">{profile.pet_name}</h2>
        <p className="text-quest-muted">
          {getPetStageName(stage)} • Level {stage}
        </p>
      </div>

      <div className="bg-white rounded-2xl shadow-sm p-6">
        <h3 className="font-bold mb-3">Evolution Progress</h3>
        <div className="w-full bg-gray-100 rounded-full h-3">
          <div
            className="bg-gradient-to-r from-quest-purple to-quest-pink h-3 rounded-full transition-all"
            style={{ width: `${progress}%` }}
          />
        </div>
        <p className="text-sm text-quest-muted mt-2">
          {stage < 5
            ? `${profile.lifetime_points} / ${nextThreshold} coins to next level`
            : "Max level reached! 🏆"}
        </p>
      </div>

      <div className="bg-white rounded-2xl shadow-sm p-6">
        <h3 className="font-bold mb-3">Stats</h3>
        <div className="grid grid-cols-2 gap-4 text-center">
          <div>
            <p className="text-2xl font-bold text-quest-orange">
              {profile.lifetime_points}
            </p>
            <p className="text-xs text-quest-muted">Lifetime Coins</p>
          </div>
          <div>
            <p className="text-2xl font-bold text-quest-purple">
              {profile.current_streak}
            </p>
            <p className="text-xs text-quest-muted">Day Streak</p>
          </div>
        </div>
      </div>
    </div>
  );
}
