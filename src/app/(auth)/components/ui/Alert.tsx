import type { ReactNode } from 'react';
import { AlertCircle, AlertTriangle, Mail, Timer, WifiOff } from 'lucide-react';

type AlertTone = 'danger' | 'warning' | 'caution';
type AlertSize = 'sm' | 'md';

interface AlertProps {
  tone: AlertTone;
  /** Remix Icon or icon string, e.g. "ri-error-warning-line". */
  icon: string;
  /** Optional bold first line. */
  title?: string;
  children?: ReactNode;
  size?: AlertSize;
  /** Inline recovery action rendered under the message. */
  action?: { label: string; onClick: () => void };
  className?: string;
  live?: boolean;
}

const TEXT_SIZE: Record<AlertSize, string> = {
  sm: 'text-[13px] sm:text-sm',
  md: 'text-[13px] sm:text-sm',
};

const ALERT_SIZE_CLASSES: Record<AlertSize, string> = {
  sm: 'gap-2.5 p-2.5 sm:p-3',
  md: 'gap-2.5 sm:gap-3 p-3 sm:p-3.5',
};

const ALERT_TONE_CLASSES: Record<AlertTone, string> = {
  danger: 'bg-[#FDEAEA] border border-[#F0B0AE] text-[#A3201D]',
  warning: 'bg-[#FFF1DD] border border-[#FCD585] text-[#8A4B04]',
  caution: 'bg-[#FFF8EE] border border-[#FCE4B4] text-[#8A4B04]',
};

const ICON_TONE_CLASSES: Record<AlertTone, string> = {
  danger: 'text-[#D8201D]',
  warning: 'text-[#8A4B04]',
  caution: 'text-[#8A4B04]',
};

export function Alert({
  tone,
  icon,
  title,
  children,
  size = 'md',
  action,
  className = '',
  live = false,
}: AlertProps) {
  const getIcon = () => {
    if (icon.includes('mail')) return <Mail className="w-5 h-5" />;
    if (icon.includes('timer')) return <Timer className="w-5 h-5" />;
    if (icon.includes('wifi')) return <WifiOff className="w-5 h-5" />;
    if (tone === 'warning' || tone === 'caution') return <AlertTriangle className="w-5 h-5" />;
    return <AlertCircle className="w-5 h-5" />;
  };

  return (
    <div
      className={`flex items-start rounded-xl ${ALERT_SIZE_CLASSES[size]} ${ALERT_TONE_CLASSES[tone]} ${className}`.trim()}
      role="alert"
      aria-live={live ? 'polite' : undefined}
    >
      <span
        className={`w-5 h-5 flex items-center justify-center flex-shrink-0 mt-0.5 ${ICON_TONE_CLASSES[tone]}`}
      >
        {getIcon()}
      </span>
      <div className="flex-1 min-w-0">
        {title && <p className={`${TEXT_SIZE[size]} leading-snug font-medium`}>{title}</p>}
        {children && (
          <div className={`${TEXT_SIZE[size]} leading-snug ${title ? 'mt-0.5' : ''}`}>{children}</div>
        )}
        {action && (
          <button
            type="button"
            onClick={action.onClick}
            className="text-xs font-semibold mt-1.5 text-[#6d28d9] transition-colors duration-150 hover:opacity-80 rounded focus:outline-none focus-visible:ring-2 focus-visible:ring-[#6d28d9] focus-visible:ring-offset-2"
          >
            {action.label}
          </button>
        )}
      </div>
    </div>
  );
}
