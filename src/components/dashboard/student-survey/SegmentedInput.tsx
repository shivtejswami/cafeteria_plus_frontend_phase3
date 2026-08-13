'use client';

import { useRef, useState, useCallback, useEffect } from 'react';

interface SegmentedInputProps {
  length?: number;
  value: string;
  onChange: (value: string) => void;
  error?: boolean;
  disabled?: boolean;
  size?: 'large' | 'medium';
  numeric?: boolean;
}

export default function SegmentedInput({
  length = 6,
  value,
  onChange,
  error = false,
  disabled = false,
  size = 'large',
  numeric = false,
}: SegmentedInputProps) {
  const [chars, setChars] = useState(() => value.split('').concat(Array(length).fill('')).slice(0, length));
  const inputsRef = useRef<HTMLInputElement[]>([]);
  const charsRef = useRef(chars);

  useEffect(() => {
    charsRef.current = chars;
  }, [chars]);

  useEffect(() => {
    const next = value.split('').concat(Array(length).fill('')).slice(0, length);
    if (next.join('') !== charsRef.current.join('')) {
      setChars(next);
    }
  }, [value, length]);

  const update = useCallback(
    (newChars: string[]) => {
      setChars(newChars);
      onChange(newChars.join(''));
    },
    [onChange]
  );

  const [focusedIndex, setFocusedIndex] = useState(-1);

  const focusIndex = useCallback((i: number) => {
    if (i >= 0 && i < length && inputsRef.current[i]) {
      inputsRef.current[i].focus();
      inputsRef.current[i].select();
    }
  }, [length]);

  const handleKeyDown = useCallback(
    (i: number, e: React.KeyboardEvent<HTMLInputElement>) => {
      if (disabled) return;
      const newChars = [...chars];

      if (e.key === 'Backspace') {
        e.preventDefault();
        if (newChars[i]) {
          newChars[i] = '';
          update(newChars);
        } else if (i > 0) {
          newChars[i - 1] = '';
          update(newChars);
          focusIndex(i - 1);
        }
      } else if (e.key === 'ArrowLeft') {
        e.preventDefault();
        focusIndex(i - 1);
      } else if (e.key === 'ArrowRight') {
        e.preventDefault();
        focusIndex(i + 1);
      } else if (e.key === 'Home') {
        e.preventDefault();
        focusIndex(0);
      } else if (e.key === 'End') {
        e.preventDefault();
        focusIndex(length - 1);
      } else if (e.key === 'Delete') {
        e.preventDefault();
        newChars[i] = '';
        update(newChars);
      }
    },
    [chars, disabled, focusIndex, length, update]
  );

  const handleChange = useCallback(
    (i: number, e: React.ChangeEvent<HTMLInputElement>) => {
      if (disabled) return;
      const raw = e.target.value;
      const newChars = [...chars];

      if (raw.length > 1) {
        const incoming = raw.split('').slice(0, length - i);
        incoming.forEach((ch, idx) => {
          if (i + idx < length) newChars[i + idx] = ch.toUpperCase();
        });
        update(newChars);
        const nextFocus = Math.min(i + incoming.length, length - 1);
        setTimeout(() => focusIndex(nextFocus), 0);
        return;
      }

      const ch = raw.toUpperCase();
      newChars[i] = ch;
      update(newChars);

      if (ch && i < length - 1) {
        focusIndex(i + 1);
      }
    },
    [chars, disabled, focusIndex, length, update]
  );

  const handlePaste = useCallback(
    (i: number, e: React.ClipboardEvent<HTMLInputElement>) => {
      if (disabled) return;
      e.preventDefault();
      const paste = e.clipboardData.getData('text').replace(/\s/g, '').toUpperCase();
      if (!paste) return;

      const newChars = [...chars];
      const incoming = paste.split('').slice(0, length - i);
      incoming.forEach((ch, idx) => {
        if (i + idx < length) newChars[i + idx] = ch;
      });
      update(newChars);
      const nextFocus = Math.min(i + incoming.length, length - 1);
      setTimeout(() => focusIndex(nextFocus), 0);
    },
    [chars, disabled, focusIndex, length, update]
  );

  const setRef = useCallback(
    (i: number) => (el: HTMLInputElement | null) => {
      if (el) inputsRef.current[i] = el;
    },
    []
  );

  const isMedium = size === 'medium';

  return (
    <div
      className="flex items-center justify-center gap-3 sm:gap-4 flex-wrap"
      role="group"
      aria-label="Access code"
    >
      {chars.map((ch, i) => {
        const isFilled = !!ch && !error;
        const isFocusedBox = focusedIndex === i;

        const baseClasses = isMedium
          ? 'w-[48px] h-[52px] sm:w-[52px] sm:h-[56px] text-center text-[22px] sm:text-[24px] font-bold rounded-[16px] border-2 outline-none transition-all duration-150 flex items-center justify-center'
          : 'w-[56px] h-[64px] sm:w-[64px] sm:h-[72px] text-center text-[26px] sm:text-[30px] font-bold rounded-2xl border-2 outline-none transition-all duration-150 flex items-center justify-center';

        let boxClasses = baseClasses;

        if (disabled) {
          boxClasses += ' bg-[#f0f0ee] text-faint border-[#e0ded9] cursor-not-allowed';
        } else if (error) {
          boxClasses += ' bg-white text-ink border-brick';
          if (isFocusedBox) boxClasses += ' ring-4 ring-brick/15 border-brick';
        } else if (isFilled) {
          boxClasses += ' bg-sage-50 text-ink border-sage';
          if (isFocusedBox) boxClasses += ' ring-4 ring-sage/15 border-sage';
        } else {
          boxClasses += ' bg-white text-ink border-[#d8d5ce]';
          if (isFocusedBox) boxClasses += ' ring-4 ring-iris/15 border-iris';
        }

        return (
          <input
            key={i}
            ref={setRef(i)}
            type="text"
            inputMode={numeric ? 'numeric' : 'text'}
            autoComplete="off"
            autoCorrect="off"
            autoCapitalize="characters"
            spellCheck={false}
            maxLength={1}
            disabled={disabled}
            value={ch}
            onChange={(e) => handleChange(i, e)}
            onKeyDown={(e) => handleKeyDown(i, e)}
            onPaste={(e) => handlePaste(i, e)}
            onFocus={() => setFocusedIndex(i)}
            onBlur={() => setFocusedIndex((prev) => (prev === i ? -1 : prev))}
            className={`${boxClasses} ${disabled ? 'shadow-none' : isFilled && !error ? 'shadow-[0_2px_8px_rgba(88,109,77,0.14)]' : 'shadow-[0_2px_8px_rgba(0,0,0,0.04)]'}`}
            aria-label={`Character ${i + 1} of ${length}`}
          />
        );
      })}
    </div>
  );
}