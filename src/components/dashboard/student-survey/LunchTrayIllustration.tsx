export default function LunchTrayIllustration() {
  return (
    <svg
      viewBox="0 0 720 420"
      xmlns="http://www.w3.org/2000/svg"
      role="img"
      aria-hidden="true"
      className="w-full h-auto object-cover object-top max-h-[340px] block"
    >
      <rect width="720" height="420" fill="#fdf8ed" />

      {/* decorative sage bubbles */}
      <circle cx="90" cy="70" r="26" fill="#e3efe0" />
      <circle cx="640" cy="90" r="18" fill="#e3efe0" />
      <circle cx="60" cy="330" r="16" fill="#e3efe0" />
      <circle cx="660" cy="320" r="30" fill="#e3efe0" />
      <circle cx="600" cy="60" r="8" fill="#c9dcc2" />
      <circle cx="40" cy="200" r="8" fill="#c9dcc2" />

      {/* tray */}
      <rect x="140" y="230" width="440" height="130" rx="26" fill="#ffffff" stroke="#e8e6e1" strokeWidth="3" />
      <rect x="164" y="252" width="392" height="86" rx="16" fill="#f2f5f0" />

      {/* sandwich */}
      <g transform="translate(190,255)">
        <path d="M0 60 L60 20 L120 60 L120 70 Q60 90 0 70 Z" fill="#f2b880" stroke="#c98a4d" strokeWidth="3" />
        <path d="M8 58 L60 26 L112 58" fill="none" stroke="#8fae63" strokeWidth="6" strokeLinecap="round" />
        <circle cx="30" cy="52" r="4" fill="#c0392b" />
        <circle cx="90" cy="52" r="4" fill="#c0392b" />
      </g>

      {/* apple */}
      <g transform="translate(345,250)">
        <path d="M35 20 C10 15 0 40 5 60 C10 82 25 92 35 92 C45 92 60 82 65 60 C70 40 60 15 35 20 Z" fill="#e0574b" />
        <path d="M33 20 C30 8 20 4 12 6" fill="none" stroke="#8fae63" strokeWidth="4" strokeLinecap="round" />
        <ellipse cx="24" cy="42" rx="7" ry="10" fill="#f4938a" opacity="0.6" />
        {/* smiling face */}
        <circle cx="24" cy="58" r="3" fill="#3a2a1e" />
        <circle cx="46" cy="58" r="3" fill="#3a2a1e" />
        <path d="M22 70 Q35 80 48 70" stroke="#3a2a1e" strokeWidth="3" fill="none" strokeLinecap="round" />
      </g>

      {/* banana bunch */}
      <g transform="translate(430,258)">
        <path d="M0 70 C0 30 30 8 60 12 C58 20 40 22 30 40 C20 58 20 70 30 78 C15 82 0 82 0 70 Z" fill="#f4d35e" stroke="#d9b23f" strokeWidth="2" />
        <circle cx="10" cy="70" r="3" fill="#3a2a1e" />
        <circle cx="24" cy="72" r="3" fill="#3a2a1e" />
        <path d="M8 78 Q18 84 26 78" stroke="#3a2a1e" strokeWidth="2.5" fill="none" strokeLinecap="round" />
      </g>

      {/* carrot sticks */}
      <g transform="translate(500,270)">
        <rect x="0" y="0" width="10" height="55" rx="5" fill="#f2994a" transform="rotate(-6 5 27)" />
        <rect x="16" y="4" width="10" height="55" rx="5" fill="#f2994a" transform="rotate(4 21 31)" />
        <rect x="32" y="0" width="10" height="55" rx="5" fill="#f2994a" transform="rotate(-2 37 27)" />
      </g>

      {/* milk carton */}
      <g transform="translate(285,240)">
        <path d="M0 12 L27 0 L54 12 L54 90 L0 90 Z" fill="#ffffff" stroke="#e8e6e1" strokeWidth="3" />
        <path d="M0 12 L27 24 L54 12" fill="none" stroke="#e8e6e1" strokeWidth="3" />
        <path d="M12 0 L27 10 L42 0" fill="none" stroke="#586d4d" strokeWidth="3" strokeLinecap="round" />
        <rect x="10" y="40" width="34" height="14" rx="4" fill="#e3efe0" />
      </g>

      {/* sparkles */}
      <g fill="#8fae63">
        <path d="M180 90 l4 10 l10 4 l-10 4 l-4 10 l-4-10 l-10-4 l10-4 z" />
        <path d="M560 170 l3 7 l7 3 l-7 3 l-3 7 l-3-7 l-7-3 l7-3 z" />
      </g>
    </svg>
  );
}
