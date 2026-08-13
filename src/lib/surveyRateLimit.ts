'use client';

const RATE_LIMIT_WINDOW_MS = 30000;
const MAX_SUBMISSIONS_PER_WINDOW = 3;

interface SubmissionEntry {
  timestamp: number;
}

function getRateLimitKey(schoolCode: string): string {
  return `cp_survey_rl_${schoolCode}`;
}

export function checkRateLimit(schoolCode: string): { allowed: boolean; waitMs: number } {
  if (typeof window === 'undefined') return { allowed: true, waitMs: 0 };
  const key = getRateLimitKey(schoolCode);
  const now = Date.now();
  const windowStart = now - RATE_LIMIT_WINDOW_MS;

  let entries: SubmissionEntry[] = [];
  try {
    const raw = localStorage.getItem(key);
    if (raw) entries = JSON.parse(raw);
  } catch {
    entries = [];
  }

  const recent = entries.filter((e) => e.timestamp > windowStart);

  if (recent.length >= MAX_SUBMISSIONS_PER_WINDOW) {
    const oldestInWindow = recent.reduce(
      (min, e) => (e.timestamp < min ? e.timestamp : min),
      recent[0].timestamp
    );
    const waitMs = oldestInWindow + RATE_LIMIT_WINDOW_MS - now;
    return { allowed: false, waitMs: Math.max(1000, waitMs) };
  }

  return { allowed: true, waitMs: 0 };
}

export function recordSubmission(schoolCode: string): void {
  if (typeof window === 'undefined') return;
  const key = getRateLimitKey(schoolCode);
  const now = Date.now();

  let entries: SubmissionEntry[] = [];
  try {
    const raw = localStorage.getItem(key);
    if (raw) entries = JSON.parse(raw);
  } catch {
    entries = [];
  }

  entries.push({ timestamp: now });
  const windowStart = now - RATE_LIMIT_WINDOW_MS * 2;
  const pruned = entries.filter((e) => e.timestamp > windowStart);

  try {
    localStorage.setItem(key, JSON.stringify(pruned));
  } catch {
  }
}

export function recordRateLimitTrip(schoolCode: string): void {
  if (typeof window === 'undefined') return;
  const key = `cp_survey_rl_trips_${schoolCode}`;
  const current = parseInt(localStorage.getItem(key) || '0');
  localStorage.setItem(key, String(current + 1));
}

export function getRateLimitTrips(schoolCode: string): number {
  if (typeof window === 'undefined') return 0;
  const key = `cp_survey_rl_trips_${schoolCode}`;
  return parseInt(localStorage.getItem(key) || '0');
}