'use client';

import { Check } from 'lucide-react';
import type { PasswordStrength } from '@/app/(auth)/validation';

interface PasswordRequirementsProps {
  strength: PasswordStrength;
  hasInput?: boolean;
  className?: string;
}

const RULES = [
  { key: 'length', label: '8+ characters' },
  { key: 'number', label: 'A number' },
  { key: 'symbol', label: 'A symbol' },
] as const;

export function PasswordRequirements({
  strength,
  hasInput = false,
  className = 'mt-2',
}: PasswordRequirementsProps) {
  return (
    <div className={className}>
      <p className="text-xs text-[#6d6d6d]">
        At least 8 characters, with a number and a symbol.
      </p>

      {hasInput && (
        <div className="flex flex-wrap items-center gap-x-5 gap-y-1.5 mt-1.5">
          {RULES.map(({ key, label }) => {
            const met = strength[key];
            return (
              <div
                key={key}
                className={`flex items-center gap-1.5 text-xs transition-colors duration-150 ${
                  met ? 'text-[#4e6344] font-medium' : 'text-[#6d6d6d]'
                }`}
              >
                <Check
                  className={`w-4 h-4 stroke-[2.5] shrink-0 transition-colors duration-150 ${
                    met ? 'text-[#4e6344]' : 'text-[#a0a0a0]'
                  }`}
                  aria-hidden="true"
                />
                <span>{label}</span>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
