import { BRAND_HEX } from '@/app/(auth)/constants';

const PANEL_DOTS_ID = 'auth-panel-dots';
const TILE_DOTS_ID = 'auth-tile-dots';

/**
 * Both dot patterns are declared once and referenced by id everywhere else,
 * instead of being redeclared inside each tile.
 */
export function ShellPatternDefs() {
  return (
    <svg width="0" height="0" className="absolute" aria-hidden="true" focusable="false">
      <defs>
        <pattern id={PANEL_DOTS_ID} x="0" y="0" width="28" height="28" patternUnits="userSpaceOnUse">
          <circle cx="3" cy="3" r="1.2" fill={BRAND_HEX} />
        </pattern>
        <pattern id={TILE_DOTS_ID} x="0" y="0" width="20" height="20" patternUnits="userSpaceOnUse">
          <circle cx="4" cy="4" r="1" fill="white" />
          <circle cx="14" cy="14" r="0.8" fill="white" />
        </pattern>
      </defs>
    </svg>
  );
}

export function PanelTexture() {
  return (
    <div className="absolute inset-0 pointer-events-none opacity-[0.035]" aria-hidden="true">
      <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
        <rect width="100%" height="100%" fill={`url(#${PANEL_DOTS_ID})`} />
      </svg>
    </div>
  );
}

const TILE_IMAGES = [
  { id: 'tile-1', src: '/IMG-1.png', alt: 'Feature 1' },
  { id: 'tile-2', src: '/IMG-2.png', alt: 'Feature 2' },
  { id: 'tile-3', src: '/IMG-3.png', alt: 'Feature 3' },
  { id: 'tile-4', src: '/IMG-4.png', alt: 'Feature 4' },
  { id: 'tile-5', src: '/IMG-5.png', alt: 'Feature 5' },
  { id: 'tile-6', src: '/IMG-6.png', alt: 'Feature 6' },
];

export function ShowcaseTiles() {
  return (
    <div className="grid grid-cols-3 gap-3 lg:gap-4 w-full">
      {TILE_IMAGES.map(({ id, src, alt }) => (
        <div
          key={id}
          className="aspect-square rounded-xl lg:rounded-lg overflow-hidden flex items-center justify-center relative transition-all duration-200 ease-out hover:shadow-md bg-transparent"
        >
          <img
            src={src}
            alt={alt}
            className="w-full h-full object-cover"
          />
        </div>
      ))}
    </div>
  );
}
