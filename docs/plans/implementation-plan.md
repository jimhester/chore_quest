# ChoreQuest Implementation Plan

## Context

The Hester family wants a mobile-friendly web app (ChoreQuest) for their kids (Elise & Charlotte) to track household chores, earn points, maintain streaks, and level up virtual pets. Parents (Jim & Mackenzie) manage chores/rewards via a PIN-protected admin panel. A comprehensive spec exists at `docs/plans/chore-quest-spec.md`. No code exists yet — this plan covers the full build.

## Tech Stack

- **Next.js** (App Router, TypeScript, `src/` directory)
- **Tailwind CSS** (cheerful color palette, mobile-first)
- **localStorage** for data persistence initially (clean data layer interface for easy Supabase swap later)
- **Framer Motion** (animations)
- **Vercel** (deployment)

---

## Folder Structure

```
src/
  app/
    layout.tsx                  # Root layout: fonts, global styles, DataProvider
    page.tsx                    # Family dashboard (/)
    [name]/
      layout.tsx                # Kid layout: bottom nav, pet companion, profile lookup
      page.tsx                  # Kid dashboard (/elise, /charlotte)
      chores/page.tsx           # Chore list
      rewards/page.tsx          # Reward store
      pet/page.tsx              # Full pet view
    parent/
      layout.tsx                # Parent layout: PIN gate
      page.tsx                  # Admin overview
      chores/page.tsx           # Manage chores
      rewards/page.tsx          # Manage rewards
      history/page.tsx          # Activity history
  components/
    pet/
      PetDisplay.tsx            # Emoji-based pet rendering (type, stage, mood)
      PetCompanion.tsx          # Small pet widget for kid layout
      PetEvolution.tsx          # Progress bar to next stage
    streak/
      StreakCounter.tsx          # Fire icon + animated day count
      StreakMilestone.tsx        # Milestone celebration overlay
    chores/
      ChoreCard.tsx             # Single chore with tap-to-complete
      ChoreList.tsx             # List of chore cards
    rewards/
      RewardCard.tsx            # Single reward with redeem button
      RewardList.tsx            # List of reward cards
    shared/
      PointsBadge.tsx           # Current/lifetime points display
      Navigation.tsx            # Bottom nav for kid views
      ParentNav.tsx             # Top nav for parent views
      PinGate.tsx               # PIN entry modal/screen
      ConfettiOverlay.tsx       # Confetti animation wrapper
  lib/
    data/
      store.ts                  # localStorage-based data store with typed API
      types.ts                  # TypeScript types matching the DB schema
      seed.ts                   # Default data (3 profiles, 16 chores, 9 rewards)
    hooks/
      useStore.ts               # React hook wrapping the data store with state
    actions/
      chores.ts                 # completeChore, getChoresWithCompletions
      rewards.ts                # redeemReward, getAvailableRewards
      profiles.ts               # getProfileByName, setupPet
      streaks.ts                # recordDailyActivity, checkStreakFreeze
      parent.ts                 # CRUD chores/rewards, verifyPin, getActivityHistory
    utils/
      pet.ts                    # Stage calc (0/100/300/600/1000), mood logic
      streak.ts                 # Streak calculation helpers
      dates.ts                  # Eastern timezone "today" helper
      points.ts                 # Point formatting
```

---

## Data Layer Design (localStorage-first)

Since we're skipping Supabase for now, we'll build a clean data abstraction:

### `lib/data/types.ts`
TypeScript interfaces matching the spec's 6-table schema:
- `Profile`, `Chore`, `ChoreCompletion`, `Reward`, `RewardRedemption`, `StreakHistory`

### `lib/data/store.ts`
A `DataStore` class that:
- Reads/writes JSON to localStorage under a single `chorequest-data` key
- Exposes typed CRUD methods: `getProfiles()`, `getChores()`, `addChoreCompletion()`, etc.
- Auto-initializes with seed data on first load
- Uses UUIDs (via `crypto.randomUUID()`) for IDs

