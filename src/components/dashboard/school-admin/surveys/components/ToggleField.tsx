'use client';

interface ToggleFieldProps {
  id: string;
  label: string;
  helper: string;
  checked: boolean;
  onChange: (v: boolean) => void;
  disabled?: boolean;
}

export default function ToggleField({ id, label, helper, checked, onChange, disabled }: ToggleFieldProps) {
  return (
    <div className="flex items-start gap-3">
      <button
        id={id}
        type="button"
        role="switch"
        aria-checked={checked}
        disabled={disabled}
        onClick={() => onChange(!checked)}
        className={`relative w-11 h-6 rounded-full flex-shrink-0 transition-colors duration-150 focus:outline-none focus:ring-0 focus-visible:outline-none focus-visible:ring-0 whitespace-nowrap ${disabled ? 'opacity-40 cursor-not-allowed' : 'cursor-pointer'} ${checked ? 'bg-[#586D4D]' : 'bg-[#9A9A9A]'}`}
      >
        <span
          className={`absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white transition-transform duration-150 shadow-md ${checked ? 'translate-x-5' : 'translate-x-0'}`}
        />
      </button>
      <div className="flex-1 min-w-0">
        <label htmlFor={id} className="text-[14px] font-medium text-ink">
          {label}
        </label>
        <p className="text-[13px] mt-0.5 leading-relaxed text-muted-500">
          {helper}
        </p>
      </div>
    </div>
  );
}