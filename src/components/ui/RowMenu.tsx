'use client';

import { useEffect, useLayoutEffect, useRef, useState, type ReactNode } from 'react';
import { createPortal } from 'react-dom';

const MIN_WIDTH = 192;
const GAP = 4;
/** Used for the first paint only, before the menu can be measured. */
const ESTIMATED_HEIGHT = 200;

/** `useLayoutEffect` warns during SSR; the placement work only ever matters in the browser. */
const useBrowserLayoutEffect = typeof window === 'undefined' ? useEffect : useLayoutEffect;

interface RowMenuProps {
  ariaLabel: string;
  /** Receives a `close` callback so each item can dismiss the menu when picked. */
  children: (close: () => void) => ReactNode;
}

/**
 * Kebab menu for a table row. The list renders in a portal so it escapes the card's
 * `overflow-hidden` and the table's horizontal scroll container, which would otherwise clip it.
 */
export default function RowMenu({ ariaLabel, children }: RowMenuProps) {
  const [open, setOpen] = useState(false);
  const [position, setPosition] = useState({ top: 0, left: 0, width: MIN_WIDTH, maxHeight: ESTIMATED_HEIGHT });
  const triggerRef = useRef<HTMLButtonElement>(null);
  const [panel, setPanel] = useState<HTMLDivElement | null>(null);

  useBrowserLayoutEffect(() => {
    if (!open) return;

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

      const width = Math.min(MIN_WIDTH, viewportW - GAP * 2);

      setPosition({
        top: Math.max(GAP, Math.min(top, viewportH - Math.min(height, viewportH - GAP * 2) - GAP)),
        // Right-align to the trigger, then keep the whole panel on screen.
        left: Math.max(GAP, Math.min(rect.right - width, viewportW - width - GAP)),
        width,
        maxHeight: viewportH - GAP * 2,
      });
    }

    place();

    const observer = panel ? new ResizeObserver(place) : null;
    if (panel && observer) observer.observe(panel);
    window.addEventListener('resize', place);
    window.addEventListener('scroll', place, true);
    return () => {
      observer?.disconnect();
      window.removeEventListener('resize', place);
      window.removeEventListener('scroll', place, true);
    };
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
        onClick={() => setOpen((current) => !current)}
        aria-haspopup="menu"
        aria-expanded={open}
        aria-label={ariaLabel}
        className="w-8 h-8 rounded-full flex items-center justify-center transition-colors duration-150 hover:bg-[#F5F3F0] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#6D28D9] focus-visible:ring-offset-1"
      >
        <span className="w-4 h-4 flex items-center justify-center text-[#6D6D6D]">
          <i className="ri-more-2-fill text-lg"></i>
        </span>
      </button>

      {/* `open` only ever flips from a click, so this never runs during SSR. */}
      {open && createPortal(
        <div
          ref={setPanel}
          role="menu"
          className="fixed z-80 bg-white rounded-xl py-1 overflow-y-auto overscroll-contain border border-[#E8E6E1] shadow-[0px_1px_2px_0px_rgba(0,0,0,0.04),0px_8px_24px_0px_rgba(0,0,0,0.12)]"
          style={{
            top: position.top,
            left: position.left,
            width: position.width,
            maxHeight: position.maxHeight,
          }}
        >
          {children(() => setOpen(false))}
        </div>,
        document.body,
      )}
    </>
  );
}
