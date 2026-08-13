import { useState } from 'react';
import type { InputHTMLAttributes, ReactNode } from 'react';

export interface PasswordFieldProps extends InputHTMLAttributes<HTMLInputElement> {
  id: string;
  label: string;
  error?: string;
  invalid?: boolean;
  wrapperClassName?: string;
  footer?: ReactNode;
  describedBy?: string;
}

export function PasswordField({
  id,
  label,
  error,
  invalid = false,
  wrapperClassName = 'mb-4',
  footer,
  describedBy,
  disabled,
  ...input
}: PasswordFieldProps) {
  const [revealed, setRevealed] = useState(false);
  const errorId = `${id}-error`;
  const footerId = `${id}-footer`;
  const isInvalid = invalid || Boolean(error);

  return (
    <div className={wrapperClassName}>
      <label htmlFor={id} className="block text-sm font-medium mb-1.5 text-[#2b2b2b]">
        {label}
      </label>
      <div className="relative">
        <input
          {...input}
          id={id}
          type={revealed ? 'text' : 'password'}
          disabled={disabled}
          aria-invalid={isInvalid || undefined}
          aria-describedby={error ? errorId : describedBy ?? (footer ? footerId : undefined)}
          className={[
            // text-base on mobile stops iOS Safari zooming in on focus.
            'w-full h-11 px-3.5 sm:px-4 rounded-xl text-base sm:text-sm border transition-all duration-150 focus:outline-none focus:ring-0 disabled:cursor-not-allowed',
            'pr-10',
            'bg-white text-[#2b2b2b] disabled:bg-[#f5f3f0]',
            isInvalid ? 'border-[#f0b0ae]' : 'border-[#e8e6e1]',
          ].join(' ')}
        />
        <button
          type="button"
          onClick={() => setRevealed((current) => !current)}
          disabled={disabled}
          className="absolute right-1.5 top-1/2 -translate-y-1/2 w-8 h-8 flex items-center justify-center text-[#9a9a9a] hover:text-[#6d6d6d] rounded focus:outline-none focus-visible:ring-2 focus-visible:ring-[#6d28d9] focus-visible:ring-offset-2 cursor-pointer"
          aria-label={revealed ? 'Hide password' : 'Show password'}
        >
          <i className={revealed ? 'ri-eye-off-line' : 'ri-eye-line'} aria-hidden="true" />
        </button>
      </div>
      {error ? (
        <p id={errorId} className="text-xs mt-1.5 text-[#d8201d]" role="alert">
          {error}
        </p>
      ) : footer ? (
        <div id={footerId} className="mt-1.5">
          {footer}
        </div>
      ) : null}
    </div>
  );
}
