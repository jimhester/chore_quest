export type PetStage = 1 | 2 | 3 | 4 | 5;
export type PetMood = "happy" | "content" | "sleepy";

const STAGE_THRESHOLDS = [0, 100, 300, 600, 1000];
const STAGE_NAMES = ["Baby", "Young", "Teen", "Adult", "Champion"];

export function getPetStage(lifetimePoints: number): PetStage {
  for (let i = STAGE_THRESHOLDS.length - 1; i >= 0; i--) {
    if (lifetimePoints >= STAGE_THRESHOLDS[i]) return (i + 1) as PetStage;
  }
  return 1;
}

export function getPetStageName(stage: PetStage): string {
  return STAGE_NAMES[stage - 1];
}

export function getNextStageThreshold(stage: PetStage): number | null {
  if (stage >= 5) return null;
  return STAGE_THRESHOLDS[stage];
}

export function getStageProgress(lifetimePoints: number): number {
  const stage = getPetStage(lifetimePoints);
  const currentThreshold = STAGE_THRESHOLDS[stage - 1];
  const nextThreshold = getNextStageThreshold(stage);
  if (nextThreshold === null) return 100;
  const progress = ((lifetimePoints - currentThreshold) / (nextThreshold - currentThreshold)) * 100;
  return Math.min(100, Math.round(progress));
}

export function getPetEmoji(type: "cat" | "dog", stage: PetStage): string {
  const base = type === "cat" ? "🐱" : "🐶";
  switch (stage) {
    case 1: return base;
    case 2: return type === "cat" ? "🐈" : "🐕";
    case 3: return type === "cat" ? "🐈‍⬛" : "🦮";
    case 4: return type === "cat" ? "🐈" : "🐕‍🦺";
    case 5: return type === "cat" ? "👑🐈" : "👑🐕";
  }
}

export function getPetMoodEmoji(mood: PetMood): string {
  switch (mood) {
    case "happy": return "😊";
    case "content": return "😌";
    case "sleepy": return "😴";
  }
}

export function getPetMoodLabel(mood: PetMood): string {
  switch (mood) {
    case "happy": return "Happy!";
    case "content": return "Content";
    case "sleepy": return "Sleepy...";
  }
}

/**
 * Determine pet mood from recent activity.
 * - happy: did chores today and has active streak
 * - content: did chores recently (within 1 day)
 * - sleepy: no chores in 2+ days
 */
export function calculatePetMood(
  todayChoreCount: number,
  currentStreak: number,
  lastActivityDaysAgo: number | null,
): PetMood {
  if (todayChoreCount > 0 && currentStreak > 0) return "happy";
  if (lastActivityDaysAgo !== null && lastActivityDaysAgo <= 1) return "content";
  return "sleepy";
}
