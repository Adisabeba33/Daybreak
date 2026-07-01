import type { AppState } from "../types";

/**
 * Persistence for MVP: a single versioned JSON blob in localStorage.
 * The `version` field is the seam for future migrations (and for swapping in
 * Supabase/Firebase in Phase 2 without touching call sites).
 */

const STORAGE_KEY = "daybreak.state.v1";
const CURRENT_VERSION = 1;

export function emptyState(): AppState {
  return {
    version: CURRENT_VERSION,
    plans: [],
    streak: { current: 0, longest: 0 },
    history: [],
  };
}

export function loadState(): AppState {
  if (typeof localStorage === "undefined") return emptyState();
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return emptyState();
    const parsed = JSON.parse(raw) as Partial<AppState>;
    // Shallow-merge onto a fresh state so missing fields get sane defaults.
    return { ...emptyState(), ...parsed, version: CURRENT_VERSION };
  } catch {
    return emptyState();
  }
}

export function saveState(state: AppState): void {
  if (typeof localStorage === "undefined") return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch {
    // Storage full or unavailable (private mode). Non-fatal for MVP.
  }
}
