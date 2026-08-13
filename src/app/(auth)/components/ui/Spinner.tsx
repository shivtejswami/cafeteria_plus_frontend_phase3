interface SpinnerProps {
  /** Tailwind size classes, e.g. "w-4 h-4". */
  className?: string;
}

export function Spinner({ className = 'w-4 h-4' }: SpinnerProps) {
  return (
    <svg
      className={`animate-spin ${className}`}
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      aria-hidden="true"
    >
      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
      <path
        className="opacity-75"
        fill="currentColor"
        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
      />
    </svg>
  );
}

interface LoadingBlockProps {
  label?: string;
}

/** Centred spinner used for route-level Suspense fallbacks and token checks. */
export function LoadingBlock({ label = 'Loading…' }: LoadingBlockProps) {
  return (
    <div className="flex flex-col items-center justify-center py-10 gap-4" role="status">
      <span className="text-[#586d4d]">
        <Spinner className="w-7 h-7" />
      </span>
      <p className="text-sm text-[#6d6d6d]">{label}</p>
    </div>
  );
}
