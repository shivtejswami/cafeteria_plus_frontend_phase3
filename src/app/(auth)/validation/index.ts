export interface PasswordStrength {
  length: boolean;
  number: boolean;
  symbol: boolean;
  isValid: boolean;
}

export function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export function checkPasswordStrength(password: string): PasswordStrength {
  const length = password.length >= 8;
  const number = /\d/.test(password);
  const symbol = /[^a-zA-Z0-9]/.test(password);

  return { length, number, symbol, isValid: length && number && symbol };
}

/**
 * Builds the "Password needs …" message from whichever rules are unmet.
 * Returns null when the password already satisfies every rule.
 */
export function describePasswordGaps(strength: PasswordStrength): string | null {
  if (strength.isValid) return null;

  const missing: string[] = [];
  if (!strength.length) missing.push('at least 8 characters');
  if (!strength.number) missing.push('a number');
  if (!strength.symbol) missing.push('a symbol');

  return `Password needs ${missing.join(', ')}.`;
}
