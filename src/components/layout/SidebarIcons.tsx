/**
 * Hand-drawn nav glyphs from the school dashboard design. They use `currentColor`
 * so a link's active/inactive text colour carries straight through to the icon.
 *
 * Keys here are referenced by `icon` in `constants/navigation`; the sidebar falls
 * back to a Lucide icon of the same name when there is no glyph for a link.
 */
import type { ComponentType } from 'react';

type GlyphProps = { className?: string };

function HomeGlyph({ className }: GlyphProps) {
  return (
    <svg width="20" height="28" viewBox="0 0 20 28" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" className={className}>
      <path d="M15.2422 21.3652H4.74219C4.53219 21.3652 4.35469 21.2927 4.20969 21.1477C4.06469 21.0027 3.99219 20.8252 3.99219 20.6152V13.8652H1.74219L9.48219 6.83023C9.63219 6.70023 9.80219 6.63523 9.99219 6.63523C10.1822 6.63523 10.3522 6.70023 10.5022 6.83023L18.2422 13.8652H15.9922V20.6152C15.9922 20.8252 15.9197 21.0027 15.7747 21.1477C15.6297 21.2927 15.4522 21.3652 15.2422 21.3652ZM5.49219 19.8652H14.4922V12.4852L9.99219 8.39023L5.49219 12.4852V19.8652ZM6.99219 16.8652H12.9922V18.3652H6.99219V16.8652Z" fill="currentColor" />
    </svg>
  );
}

function SurveyGlyph({ className }: GlyphProps) {
  return (
    <svg width="20" height="28" viewBox="0 0 20 28" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" className={className}>
      <path d="M6.24219 8V6.5H13.7422V8H15.9922C16.2022 8 16.3797 8.0725 16.5247 8.2175C16.6697 8.3625 16.7422 8.54 16.7422 8.75V20.75C16.7422 20.96 16.6697 21.1375 16.5247 21.2825C16.3797 21.4275 16.2022 21.5 15.9922 21.5H3.99219C3.78219 21.5 3.60469 21.4275 3.45969 21.2825C3.31469 21.1375 3.24219 20.96 3.24219 20.75V8.75C3.24219 8.54 3.31469 8.3625 3.45969 8.2175C3.60469 8.0725 3.78219 8 3.99219 8H6.24219ZM6.24219 9.5H4.74219V20H15.2422V9.5H13.7422V11H6.24219V9.5ZM7.74219 8V9.5H12.2422V8H7.74219Z" fill="currentColor" />
    </svg>
  );
}

function ReportsGlyph({ className }: GlyphProps) {
  return (
    <svg width="20" height="28" viewBox="0 0 20 28" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" className={className}>
      <path d="M9.24219 10.25H10.7422V17.75H9.24219V10.25ZM12.2422 13.25H13.7422V17.75H12.2422V13.25ZM6.24219 14.75H7.74219V17.75H6.24219V14.75ZM12.2422 8H4.74219V20H15.2422V11H12.2422V8ZM3.24219 7.25C3.24219 7.04 3.31469 6.8625 3.45969 6.7175C3.60469 6.5725 3.78219 6.5 3.99219 6.5H12.9922L16.7422 10.25V20.75C16.7422 20.95 16.6697 21.125 16.5247 21.275C16.3797 21.425 16.2022 21.5 15.9922 21.5H3.99219C3.78219 21.5 3.60469 21.4275 3.45969 21.2825C3.31469 21.1375 3.24219 20.96 3.24219 20.75V7.25Z" fill="currentColor" />
    </svg>
  );
}

export const SIDEBAR_GLYPHS: Record<string, ComponentType<GlyphProps>> = {
  HomeGlyph,
  SurveyGlyph,
  ReportsGlyph,
};
