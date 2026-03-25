# ChoreQuest — Hester Family Chore Tracker

## Overview

A mobile-friendly web app for the Hester family (parents Jim & Mackenzie, kids Elise & Charlotte) to track household chores, earn points, maintain activity streaks, and level up a virtual pet. The app should feel fun and game-like for the kids while being simple to manage.

---

## Users & Access

- **Two kid profiles**: Elise and Charlotte (no login/auth required — just tap your name to enter)
- **Parent mode**: Accessible via a simple PIN code, for managing chores, rewards, and point adjustments
- **Family dashboard**: A shared view showing combined family stats, both pets side-by-side, and a family streak

The app should work great on iPads, school laptops (Chromebook-friendly), and phones. No app install — just a bookmarkable URL.

---

## Core Features

### 1. Chore List & Point Earning

Each kid sees a list of available chores they can complete. Chores are **trust-based** — kids tap to mark a chore as done and earn points immediately (no parent approval flow).

**Default chores (parents can edit these in parent mode):**

*Point values are placeholders — parents should adjust these to taste.*

| Chore | Points | Frequency | Notes |
|-------|--------|-----------|-------|
| Washing dishes | 10 | As needed | |
| Cleaning up great room | 10 | Daily | |
| Cleaning up for 15 min | 10 | Daily | General tidy-up session |
| Feed fish | 5 | Daily | |
| Tidy furniture | 5 | As needed | |
| Empty dishwasher | 10 | As needed | |
| Packing lunch + snack | 10 | Daily | School day prep |
| Go outside for 30 min | 5 | Daily | |
| Bathing | 5 | Daily | |
| Lock up at night | 5 | Daily | |
| Plates + bowls in sink | 5 | Per meal | |
| Rinsing + loading dishwasher | 10 | Per meal | Bonus on top of plates in sink |
| Hanging up coats + putting shoes away | 5 | Daily | |
| Early start to homework | 10 | Daily | Bonus points on weekend or day assigned |
| Helping Dad with a project | 15 | As needed | e.g., putting up trampoline |
| Bonus: Extra helpful (parent awards) | 5-20 | As needed | |

**Bonus point days:**
- Each day, 1-2 chores are randomly selected to award **1.5x points** (rounded up to the nearest 5)
- The bonus chores are revealed when kids open the app — discovery is part of the fun
- Highlighted visually in the chore list (e.g. a star or "bonus" badge)
- Both kids get the same bonus chores each day

**Chore management (parent mode):**
- Add, edit, remove chores
- Set point values and frequency (daily, per-meal, as-needed)
- Mark certain chores as "daily" so they reset each day

### 2. Activity Streaks

- **Daily streak**: Tracks consecutive days where the kid completed at least 1 chore (or a configurable minimum, like 3 chores or 20 points earned)
- Visual streak counter (fire/flame icon with day count)
- Streak milestones at 7, 14, 30, 60, 90 days with special celebrations (confetti animation, badge earned)
- **Streak freeze**: Kids can earn or buy (with points) a "streak freeze" that protects one missed day
- **Family streak**: Combined — counts days where ALL family members completed their minimum

### 3. Virtual Pet (Cat or Dog)

Each kid chooses a pet when they first set up their profile. **Elise has chosen a red panda; Charlotte has chosen an arctic fox.**

**Pet progression system:**
- Pet starts as a baby/kitten/puppy
- As the kid earns lifetime points, the pet evolves through stages:
  - **Stage 1 (0 pts)**: Baby — simple, small, sleepy
  - **Stage 2 (100 pts)**: Young — bigger, playful, new accessories
  - **Stage 3 (300 pts)**: Teen — even bigger, some flair (collar, bandana)
  - **Stage 4 (600 pts)**: Adult — full-grown, confident pose
  - **Stage 5 (1000 pts)**: Champion — sparkles, crown, special effects
- Pet has a **mood** tied to recent activity:
  - Happy (active streak, chores done today)
  - Content (some activity recently)
  - Sleepy/sad (no chores in 2+ days)
- Pet has a **name** the kid chooses
- Pet is displayed prominently on the kid's dashboard with a progress bar to next evolution

**Visual style:** Cute, colorful, SVG/CSS-based illustrations (no need for complex art — clean cartoon style works great). Think Tamagotchi meets Duolingo owl.

### 4. Rewards Store

Kids spend earned points on rewards. The reward list is managed by parents.

