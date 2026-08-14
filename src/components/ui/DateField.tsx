'use client';

import React, { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { Calendar } from 'lucide-react';
import DatePickerCalendar from '@/components/ui/DatePickerCalendar';

/** Used only for the very first paint, before the calendar can be measured. */
const ESTIMATED_HEIGHT = 380;
const MIN_WIDTH = 290;
/** Breathing room kept between the panel and the viewport edges. */
const GAP = 8;

/** `useLayoutEffect` warns during SSR; the placement work only ever matters in the browser. */
const useBrowserLayoutEffect = typeof window === 'undefined' ? useEffect : useLayoutEffect;

export interface DateFieldProps {
  /** Selected day as `YYYY-MM-DD`, or an empty string when nothing is picked yet. */
  value: string;
  onChange: (iso: string) => void;
  /** Earliest selectable day as `YYYY-MM-DD`. */
  min?: string;
  disabled?: boolean;
  placeholder?: string;
  /** Classes for the trigger, so each form keeps its own field styling. */
  className?: string;
  'aria-label'?: string;
}

/**
 * Date input with the in-house calendar. The calendar renders in a portal so it can escape
 * the scroll container of whichever modal or drawer it sits in.
 */
export default function DateField({
  value,
  onChange,
  min,
  disabled,
  placeholder = 'YYYY-MM-DD',
  className = '',
  'aria-label': ariaLabel,
}: DateFieldProps) {
  const [open, setOpen] = useState(false);
  const [position, setPosition] = useState({
    top: 0,
    left: 0,
    width: MIN_WIDTH,
    maxHeight: ESTIMATED_HEIGHT,
  });
  const triggerRef = useRef<HTMLButtonElement>(null);
  const [panel, setPanel] = useState<HTMLDivElement | null>(null);
  /**
   * `position` starts at the viewport corner and is only correct once the panel
   * has been measured. Staying hidden until then stops the first open from
   * flashing in at the top-left and jumping to the field.
   */
  const [placed, setPlaced] = useState(false);

  useBrowserLayoutEffect(() => {
    if (!open) {
      setPlaced(false);
      return;
    }

    function place() {
      const trigger = triggerRef.current;
      if (!trigger) return;

      const rect = trigger.getBoundingClientRect();
      const viewportH = window.innerHeight;
      const viewportW = window.innerWidth;

      const height = panel?.offsetHeight || ESTIMATED_HEIGHT;
      const spaceBelow = viewportH - rect.bottom - GAP;
      const spaceAbove = rect.top - GAP;

      let top: number;
      if (height <= spaceBelow) {
        top = rect.bottom + GAP;
      } else if (height <= spaceAbove) {
        top = rect.top - height - GAP;
      } else {
        top = spaceBelow >= spaceAbove ? rect.bottom + GAP : GAP;
      }

      const width = Math.min(Math.max(rect.width, MIN_WIDTH), 340);

      setPosition({
        top: Math.max(GAP, Math.min(top, viewportH - Math.min(height, viewportH - GAP * 2) - GAP)),
        left: Math.max(GAP, Math.min(rect.left, viewportW - width - GAP)),
        width,
        maxHeight: viewportH - GAP * 2,
      });

      // Only reveal once the real panel height went into the placement above.
      if (panel) setPlaced(true);
    }

    place();

    const observer = panel ? new ResizeObserver(place) : null;
    if (panel && observer) observer.observe(panel);
    window.addEventListener('resize', place);
    return () => {
      observer?.disconnect();
      window.removeEventListener('resize', place);
    };
  }, [open, panel]);

  // The panel is portalled to the body, so it can't scroll with the modal behind
  // it. Rather than let it drift away from its field, close it as soon as
  // anything other than the calendar itself scrolls.
  useEffect(() => {
    if (!open) return;

    function handleScroll(event: Event) {
      const target = event.target as Node | null;
      if (target && panel?.contains(target)) return;
      setOpen(false);
    }

    window.addEventListener('scroll', handleScroll, true);
    return () => window.removeEventListener('scroll', handleScroll, true);
  }, [open, panel]);

  useEffect(() => {
    if (!open) return;

    function handlePointerDown(event: MouseEvent) {
      const target = event.target as Node;
      if (triggerRef.current?.contains(target) || panel?.contains(target)) return;
      setOpen(false);
    }

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') setOpen(false);
    }

    document.addEventListener('mousedown', handlePointerDown);
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('mousedown', handlePointerDown);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [open, panel]);

  return (
    <>
      <button
        ref={triggerRef}
        type="button"
        disabled={disabled}
        onClick={() => setOpen((current) => !current)}
        aria-expanded={open}
        aria-label={ariaLabel}
        className={
          className ||
          'w-full flex items-center justify-between px-4 py-2.5 bg-[#FAF9F6] border border-[#E8E6E1] rounded-2xl text-xs sm:text-sm font-sans text-[#2B2B2B] focus:outline-none focus:ring-0 cursor-pointer select-none text-left'
        }
      >
        <span className={value ? 'text-[#2B2B2B] font-medium' : 'text-slate-400'}>
          {value || placeholder}
        </span>
        <Calendar className="w-4 h-4 text-[#1F1F1F] opacity-70 shrink-0 pointer-events-none" />
      </button>

      {/* Portal popover for calendar */}
      {open &&
        createPortal(
          <div
            ref={setPanel}
            className={`fixed z-90 overflow-y-auto overscroll-contain transition-opacity duration-100 ${placed ? 'opacity-100' : 'opacity-0 invisible'}`}
            style={{
              top: position.top,
              left: position.left,
              width: position.width,
              maxHeight: position.maxHeight,
            }}
          >
            <DatePickerCalendar
              value={value}
              min={min}
              onChange={(iso) => {
                onChange(iso);
                setOpen(false);
              }}
            />
          </div>,
          document.body
        )}
    </>
  );
}
