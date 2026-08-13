'use client';

const SIGNALS_KEY_PREFIX = 'cp_signals_';

export interface UnusualSignals {
  completionTimeMs: number;
  submissionCount: number;
  escapeCount: number;
  rateLimitTrips: number;
  straightLining: boolean;
}

function getSignalsKey(schoolCode: string): string {
  return `${SIGNALS_KEY_PREFIX}${schoolCode}`;
}

export function startTiming(schoolCode: string): void {
  if (typeof window === 'undefined') return;
  const key = `cp_survey_start_${schoolCode}`;
  if (!localStorage.getItem(key)) {
    localStorage.setItem(key, String(Date.now()));
  }
}

export function endTiming(schoolCode: string): number {
  if (typeof window === 'undefined') return 0;
  const key = `cp_survey_start_${schoolCode}`;
  const start = parseInt(localStorage.getItem(key) || '0');
  const end = Date.now();
  localStorage.removeItem(key);
  return start ? end - start : 0;
}

export function detectStraightLining(threePointAnswers: string[]): boolean {
  if (threePointAnswers.length < 4) return false;
  const first = threePointAnswers[0];
  if (!first) return false;
  return threePointAnswers.every((a) => a === first);
}

export function recordSignals(schoolCode: string, signals: UnusualSignals): void {
  if (typeof window === 'undefined') return;
  const key = getSignalsKey(schoolCode);
  try {
    const existing = localStorage.getItem(key);
    let all: UnusualSignals[] = [];
    if (existing) all = JSON.parse(existing);
    all.push(signals);
    if (all.length > 50) all = all.slice(-50);
    localStorage.setItem(key, JSON.stringify(all));
  } catch {
  }
}

export function clearSignals(schoolCode: string): void {
  if (typeof window === 'undefined') return;
  localStorage.removeItem(getSignalsKey(schoolCode));
  localStorage.removeItem(`cp_survey_start_${schoolCode}`);
}