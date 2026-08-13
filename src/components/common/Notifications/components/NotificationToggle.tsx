'use client';

interface NotificationToggleProps {
  checked: boolean;
  onChange: () => void;
  disabled?: boolean;
  label: string;
  channel: 'email' | 'inapp';
}

export default function NotificationToggle({ checked, onChange, disabled, label, channel }: NotificationToggleProps) {
  return (
    <div className="flex flex-col items-center gap-2">
      <span
        className={`text-[11px] font-medium uppercase tracking-wide ${disabled ? 'text-subtle' : 'text-muted'}`}
      >
        {label}
      </span>
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        aria-label={`${label} ${channel === 'email' ? 'email' : 'in-app'} notifications ${checked ? 'on' : 'off'}`}
        disabled={disabled}
        onClick={() => onChange()}
        className={`relative w-11 h-6 rounded-full flex-shrink-0 transition-colors duration-150 focus:outline-none focus-visible:ring-2 focus-visible:ring-iris focus-visible:ring-offset-1 ${disabled ? 'cursor-not-allowed' : 'cursor-pointer'} ${disabled ? 'opacity-55' : 'opacity-100'} ${checked ? disabled ? 'bg-[#a3b59e]' : 'bg-sage' : 'bg-faint-400'}`}
      >
        <span
          className={`absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white transition-transform duration-150 shadow-sm ${checked ? '[transform:translateX(20px)]' : '[transform:translateX(0)]'}`}
        />
      </button>
    </div>
  );
}