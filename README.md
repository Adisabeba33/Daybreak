# Daybreak 🌅

A morning day-planning app. Each morning you spend a few seconds — a couple of
taps (voice later) — writing down what you want to get done. Through the day
Daybreak shows your progress, nudges you gently, and wraps up with a short
recap. The goal isn't a feature-packed to-do list; it's **building the habit of
planning your day**.

## The idea

Three states, one per part of the day:

| Phase     | Screen                                                                 |
| --------- | --------------------------------------------------------------------- |
| ☀️ Morning | **"What's today?"** — quick task entry + carry over yesterday's leftovers |
| ✅ Day     | Checklist with checkboxes + a big progress ring                       |
| 🌙 Evening | A short summary — *"Done 5 of 7 — great going 🎉"* + streak nudge       |

### What keeps you coming back

- **Praise the act, not just perfection.** The first check-off is celebrated, not only 100%.
- **Streak is the hero.** A day counts toward your streak as soon as you complete *any* task — the point is to not break the chain.
- **Gentle, not naggy.** Smart, context-aware reminders (Phase 2) instead of a fixed alarm.

## Data model (built for the whole roadmap on day one)

The model is designed once so Phase 2 features light up without a migration.
See [`src/types.ts`](src/types.ts).

- **`Task`** — text, status (`todo` / `doing` / `done`), priority, optional time estimate.
- **`Plan`** — a container of tasks **plus `period: "day" | "week" | "month"`**.
  Day / week / month are **not three features** — they're **one feature with a
  `period` parameter**. The MVP only ever creates `day` plans; week and month
  come for free later.
- **`Progress` / `StreakState` / `DayRecord`** — completion, streak, and history.

## MVP scope (Phase 1 — this repo)

1. Morning task entry (+ carry-over of yesterday's unfinished tasks)
2. Checklist with checkboxes + big progress ring
3. One evening summary / wrap-up
4. Streak counter

**Deferred to Phase 2+** (model already supports them):

- Week & month plans (flip `period`)
- Smart, context-aware reminders (e.g. a midday "half the day's gone — how's it going?")
- LLM-generated motivation copy (so it never feels templated — see [`src/lib/motivation.ts`](src/lib/motivation.ts))
- Cloud sync + push notifications (Supabase/Firebase) — **push is what makes reminders work**

## Stack

- **React + TypeScript + Vite** — fast web MVP, immediately runnable.
- **`localStorage`** for persistence (one versioned JSON blob; see [`src/lib/storage.ts`](src/lib/storage.ts)).
- Domain logic is **pure and unit-tested** ([`src/lib/`](src/lib/)) so the habit
  rules (streak, carry-over, progress) don't drift.

**Phase 2 direction:** move persistence behind **Supabase or Firebase** for sync
and **push notifications** (critical for reminders), and consider **React Native**
to ship native iOS/Android from the same model and logic. The storage module is
the seam where that swap happens.

## Project layout

```
src/
  types.ts            # the data model (day 1, whole roadmap)
  lib/
    date.ts           # day keys, phase-of-day
    plan.ts           # pure domain logic: progress, streak, carry-over
    motivation.ts     # encouragement copy (LLM-ready seam)
    storage.ts        # localStorage persistence (cloud seam)
    *.test.ts         # unit tests for the rules
  hooks/usePlan.ts    # the one stateful hook the UI talks to
  components/         # ProgressRing, TaskList, TaskInput, StreakBadge
  views/              # MorningView, DayView, EveningView
  App.tsx             # phase routing
```

## Getting started

```bash
npm install
npm run dev      # start the dev server
npm test         # run the unit tests
npm run build    # type-check + production build
```

## Roadmap

- **Phase 1 (now):** day plan, checklist + ring, evening summary, streak. ✅
- **Phase 2:** cloud sync + push notifications, smart reminders, LLM motivation.
- **Phase 3:** week & month plans (flip `period`), richer history & insights.
