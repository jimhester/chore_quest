import { AppData, Profile, Chore, ChoreCompletion, Reward, RewardRedemption, StreakHistory } from "./types";
import { createSeedData } from "./seed";

const STORAGE_KEY = "chorequest-data";

function loadData(): AppData {
  if (typeof window === "undefined") {
    return createSeedData();
  }
  const raw = localStorage.getItem(STORAGE_KEY);
  if (!raw) {
    const seed = createSeedData();
    localStorage.setItem(STORAGE_KEY, JSON.stringify(seed));
    return seed;
  }
  return JSON.parse(raw);
}

function saveData(data: AppData): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}

// --- Profiles ---

export function getProfiles(): Profile[] {
  return loadData().profiles;
}

export function getProfileByName(name: string): Profile | undefined {
  return loadData().profiles.find(
    (p) => p.name.toLowerCase() === name.toLowerCase()
  );
}

export function getProfileById(id: string): Profile | undefined {
  return loadData().profiles.find((p) => p.id === id);
}

export function updateProfile(id: string, updates: Partial<Profile>): Profile | undefined {
  const data = loadData();
  const idx = data.profiles.findIndex((p) => p.id === id);
  if (idx === -1) return undefined;
  data.profiles[idx] = { ...data.profiles[idx], ...updates };
  saveData(data);
  return data.profiles[idx];
}

// --- Chores ---

export function getChores(): Chore[] {
  return loadData().chores.filter((c) => c.is_active).sort((a, b) => a.sort_order - b.sort_order);
}

export function getAllChores(): Chore[] {
  return loadData().chores.sort((a, b) => a.sort_order - b.sort_order);
}

export function createChore(chore: Omit<Chore, "id">): Chore {
  const data = loadData();
  const newChore: Chore = { ...chore, id: crypto.randomUUID() };
  data.chores.push(newChore);
  saveData(data);
  return newChore;
}

export function updateChore(id: string, updates: Partial<Chore>): Chore | undefined {
  const data = loadData();
  const idx = data.chores.findIndex((c) => c.id === id);
  if (idx === -1) return undefined;
  data.chores[idx] = { ...data.chores[idx], ...updates };
  saveData(data);
  return data.chores[idx];
}

// --- Chore Completions ---

export function getCompletionsForDate(profileId: string, date: string): ChoreCompletion[] {
  return loadData().choreCompletions.filter(
    (c) => c.profile_id === profileId && c.completed_at.startsWith(date)
  );
}

export function getAllCompletions(): ChoreCompletion[] {
  return loadData().choreCompletions;
}

export function completeChore(profileId: string, choreId: string, points: number): ChoreCompletion {
  const data = loadData();
  const completion: ChoreCompletion = {
    id: crypto.randomUUID(),
    profile_id: profileId,
    chore_id: choreId,
    completed_at: new Date().toISOString(),
    points_earned: points,
  };
  data.choreCompletions.push(completion);

  // Update profile points
  const profile = data.profiles.find((p) => p.id === profileId);
  if (profile) {
    profile.current_points += points;
    profile.lifetime_points += points;
  }

  // Update today's streak history
  const today = new Date().toLocaleDateString("en-CA", { timeZone: "America/New_York" });
  const todayCompletions = data.choreCompletions.filter(
    (c) => c.profile_id === profileId && c.completed_at.startsWith(today)
  );
  const todayPoints = todayCompletions.reduce((sum, c) => sum + c.points_earned, 0);
  const existing = data.streakHistory.find(
    (s) => s.profile_id === profileId && s.date === today
  );
  if (existing) {
    existing.chores_completed = todayCompletions.length;
    existing.points_earned = todayPoints;
  } else {
    data.streakHistory.push({
      id: crypto.randomUUID(),
      profile_id: profileId,
      date: today,
      chores_completed: todayCompletions.length,
      points_earned: todayPoints,
      streak_frozen: false,
    });
  }

  saveData(data);
  return completion;
}

