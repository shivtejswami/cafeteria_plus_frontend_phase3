import type { InputHTMLAttributes } from 'react';

export interface TextFieldProps extends InputHTMLAttributes<HTMLInputElement> {
  id: string;
  label: string;
  error?: string;
  hint?: string;
  locked?: boolean;
  invalid?: boolean;
  wrapperClassName?: string;
}

export function TextField({
  id,
  label,
  error,
  hint,
  locked = false,
  invalid = false,
  wrapperClassName = 'mb-4',
  ...input
}: TextFieldProps) {
  const errorId = `${id}-error`;
  const hintId = `${id}-hint`;
  const isInvalid = invalid || Boolean(error);

  return (
    <div className={wrapperClassName}>
      <label htmlFor={id} className="block text-sm font-medium mb-1.5 text-[#2b2b2b]">
        {label}
      </label>
      <input
        {...input}
        id={id}
        aria-invalid={isInvalid || undefined}
        aria-describedby={error ? errorId : hint ? hintId : undefined}
        className={[
          // text-base on mobile stops iOS Safari zooming in on focus.
          'w-full h-11 px-3.5 sm:px-4 rounded-xl text-base sm:text-sm border transition-all duration-150 focus:outline-none focus:ring-0 disabled:cursor-not-allowed',
          locked ? 'bg-[#f5f3f0] text-[#9a9a9a] cursor-default' : 'bg-white text-[#2b2b2b] disabled:bg-[#f5f3f0]',
          isInvalid ? 'border-[#f0b0ae]' : 'border-[#e8e6e1]',
        ].join(' ')}
      />
      {error ? (
        <p id={errorId} className="text-xs mt-1.5 text-[#d8201d]" role="alert">
          {error}
        </p>
      ) : hint ? (
        <p id={hintId} className="text-xs mt-1.5 text-[#9a9a9a]">
          {hint}
        </p>
      ) : null}
    </div>
  );
}
