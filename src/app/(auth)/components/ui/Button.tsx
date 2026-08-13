import Link from 'next/link';
import type { ButtonHTMLAttributes, ReactNode } from 'react';

import { Spinner } from './Spinner';

export type ButtonVariant = 'primary' | 'secondary' | 'brand' | 'quiet';

const BUTTON_BASE =
  'flex items-center justify-center gap-2 w-full h-11 rounded-xl text-sm font-medium whitespace-nowrap border transition-all duration-150 hover:opacity-90 disabled:hover:opacity-100 disabled:cursor-not-allowed focus:outline-none focus-visible:ring-2 focus-visible:ring-[#6d28d9] focus-visible:ring-offset-2';

const BUTTON_VARIANTS: Record<ButtonVariant, string> = {
  primary: 'bg-[#506248] text-white border-[#506248] disabled:bg-[#506248]/60 disabled:border-transparent',
  secondary: 'bg-[#f2f5f0] text-[#586d4d] border-[#d6e0d2]',
  brand: 'bg-[#f5f0fa] text-[#6d28d9] border-[#e0d5f0]',
  quiet: 'bg-transparent text-[#6d6d6d] border-[#e8e6e1]',
};

function pillClasses(variant: ButtonVariant, compact: boolean, busy: boolean, extra?: string) {
  const tone =
    busy && variant === 'primary' ? 'bg-[#586d4d] text-white opacity-85' : BUTTON_VARIANTS[variant];

  return [BUTTON_BASE, tone, compact ? 'h-10 text-xs' : '', extra ?? '']
    .filter(Boolean)
    .join(' ');
}

interface ButtonProps extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'className'> {
  variant?: ButtonVariant;
  compact?: boolean;
  /** Shows a spinner and the busy label instead of the children. */
  busy?: boolean;
  busyLabel?: string;
  className?: string;
  children: ReactNode;
}

export function Button({
  variant = 'primary',
  compact = false,
  busy = false,
  busyLabel,
  className,
  children,
  type = 'button',
  disabled,
  ...rest
}: ButtonProps) {
  return (
    <button
      {...rest}
      type={type}
      disabled={disabled || busy}
      className={pillClasses(variant, compact, busy, className)}
    >
      {busy ? (
        <>
          <Spinner />
          {busyLabel ?? children}
        </>
      ) : (
        children
      )}
    </button>
  );
}

interface ButtonLinkProps {
  href: string;
  variant?: ButtonVariant;
  compact?: boolean;
  className?: string;
  onClick?: () => void;
  children: ReactNode;
}

/** Same pill as `Button`, for navigation. Falls back to `<a>` for mailto/tel links. */
export function ButtonLink({
  href,
  variant = 'primary',
  compact = false,
  className,
  onClick,
  children,
}: ButtonLinkProps) {
  const classes = pillClasses(variant, compact, false, className);

  if (/^(mailto:|tel:|https?:)/.test(href)) {
    return (
      <a href={href} className={classes} onClick={onClick}>
        {children}
      </a>
    );
  }

  return (
    <Link href={href} className={classes} onClick={onClick}>
      {children}
    </Link>
  );
}
