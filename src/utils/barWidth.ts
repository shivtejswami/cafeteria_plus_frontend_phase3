/**
 * Tailwind builds its classes by scanning source at build time, so a runtime
 * `w-[${percent}%]` would never be generated. Every width a meter can take is
 * therefore spelled out here as a literal class, and the value snaps to the
 * nearest 5% — invisible next to the exact figure these bars are always
 * labelled with.
 */
const WIDTH_CLASS: Record<number, string> = {
  0: 'w-0',
  5: 'w-[5%]',
  10: 'w-[10%]',
  15: 'w-[15%]',
  20: 'w-[20%]',
  25: 'w-[25%]',
  30: 'w-[30%]',
  35: 'w-[35%]',
  40: 'w-[40%]',
  45: 'w-[45%]',
  50: 'w-[50%]',
  55: 'w-[55%]',
  60: 'w-[60%]',
  65: 'w-[65%]',
  70: 'w-[70%]',
  75: 'w-[75%]',
  80: 'w-[80%]',
  85: 'w-[85%]',
  90: 'w-[90%]',
  95: 'w-[95%]',
  100: 'w-full',
};

/** Tailwind width class for a 0–100 percentage, snapped to the nearest 5%. */
export function barWidthClass(percent: number): string {
  if (!Number.isFinite(percent)) return WIDTH_CLASS[0];
  const clamped = Math.min(100, Math.max(0, percent));
  return WIDTH_CLASS[Math.round(clamped / 5) * 5];
}