export function deleteCompletion(completionId: string): boolean {
  const data = loadData();
  const idx = data.choreCompletions.findIndex((c) => c.id === completionId);
  if (idx === -1) return false;

  const completion = data.choreCompletions[idx];
  data.choreCompletions.splice(idx, 1);

  // Reverse profile points
  const profile = data.profiles.find((p) => p.id === completion.profile_id);
  if (profile) {
    profile.current_points = Math.max(0, profile.current_points - completion.points_earned);
    profile.lifetime_points = Math.max(0, profile.lifetime_points - completion.points_earned);
  }

  // Recalculate streak history for that day
  const date = completion.completed_at.substring(0, 10);
  const remaining = data.choreCompletions.filter(
    (c) => c.profile_id === completion.profile_id && c.completed_at.startsWith(date)
  );
  const streakEntry = data.streakHistory.find(
    (s) => s.profile_id === completion.profile_id && s.date === date
  );
  if (streakEntry) {
    if (remaining.length === 0) {
      data.streakHistory = data.streakHistory.filter((s) => s.id !== streakEntry.id);
    } else {
      streakEntry.chores_completed = remaining.length;
      streakEntry.points_earned = remaining.reduce((sum, c) => sum + c.points_earned, 0);
    }
  }

  saveData(data);
  return true;
}

// --- Rewards ---

export function getRewards(profileId?: string): Reward[] {
  return loadData()
    .rewards.filter(
      (r) => r.is_active && (r.profile_id === null || r.profile_id === profileId)
    )
    .sort((a, b) => a.sort_order - b.sort_order);
}

export function getAllRewards(): Reward[] {
  return loadData().rewards.sort((a, b) => a.sort_order - b.sort_order);
}

export function createReward(reward: Omit<Reward, "id">): Reward {
  const data = loadData();
  const newReward: Reward = { ...reward, id: crypto.randomUUID() };
  data.rewards.push(newReward);
  saveData(data);
  return newReward;
}

export function updateReward(id: string, updates: Partial<Reward>): Reward | undefined {
  const data = loadData();
  const idx = data.rewards.findIndex((r) => r.id === id);
  if (idx === -1) return undefined;
  data.rewards[idx] = { ...data.rewards[idx], ...updates };
  saveData(data);
  return data.rewards[idx];
}

// --- Reward Redemptions ---

export function redeemReward(profileId: string, rewardId: string): RewardRedemption | null {
  const data = loadData();
  const reward = data.rewards.find((r) => r.id === rewardId);
  const profile = data.profiles.find((p) => p.id === profileId);
  if (!reward || !profile || profile.current_points < reward.cost) return null;

  const redemption: RewardRedemption = {
    id: crypto.randomUUID(),
    profile_id: profileId,
    reward_id: rewardId,
    redeemed_at: new Date().toISOString(),
    points_spent: reward.cost,
  };
  data.rewardRedemptions.push(redemption);
  profile.current_points -= reward.cost;

  // Special case: streak freeze token
  if (reward.name === "Streak freeze token") {
    profile.streak_freezes += 1;
  }

  saveData(data);
  return redemption;
}

export function getAllRedemptions(): RewardRedemption[] {
  return loadData().rewardRedemptions;
}

// --- Streak History ---

export function getStreakHistory(profileId: string): StreakHistory[] {
  return loadData()
    .streakHistory.filter((s) => s.profile_id === profileId)
    .sort((a, b) => b.date.localeCompare(a.date));
}

export function upsertStreakHistory(
  profileId: string,
  date: string,
  choresCompleted: number,
  pointsEarned: number
): StreakHistory {
  const data = loadData();
  const existing = data.streakHistory.find(
    (s) => s.profile_id === profileId && s.date === date
  );
  if (existing) {
    existing.chores_completed = choresCompleted;
    existing.points_earned = pointsEarned;
    saveData(data);
    return existing;
  }
  const entry: StreakHistory = {
    id: crypto.randomUUID(),
    profile_id: profileId,
    date,
    chores_completed: choresCompleted,
    points_earned: pointsEarned,
    streak_frozen: false,
  };
  data.streakHistory.push(entry);
  saveData(data);
  return entry;
}

// --- Utility ---

export function resetAllData(): void {
  const seed = createSeedData();
  saveData(seed);
}
