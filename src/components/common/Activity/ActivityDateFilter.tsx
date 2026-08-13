'use client';

import { useEffect, useRef, useState } from 'react';
import { CUSTOM_RANGE_VALUE, parseCustomRange, type ActivityFilterOption } from './types';

interface ActivityDateFilterProps {
  label: string;
  value: string;
  defaultValue: string;
  options: ActivityFilterOption[];
  onChange: (value: string) => void;
}

/**
 * Same pill/panel shell as the plain filter dropdown, plus a from/to pair that
 * appears once "Custom" is picked. The panel stays open while the user fills the
 * range in, since choosing a date is not the same as dismissing the menu.
 */
export default function ActivityDateFilter({ label, value, defaultValue, options, onChange }: ActivityDateFilterProps) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  const isCustom = value.startsWith(CUSTOM_RANGE_VALUE);
  const { from, to } = parseCustomRange(value);
  const isActive = value !== defaultValue;

  useEffect(() => {
    if (!open) return;
    function handlePointerDown(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === 'Escape') setOpen(false);
    }
    document.addEventListener('mousedown', handlePointerDown);
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('mousedown', handlePointerDown);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [open]);

  function formatDisplay(): string {
    if (!isCustom) return options.find((o) => o.value === value)?.label ?? value;
    if (from && to) return `${from} → ${to}`;
    return 'Custom';
  }

  function handleRangeChange(nextFrom: string, nextTo: string) {
    onChange(`${CUSTOM_RANGE_VALUE}:${nextFrom}:${nextTo}`);
  }

  return (
    <div ref={ref} className="relative shrink-0 min-w-0">
      <button
        onClick={() => setOpen(!open)}
        className={`flex items-center justify-between gap-1.5 h-9 pl-3.5 pr-2.5 rounded-full text-[13px] font-medium whitespace-nowrap transition-all duration-150 focus:outline-none focus-visible:ring-2 focus-visible:ring-iris focus-visible:ring-offset-1 w-full shadow-hairline border ${isActive ? 'bg-iris-50 border-iris text-iris-800' : 'bg-surface border-line text-muted'}`}
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-label={`${label}: ${formatDisplay()}`}
      >
        <span className="truncate">
          <span className="text-[11px] font-normal text-subtle">{label}: </span>
          <span className={`truncate ${isActive ? 'text-iris-800' : 'text-ink'}`}>{formatDisplay()}</span>
        </span>
        <span
          className={`w-4 h-4 flex items-center justify-center shrink-0 transition-transform duration-150 ${open ? '[transform:rotate(180deg)]' : '[transform:rotate(0deg)]'} ${isActive ? 'text-iris' : 'text-subtle'}`}
        >
          <i className="ri-arrow-down-s-line text-sm"></i>
        </span>
      </button>

      {open && (
        <div
          className="absolute left-0 top-full mt-1 bg-white rounded-xl py-1 z-40 border border-line shadow-card min-w-[220px]"
          role="listbox"
          aria-label={label}
        >
          {options.map((option) => {
            const isSelected =
              option.value === CUSTOM_RANGE_VALUE ? isCustom : option.value === value;
            return (
              <button
                key={option.value}
                role="option"
                aria-selected={isSelected}
                onClick={() => {
                  if (option.value === CUSTOM_RANGE_VALUE) {
                    if (!isCustom) handleRangeChange('', '');
                    return;
                  }
                  onChange(option.value);
                  setOpen(false);
                }}
                className={`w-full text-left px-4 py-2.5 text-[13px] transition-colors duration-100 focus:outline-none focus-visible:bg-iris-50 ${isSelected ? 'bg-iris-50 text-iris font-medium' : 'bg-transparent text-ink'}`}
              >
                {isSelected && (
                  <span className="w-4 h-4 inline-flex items-center justify-center mr-1.5 text-iris">
                    <i className="ri-check-line text-sm"></i>
                  </span>
                )}
                {option.label}
              </button>
            );
          })}

          {isCustom && (
            <div className="flex items-center gap-2 px-3 pt-2 pb-2.5">
              <input
                type="date"
                value={from}
                max={to || undefined}
                onChange={(e) => handleRangeChange(e.target.value, to)}
                aria-label="From date"
                className="flex-1 min-w-0 h-9 px-2.5 rounded-lg text-[12px] outline-none focus:outline-none focus-visible:ring-2 focus-visible:ring-iris bg-white border border-line text-ink"
              />
              <span className="text-[12px] shrink-0 text-subtle">to</span>
              <input
                type="date"
                value={to}
                min={from || undefined}
                onChange={(e) => handleRangeChange(from, e.target.value)}
                aria-label="To date"
                className="flex-1 min-w-0 h-9 px-2.5 rounded-lg text-[12px] outline-none focus:outline-none focus-visible:ring-2 focus-visible:ring-iris bg-white border border-line text-ink"
              />
            </div>
          )}
        </div>
      )}
    </div>
  );
}