### `lib/data/seed.ts`
Default data matching the spec:
- 3 profiles: Elise (kid), Charlotte (kid), Parent
- 16 chores with points/frequency/icons from spec table
- 9 rewards with costs/icons from spec table

### `lib/hooks/useStore.ts`
React hook that:
- Wraps `DataStore` with React state
- Triggers re-renders on mutations
- Provides the same API to all components

This design means swapping to Supabase later only requires replacing `store.ts` internals — all component code stays the same.

---

## Pet System (Emoji-Based)

Simple emoji compositions styled with CSS for each stage and mood:

| Stage | Cat | Dog |
|-------|-----|-----|
| 1 (Baby) | Small cat emoji, sleepy eyes overlay | Small dog emoji, sleepy eyes |
| 2 (Young) | Cat emoji, slightly larger, playful | Dog emoji, slightly larger |
| 3 (Teen) | Cat emoji + collar emoji | Dog emoji + bandana |
| 4 (Adult) | Large cat emoji + sparkle | Large dog emoji + sparkle |
| 5 (Champion) | Large cat emoji + crown + sparkles | Large dog emoji + crown + sparkles |

Mood affects background glow/animation:
- **Happy**: Gentle bounce animation, warm glow
- **Content**: Subtle sway, neutral
- **Sleepy**: Slow pulse, zzz overlay, muted colors

Use Tailwind for sizing/animation and Framer Motion for transitions between stages.

---

## Implementation Milestones

### Milestone 1: Foundation
**Goal:** App runs, pages render, profiles load from local store.

1. Scaffold Next.js: `npx create-next-app@latest . --typescript --tailwind --eslint --app --src-dir --import-alias "@/*"`
2. Install deps: `framer-motion`
3. Create data types (`lib/data/types.ts`)
4. Create data store (`lib/data/store.ts`) with localStorage persistence
5. Create seed data (`lib/data/seed.ts`) — 3 profiles, 16 chores, 9 rewards
6. Create React hook (`lib/hooks/useStore.ts`)
7. Root layout with fonts (Nunito via Google Fonts) and Tailwind color theme
8. Family dashboard `/` — landing with two kid name buttons + parent link
9. `[name]/layout.tsx` — profile lookup by name, 404 if not found, bottom nav
10. `[name]/page.tsx` — kid dashboard showing name, points, pet preview

### Milestone 2: Chore System (Core Loop)
**Goal:** Kids see chores, tap to complete, earn points.

1. `completeChore` action — add completion, increment current_points + lifetime_points
2. `getChoresWithCompletions` — chores + today's completions for a profile
3. `ChoreCard` component — name, icon, points, tap target, completion checkmark
4. `ChoreList` component — renders all chores, shows today's completions
5. `/[name]/chores/page.tsx` — fetches and renders chore list
6. Completion animation (checkmark, points float up) via Framer Motion
7. `PointsBadge` in kid layout header showing current balance

### Milestone 3: Rewards Store
**Goal:** Kids browse and redeem rewards with earned points.

1. `redeemReward` action — validate balance, add redemption, decrement current_points. Special: streak freeze token increments `streak_freezes`
2. `RewardCard` — shows reward, cost, affordable/not-affordable styling
3. `/[name]/rewards/page.tsx` — reward list with redeem flow
4. Redemption animation (confetti)

### Milestone 4: Streak System
**Goal:** Daily streaks tracked and displayed with milestones.

1. `lib/utils/dates.ts` — `getToday()` returning Eastern timezone date string
2. `lib/utils/streak.ts` — streak calculation, freeze logic
3. `recordDailyActivity` — upsert streak_history for today, recalculate current_streak + longest_streak
4. `StreakCounter` component — fire icon + animated day count
5. `StreakMilestone` — celebration overlay at 7/14/30/60/90 days (confetti + badge)
6. Integrate streak into kid dashboard and chore completion flow

