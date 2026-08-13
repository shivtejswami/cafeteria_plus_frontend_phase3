'use client';

const TOKEN_PREFIX = 'cp_survey_token_';

export function getTokenKey(schoolCode: string): string {
  return `${TOKEN_PREFIX}${schoolCode}`;
}

export function hasSubmitted(schoolCode: string): boolean {
  if (typeof window === 'undefined') return false;
  const key = getTokenKey(schoolCode);
  const token = localStorage.getItem(key);
  return token !== null;
}

export function writeToken(schoolCode: string): void {
  if (typeof window === 'undefined') return;
  const key = getTokenKey(schoolCode);
  const token = crypto.randomUUID();
  localStorage.setItem(key, token);
}

export function clearToken(schoolCode: string): void {
  if (typeof window === 'undefined') return;
  const key = getTokenKey(schoolCode);
  localStorage.removeItem(key);
}

export function recordEscape(schoolCode: string): void {
  if (typeof window === 'undefined') return;
  const key = `cp_survey_escape_${schoolCode}`;
  const current = parseInt(localStorage.getItem(key) || '0');
  localStorage.setItem(key, String(current + 1));
}

export function getEscapeCount(schoolCode: string): number {
  if (typeof window === 'undefined') return 0;
  const key = `cp_survey_escape_${schoolCode}`;
  return parseInt(localStorage.getItem(key) || '0');
}