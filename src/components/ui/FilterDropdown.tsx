'use client';

import React, { useState, useRef, useEffect } from 'react';
import { cn } from '@/utils/tailwind';
import CustomScrollbar from './CustomScrollbar';
import { ChevronDown, Check } from 'lucide-react';

export interface FilterOption {
  value: string;
  label: string;
}

interface FilterDropdownProps {
  label: string;
  labelClassName?: string;
  options: FilterOption[];
  value?: string;
  onChange?: (value: string) => void;
  className?: string;
  controlClassName?: string;
}

export function FilterDropdown({ label, labelClassName, options, value, onChange, className, controlClassName }: FilterDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const [alignRight, setAlignRight] = useState(false);

  const selectedOption = options.find((opt) => opt.value === value) || options[0];

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    if (!isOpen) return;
    const btn = buttonRef.current;
    if (!btn) return;
    const rect = btn.getBoundingClientRect();
    const dropdownWidth = 192; // matches w-48 (48*4)
    const margin = 16; // small viewport margin
    const willOverflowRight = rect.left + dropdownWidth + margin > window.innerWidth;
    setAlignRight(willOverflowRight);
  }, [isOpen]);

  return (
    <div className={cn("relative", className)} ref={dropdownRef}>
      <button
        type="button"
        ref={buttonRef}
        className={cn(
          'flex w-full cursor-pointer items-center gap-1.5 px-3 py-1.5 text-[13px] sm:text-sm font-medium text-slate-600 bg-white border border-border rounded-full hover:bg-slate-50 transition-colors',
          controlClassName
        )}
        onClick={() => setIsOpen(!isOpen)}
      >
        <span className={cn("text-slate-400 font-normal shrink-0", labelClassName)}>
          {label}:
        </span>
        <span className="truncate">{selectedOption?.label}</span>
        <ChevronDown className="w-4 h-4 text-slate-400 shrink-0 ml-auto" />
      </button>

      {isOpen && (
        <div
          className={cn(
            'absolute z-20 w-48 max-w-[calc(100vw-2rem)] mt-1 py-1 bg-white border border-slate-200 rounded-lg shadow-lg overflow-hidden',
            alignRight ? 'right-0 left-auto' : 'left-0'
          )}
        >
          <CustomScrollbar className="max-h-60">
            <div className="py-1">
              {options.map((option) => {
                const isSelected = option.value === selectedOption?.value;
                const isAll = option.value === 'All';
                return (
                  <button
                    key={option.value}
                    className={cn(
                      'flex items-center w-full pl-2 pr-3 py-2 text-sm text-left transition-colors cursor-pointer',
                      isAll
                        ? 'text-iris font-medium hover:brightness-95'
                        : isSelected
                        ? 'text-iris hover:bg-slate-50 bg-[#F0EAFB]'
                        : 'text-slate-700 hover:bg-slate-50'
                    )}
                    style={isAll ? { backgroundColor: '#F0EAFB' } : undefined}
                    onClick={() => {
                      onChange?.(option.value);
                      setIsOpen(false);
                    }}
                  >
                    {!isAll && isSelected && (
                      <Check className="w-4 h-4 text-iris shrink-0 mr-1.5" />
                    )}
                    {option.label}
                  </button>
                );
              })}
            </div>
          </CustomScrollbar>
        </div>
      )}
    </div>
  );
}

export default FilterDropdown;