**Default rewards (from Charlotte's list — parents can edit, and Elise may want her own additions):**

*Point costs are placeholders — parents should adjust these to taste.*

| Reward | Cost |
|--------|------|
| Candy | 20 pts |
| Stores in town (shopping trip) | 50 pts |
| PJ Day (stay in pajamas all day) | 30 pts |
| Movie theater | 75 pts |
| Friend to sleep over | 75 pts |
| Day trip | 100 pts |
| Heartwood dessert | 50 pts |
| Staycation | 150 pts |
| Streak freeze token | 60 pts |
| $10 gift card | 100 pts |
| Hibachi night | 75 pts |
| Your choice of dinner | 50 pts |
| You pick movie for movie night | 25 pts |

**Reward management (parent mode):**
- Add, edit, remove rewards
- Set point costs
- View redemption history

### 5. Family Dashboard

A shared view (maybe the landing page) showing:
- Both kids' pets side-by-side with their current mood and level
- Family streak counter
- Today's activity summary (who did what)
- Leaderboard (friendly — "Elise is on fire this week!" not competitive shaming)
- Weekly point totals per kid

---

## Tech Stack

- **Framework**: Next.js (App Router)
- **Styling**: Tailwind CSS
- **Database**: Supabase (PostgreSQL + real-time subscriptions)
- **Deployment**: Vercel
- **Auth**: None for kids (profile selection). Simple PIN for parent mode.
- **Animations**: Framer Motion for pet animations, confetti, streak celebrations

---

## Database Schema (Supabase)

### `profiles`
| Column | Type | Notes |
|--------|------|-------|
| id | uuid | PK |
| name | text | "Elise", "Charlotte" |
| role | text | "kid" or "parent" |
| pet_type | text | e.g. "red_panda", "arctic_fox" |
| pet_name | text | User-chosen |
| lifetime_points | int | Running total (never decreases) |
| current_points | int | Spendable balance |
| current_streak | int | Current consecutive days |
| longest_streak | int | Personal best |
| streak_freezes | int | Available freeze tokens |
| created_at | timestamp | |

### `chores`
| Column | Type | Notes |
|--------|------|-------|
| id | uuid | PK |
| name | text | |
| points | int | |
| frequency | text | "daily", "per_meal", "as_needed" |
| icon | text | Emoji or icon name |
| is_active | bool | Soft delete |
| sort_order | int | Display order |

### `chore_completions`
| Column | Type | Notes |
|--------|------|-------|
| id | uuid | PK |
| profile_id | uuid | FK → profiles |
| chore_id | uuid | FK → chores |
| completed_at | timestamp | |
| points_earned | int | Snapshot of points at time of completion |

### `rewards`
| Column | Type | Notes |
|--------|------|-------|
| id | uuid | PK |
| name | text | |
| cost | int | Points required |
| icon | text | Emoji or icon name |
| is_active | bool | |
| sort_order | int | |
| profile_id | uuid | FK → profiles, nullable. NULL = available to all, set = kid-specific reward |

### `reward_redemptions`
| Column | Type | Notes |
|--------|------|-------|
| id | uuid | PK |
| profile_id | uuid | FK → profiles |
| reward_id | uuid | FK → rewards |
| redeemed_at | timestamp | |
| points_spent | int | |

### `streak_history`
| Column | Type | Notes |
|--------|------|-------|
| id | uuid | PK |
| profile_id | uuid | FK → profiles |
| date | date | Calendar date |
| chores_completed | int | Count for the day |
| points_earned | int | Total for the day |
| streak_frozen | bool | Was a freeze used? |

---

## Page Structure

```
/                    → Family dashboard (landing page)
/[name]              → Kid's personal dashboard (e.g., /elise, /charlotte)
/[name]/chores       → Chore list to complete
/[name]/rewards      → Reward store
/[name]/pet          → Full pet view with stats
/parent              → Parent admin panel (PIN protected)
/parent/chores       → Manage chore list
/parent/rewards      → Manage reward list
/parent/history      → View all activity
```

---

## UI/UX Notes

- **Mobile-first** design (iPad is primary device)
- Big, tappable buttons — kid-friendly touch targets
- Bright, cheerful color palette (but not garish)
- Satisfying animations on chore completion (checkmark, points flying up, pet reacts)
- The pet should be visible/present on most screens as a small companion
- Daily reset happens at midnight local time (Eastern)
- Use fun language: "Awesome job!" "Your pet is so happy!" rather than dry labels
- Consider sound effects (optional toggle) for chore completion and level-ups

---

## Nice-to-Have (Phase 2)

- Push notifications / reminders ("Your streak is at risk!")
- Weekly summary email to parents
- Photo proof option for chores
- Seasonal pet costumes / holiday themes
- Achievement badges beyond streaks
- Dark mode
- Multiple families (if you want to share the app)
