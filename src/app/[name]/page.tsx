"use client";

import { useParams } from "next/navigation";
import Link from "next/link";
import { useStore } from "@/lib/hooks/useStore";
import { getPetStage, getPetEmoji, getPetStageName, getStageProgress } from "@/lib/utils/pet";
import { getToday } from "@/lib/utils/dates";

export default function KidDashboard() {
  const params = useParams<{ name: string }>();
  const { getProfileByName, getCompletionsForDate } = useStore();
  const profile = getProfileByName(params.name);

  if (!profile) return null;

  const today = getToday();
  const todayCompletions = getCompletionsForDate(profile.id, today);
  const todayPoints = todayCompletions.reduce((sum, c) => sum + c.points_earned, 0);

  const hasPet = profile.pet_type !== null;
  const petStage = getPetStage(profile.lifetime_points);
  const petProgress = getStageProgress(profile.lifetime_points);

  return (
    <div className="space-y-6">
      {/* Pet section */}
      <div className="bg-white rounded-2xl shadow-sm p-6 text-center">
        {hasPet ? (
          <>
            <div className="text-6xl mb-2">
              {getPetEmoji(profile.pet_type!, petStage)}
            </div>
            <p className="font-bold text-lg">{profile.pet_name}</p>
            <p className="text-quest-muted text-sm">
              {getPetStageName(petStage)} • Level {petStage}
            </p>
            {petStage < 5 && (
              <div className="mt-3">
                <div className="w-full bg-gray-100 rounded-full h-2">
                  <div
                    className="bg-quest-purple h-2 rounded-full transition-all"
                    style={{ width: `${petProgress}%` }}
                  />
                </div>
                <p className="text-xs text-quest-muted mt-1">
                  {petProgress}% to next level
                </p>
              </div>
            )}
          </>
        ) : (
          <Link
            href={`/${params.name}/pet`}
            className="block"
          >
            <div className="text-5xl mb-2">🥚</div>
            <p className="font-bold text-lg">Choose your pet!</p>
            <p className="text-quest-muted text-sm">Tap to pick a cat or dog</p>
          </Link>
        )}
      </div>

      {/* Today's stats */}
      <div className="bg-white rounded-2xl shadow-sm p-6">
        <h2 className="font-bold text-lg mb-4">Today&apos;s Activity</h2>
        <div className="grid grid-cols-3 gap-4 text-center">
          <div>
            <p className="text-2xl font-bold text-quest-green">
              {todayCompletions.length}
            </p>
            <p className="text-xs text-quest-muted">Chores Done</p>
          </div>
          <div>
            <p className="text-2xl font-bold text-quest-orange">{todayPoints}</p>
            <p className="text-xs text-quest-muted">Points Earned</p>
          </div>
          <div>
            <p className="text-2xl font-bold text-quest-red">
              {profile.current_streak > 0 ? `🔥 ${profile.current_streak}` : "—"}
            </p>
            <p className="text-xs text-quest-muted">Day Streak</p>
          </div>
        </div>
      </div>

      {/* Quick actions */}
      <div className="grid grid-cols-2 gap-4">
        <Link
          href={`/${params.name}/chores`}
          className="bg-quest-green text-white rounded-2xl p-4 text-center font-bold shadow-sm hover:shadow-md transition-shadow"
        >
          ✅ Do Chores
        </Link>
        <Link
          href={`/${params.name}/rewards`}
          className="bg-quest-purple text-white rounded-2xl p-4 text-center font-bold shadow-sm hover:shadow-md transition-shadow"
        >
          🎁 Rewards
        </Link>
      </div>
    </div>
  );
}
