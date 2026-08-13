'use client';

import { useState, useRef, useEffect, useCallback } from 'react';

export interface FilterOption {
  value: string;
  label: string;
}

interface FilterDropdownProps {
  label: string;
  value: string;
  options: FilterOption[];
  onChange: (value: string) => void;
  defaultLabel?: string;
  /** The unfiltered value for this dropdown. The pill only highlights once the user moves off it. */
  defaultValue?: string;
  activeBorder?: string;
  activeText?: string;
}

export default function FilterDropdown({
  label,
  value,
  options,
  onChange,
  defaultLabel = 'All',
  defaultValue,
  activeBorder = 'border-iris',
  activeText = 'text-iris',
}: FilterDropdownProps) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const selected = options.find((o) => o.value === value);
  const isActive = defaultValue !== undefined
    ? value !== defaultValue
    : value !== '' && value !== defaultLabel;

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  const handleSelect = useCallback((optValue: string) => {
    onChange(optValue);
    setOpen(false);
  }, [onChange]);

  const displayValue = selected?.label || value;

  return (
    <div ref={ref} className="relative flex-shrink-0 min-w-0">
      <button
        onClick={() => setOpen(!open)}
        className={`flex items-center justify-between gap-1.5 h-9 pl-3.5 pr-2.5 rounded-full text-[13px] font-medium whitespace-nowrap transition-all duration-150 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#6d28d9] focus-visible:ring-offset-1 w-full ${isActive ? 'bg-iris-50' : 'bg-surface'} ${isActive ? 'text-iris-800' : 'text-muted'} shadow-hairline border ${isActive ? activeBorder : 'border-line'}`}
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-label={`${label}: ${displayValue}`}
      >
        <span className="truncate">
          <span className="text-[11px] font-normal text-subtle">{label}: </span>
          <span className={`truncate ${isActive ? 'text-iris-800' : 'text-ink'}`}>{displayValue}</span>
        </span>
        <span
          className={`w-4 h-4 flex items-center justify-center flex-shrink-0 transition-transform duration-150 ${open ? '[transform:rotate(180deg)]' : '[transform:rotate(0deg)]'} ${isActive ? activeText : 'text-subtle'}`}
        >
          <i className="ri-arrow-down-s-line text-sm"></i>
        </span>
      </button>

      {open && (
        <div
          className="absolute left-0 top-full mt-1 bg-white rounded-xl py-1 z-40 overflow-hidden border border-line shadow-card min-w-[180px] max-w-[280px]"
          role="listbox"
        >
          <div className="max-h-60 overflow-y-auto">
            {options.map((opt) => {
              const isSelected = opt.value === value;
              return (
                <button
                  key={opt.value}
                  role="option"
                  aria-selected={isSelected}
                  onClick={() => handleSelect(opt.value)}
                  className={`w-full text-left px-4 py-2.5 text-[13px] transition-colors duration-100 focus:outline-none focus-visible:bg-[#f0eafb] ${isSelected ? 'bg-iris-50' : 'bg-[transparent]'} ${isSelected ? 'text-iris' : 'text-ink'}`}
                >
                  {isSelected && (
                    <span className="w-4 h-4 inline-flex items-center justify-center mr-1.5 text-iris">
                      <i className="ri-check-line text-sm"></i>
                    </span>
                  )}
                  <span className={isSelected ? 'font-medium' : ''}>{opt.label}</span>
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}