### Milestone 5: Virtual Pet
**Goal:** Emoji pets evolve based on lifetime points, mood reflects activity.

1. `lib/utils/pet.ts` — stage thresholds (0/100/300/600/1000), mood calc (happy/content/sleepy based on recent activity)
2. `PetDisplay` — emoji-based rendering with CSS styling per stage/mood
3. `PetCompanion` — small version for kid layout header/footer
4. `PetEvolution` — progress bar showing points toward next stage
5. `/[name]/pet/page.tsx` — full pet view with name, stats, evolution history
6. Pet setup flow — if `pet_type` is null, show cat/dog selection + name entry on first visit
7. Update family dashboard with side-by-side pet display

### Milestone 6: Parent Admin
**Goal:** PIN-protected management of chores, rewards, and activity history.

1. `PinGate` component — 4-digit PIN entry, validates against hardcoded or env PIN, stores session in sessionStorage
2. `parent/layout.tsx` — checks PIN session, shows PinGate if missing
3. `parent/page.tsx` — overview with both kids' stats
4. `parent/chores/page.tsx` — CRUD chores (add/edit/toggle active, reorder)
5. `parent/rewards/page.tsx` — CRUD rewards (add/edit/toggle, assign to kid or global)
6. `parent/history/page.tsx` — activity log, filterable by kid/date

### Milestone 7: Polish & Dashboard
**Goal:** Full family dashboard, mobile UX pass, animations.

1. Family dashboard — pets side-by-side, family streak, today's activity, weekly totals, encouraging messages
2. Mobile responsiveness pass (iPad primary, phone, Chromebook)
3. Animation polish (pet reactions on chore completion, smooth page transitions)
4. PWA manifest + meta tags for "Add to Home Screen"

---

## Key Architecture Decisions

- **Client-side rendering:** Since data is in localStorage (no server DB), all pages are client components. Clean separation via hooks means switching to server components + Supabase later is straightforward.
- **Data abstraction:** `DataStore` class with typed methods. Components never touch localStorage directly. Swap to Supabase by reimplementing `store.ts`.
- **Optimistic by default:** Since localStorage is synchronous, all updates are instant. No loading states needed for mutations.
- **Routing:** `/parent` is a static route that takes priority over `[name]` dynamic route — no conflict in Next.js App Router.
- **No auth:** Kids selected by URL. Parent PIN checked client-side against a known value (sufficient for family use; server-side check when Supabase is added).
- **Timezone:** All day-boundary logic uses Eastern timezone via `dates.ts` helper.
- **Pet art:** Emoji compositions with CSS styling. Each combination of type (cat/dog) x stage (1-5) x mood (happy/content/sleepy) maps to an emoji + CSS class.

## Data Schema (localStorage JSON)

Same 6-table structure as the spec, stored as a single JSON object:
```typescript
interface AppData {
  profiles: Profile[]
  chores: Chore[]
  choreCompletions: ChoreCompletion[]
  rewards: Reward[]
  rewardRedemptions: RewardRedemption[]
  streakHistory: StreakHistory[]
}
```

All IDs are UUIDs. Timestamps stored as ISO strings. Relationships via ID references (same as the relational schema — easy migration to Supabase later).

## Verification

1. **After Milestone 1:** Visit `/`, see both kids, tap name, arrive at `/elise` with profile data
2. **After Milestone 2:** Complete a chore, see points increase, checkmark animation
3. **After Milestone 3:** Earn points from chores, spend on reward, verify balance decreases
4. **After Milestone 4:** Complete chores on consecutive days, see streak counter increment
5. **After Milestone 5:** Accumulate lifetime points, watch pet evolve through stages
6. **After Milestone 6:** Enter PIN, manage chores/rewards, view history
7. **After Milestone 7:** Full family dashboard, test on iPad/phone
