'use client';

import NotificationToggle from './NotificationToggle';

interface NotificationItemRowProps {
  id: string;
  label: string;
  description: string;
  locked: boolean;
  lockReason?: string;
  email: boolean;
  inapp: boolean;
  onEmailChange: () => void;
  onInappChange: () => void;
  isFirst: boolean;
}

export default function NotificationItemRow({
  id,
  label,
  description,
  locked,
  lockReason,
  email,
  inapp,
  onEmailChange,
  onInappChange,
  isFirst,
}: NotificationItemRowProps) {
  return (
    <div className={`flex items-center gap-3 sm:gap-6 py-4 ${!isFirst ? '' : ''} ${isFirst ? 'border-borderTop-0' : 'border-t border-t-surface-100'}`}
    >
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 flex-wrap">
          <span
            className={`text-[14px] font-medium ${locked ? 'text-subtle' : 'text-ink'}`}
          >
            {label}
          </span>
          {locked && (
            <span
              className="inline-flex items-center h-5 px-2 rounded-full text-[11px] font-semibold whitespace-nowrap bg-canvas text-subtle border border-line"
            >
              Always on
            </span>
          )}
        </div>
        <p className={`text-[13px] mt-1 leading-relaxed ${locked ? 'text-[#b5b5b5]' : 'text-muted'}`}>
          {description}
        </p>
        {locked && lockReason && (
          <p className="flex items-center gap-1.5 mt-1.5 text-[12px] text-subtle">
            <span className="w-3.5 h-3.5 flex items-center justify-center flex-shrink-0">
              <i className="ri-lock-line text-sm"></i>
            </span>
            {lockReason}
          </p>
        )}
      </div>

      <div className="flex items-center gap-3 sm:gap-6 shrink-0">
        <NotificationToggle
          checked={email}
          onChange={onEmailChange}
          disabled={locked}
          label="Email"
          channel="email"
        />
        <NotificationToggle
          checked={inapp}
          onChange={onInappChange}
          disabled={locked}
          label="In-app"
          channel="inapp"
        />
      </div>
    </div>
  );
}