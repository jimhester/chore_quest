export interface Profile {
  id: string;
  name: string;
  role: "kid" | "parent";
  pet_type: "cat" | "dog" | null;
  pet_name: string | null;
  lifetime_points: number;
  current_points: number;
  current_streak: number;
  longest_streak: number;
  streak_freezes: number;
  created_at: string;
}

export interface Chore {
  id: string;
  name: string;
  points: number;
  frequency: "daily" | "per_meal" | "as_needed";
  icon: string;
  is_active: boolean;
  sort_order: number;
}

export interface ChoreCompletion {
  id: string;
  profile_id: string;
  chore_id: string;
  completed_at: string;
  points_earned: number;
}

export interface Reward {
  id: string;
  name: string;
  cost: number;
  icon: string;
  is_active: boolean;
  sort_order: number;
  profile_id: string | null; // null = available to all kids
}

export interface RewardRedemption {
  id: string;
  profile_id: string;
  reward_id: string;
  redeemed_at: string;
  points_spent: number;
}

export interface StreakHistory {
  id: string;
  profile_id: string;
  date: string; // YYYY-MM-DD
  chores_completed: number;
  points_earned: number;
  streak_frozen: boolean;
}

export interface AppData {
  profiles: Profile[];
  chores: Chore[];
  choreCompletions: ChoreCompletion[];
  rewards: Reward[];
  rewardRedemptions: RewardRedemption[];
  streakHistory: StreakHistory[];
}
