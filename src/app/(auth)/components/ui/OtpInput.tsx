'use client';

import { useRef } from 'react';
import type { ClipboardEvent, KeyboardEvent } from 'react';

import { OTP_LENGTH } from '@/app/(auth)/constants';

interface OtpInputProps {
  value: string[];
  onChange: (digits: string[]) => void;
  error: boolean;
  disabled?: boolean;
  label?: string;
}

const SLOTS = Array.from({ length: OTP_LENGTH }, (_, index) => index);
const GROUP_BREAK = Math.floor(OTP_LENGTH / 2) - 1;

export function createEmptyCode(): string[] {
  return Array.from({ length: OTP_LENGTH }, () => '');
}

export function OtpInput({ value, onChange, error, disabled, label = 'Verification code' }: OtpInputProps) {
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  const focusSlot = (index: number) => {
    inputRefs.current[index]?.focus();
  };

  const handleChange = (index: number, char: string) => {
    if (!/^\d*$/.test(char)) return;

    const next = [...value];
    next[index] = char.slice(-1);
    onChange(next);

    if (char && index < OTP_LENGTH - 1) focusSlot(index + 1);
  };

  const handleKeyDown = (index: number, event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Backspace') {
      const next = [...value];

      if (!value[index] && index > 0) {
        next[index - 1] = '';
        onChange(next);
        focusSlot(index - 1);
      } else if (value[index]) {
        next[index] = '';
        onChange(next);
      }
      return;
    }

    if (event.key === 'ArrowLeft' && index > 0) focusSlot(index - 1);
    if (event.key === 'ArrowRight' && index < OTP_LENGTH - 1) focusSlot(index + 1);
  };

  const handlePaste = (event: ClipboardEvent<HTMLInputElement>) => {
    event.preventDefault();
    const pasted = event.clipboardData.getData('text').replace(/\D/g, '').slice(0, OTP_LENGTH);
    if (!pasted) return;

    const next = SLOTS.map((index) => pasted[index] ?? value[index] ?? '');
    onChange(next);
    focusSlot(Math.min(pasted.length, OTP_LENGTH - 1));
  };

  return (
    <div className="flex justify-center gap-1.5 sm:gap-2 w-full" role="group" aria-label={label}>
      {SLOTS.map((index) => (
        <input
          key={index}
          ref={(element) => {
            inputRefs.current[index] = element;
          }}
          type="text"
          inputMode="numeric"
          autoComplete="one-time-code"
          maxLength={1}
          value={value[index] ?? ''}
          disabled={disabled}
          aria-label={`Digit ${index + 1} of ${OTP_LENGTH}`}
          aria-invalid={error || undefined}
          onChange={(event) => handleChange(index, event.target.value)}
          onKeyDown={(event) => handleKeyDown(index, event)}
          onPaste={index === 0 ? handlePaste : undefined}
          className={[
            'min-w-0 flex-1 max-w-12 h-11 sm:h-12 text-center text-lg sm:text-2xl font-semibold rounded-lg sm:rounded-xl border-2 transition-all duration-150 focus:outline-none focus:ring-0',
            error ? 'bg-[#fdeaea] text-[#a3201d] border-[#f0b0ae]' : 'bg-white text-[#2b2b2b] border-[#e8e6e1]',
            index === GROUP_BREAK ? 'mr-0.5 sm:mr-1.5' : '',
          ]
            .filter(Boolean)
            .join(' ')}
        />
      ))}
    </div>
  );
}
