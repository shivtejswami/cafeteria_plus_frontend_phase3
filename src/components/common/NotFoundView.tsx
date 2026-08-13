'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { SUPPORT_EMAIL } from '@/app/(auth)/constants';

export function NotFoundView() {
  const [backTarget, setBackTarget] = useState('/school');

  useEffect(() => {
    // 1. Check last saved path in sessionStorage
    const savedPath = sessionStorage.getItem('lastActivePath');
    if (savedPath) {
      if (savedPath.startsWith('/admin')) {
        setBackTarget('/admin');
        return;
      }
      if (savedPath.startsWith('/district')) {
        setBackTarget('/district');
        return;
      }
      if (savedPath.startsWith('/school')) {
        setBackTarget('/school');
        return;
      }
    }

    // 2. Check referrer URL if user came directly from another page
    if (typeof document !== 'undefined' && document.referrer) {
      const ref = document.referrer.toLowerCase();
      if (ref.includes('/admin')) {
        setBackTarget('/admin');
        return;
      }
      if (ref.includes('/district')) {
        setBackTarget('/district');
        return;
      }
      if (ref.includes('/login') || ref.includes('/enter-code')) {
        setBackTarget('/login');
        return;
      }
      if (ref.includes('/school')) {
        setBackTarget('/school');
        return;
      }
    }

    // 3. Fallback check on current location path
    if (typeof window !== 'undefined') {
      const path = window.location.pathname.toLowerCase();
      if (path.includes('/admin')) setBackTarget('/admin');
      else if (path.includes('/district')) setBackTarget('/district');
      else if (path.includes('/login')) setBackTarget('/login');
    }
  }, []);

  return (
    <div className="relative min-h-screen w-full bg-[#FAF8F5] flex flex-col items-center justify-center p-6 text-center overflow-hidden">
      {/* Top-Right Decorative Soft Purple Glow */}
      <div className="absolute -top-20 -right-20 w-80 h-80 sm:w-[420px] sm:h-[420px] rounded-full bg-[#f3e8ff]/60 pointer-events-none" />

      {/* Bottom-Left Decorative Peach Fruit Watermark */}
      <div className="absolute -bottom-28 -left-28 w-80 h-80 sm:w-[400px] sm:h-[400px] rounded-full bg-[#fde8d3]/70 pointer-events-none flex items-center justify-center overflow-hidden">
        <svg
          className="w-full h-full text-white/70 p-12"
          viewBox="0 0 200 200"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          {/* Citrus Slice */}
          <circle cx="55" cy="75" r="38" />
          <circle cx="55" cy="75" r="30" />
          <line x1="55" y1="45" x2="55" y2="105" />
          <line x1="25" y1="75" x2="85" y2="75" />
          <line x1="34" y1="54" x2="76" y2="96" />

          {/* Apple & Leaf */}
          <path d="M140 145 C120 135 110 155 90 145 C70 135 70 105 90 85 C100 75 120 75 120 85 C120 75 140 75 150 85 C170 105 170 135 140 145 Z" />
          <path d="M120 85 Q125 70 130 65" />
          <path d="M125 73 Q140 70 145 77 Q135 83 125 73" />

          {/* Dotted texture */}
          <circle cx="45" cy="125" r="1.5" fill="currentColor" />
          <circle cx="53" cy="133" r="1.5" fill="currentColor" />
          <circle cx="38" cy="138" r="1.5" fill="currentColor" />
          <circle cx="62" cy="140" r="1.5" fill="currentColor" />
        </svg>
      </div>

      {/* Main Content Container */}
      <div className="relative z-10 flex flex-col items-center max-w-md w-full">
        {/* 4 0 4 Graphic */}
        <div className="flex items-center justify-center gap-2 sm:gap-3 mb-4 select-none">
          <span className="text-7xl sm:text-8xl font-black text-[#262626] tracking-tighter">
            4
          </span>

          {/* Sad Face Cookie/Dish Vector Graphic matching provided image */}
          <svg
            className="w-20 h-20 sm:w-24 sm:h-24 my-auto shrink-0"
            viewBox="0 0 120 120"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            {/* Base Background Circle */}
            <circle cx="60" cy="60" r="55" fill="#F4D5B3" stroke="#4E4F54" strokeWidth="2" />

            {/* Inner Segmented Ring */}
            <circle
              cx="60"
              cy="60"
              r="44"
              stroke="#4E4F54"
              strokeWidth="2"
              strokeDasharray="195 16 38 16"
              strokeLinecap="round"
              transform="rotate(-85 60 60)"
            />

            {/* Left Eye Arc */}
            <path
              d="M 40 48 Q 46 56 52 48"
              stroke="#4E4F54"
              strokeWidth="2"
              strokeLinecap="round"
            />

            {/* Right Eye Arc */}
            <path
              d="M 68 48 Q 74 56 80 48"
              stroke="#4E4F54"
              strokeWidth="2"
              strokeLinecap="round"
            />

            {/* Left Blush Cheek */}
            <circle cx="37" cy="63" r="7.5" fill="#E08234" />

            {/* Right Blush Cheek */}
            <circle cx="83" cy="63" r="7.5" fill="#E08234" />

            {/* Sad Mouth Arc */}
            <path
              d="M 53 74 Q 60 65 67 74"
              stroke="#4E4F54"
              strokeWidth="2"
              strokeLinecap="round"
            />
          </svg>

          <span className="text-7xl sm:text-8xl font-black text-[#262626] tracking-tighter">
            4
          </span>
        </div>

        {/* Title */}
        <h1 className="text-2xl sm:text-3xl font-extrabold text-[#262626] mb-2 tracking-tight">
          Page Not Found
        </h1>

        {/* Subtitle */}
        <p className="text-sm text-[#737373] text-center max-w-xs sm:max-w-md leading-relaxed mb-6">
          The page you&apos;re looking for doesn&apos;t exist or has been
          <br />
          moved. Let&apos;s get you back on track.
        </p>

        {/* Action Button */}
        <Link
          href={backTarget}
          className="inline-flex items-center gap-2 bg-[#526647] hover:bg-[#435439] active:bg-[#36442e] text-white text-sm font-medium px-6 py-2.5 rounded-full shadow-sm transition-all duration-200"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to home
        </Link>

        {/* Subtle Horizontal Divider Line */}
        <div className="w-64 sm:w-72 h-[1px] bg-[#ece8df] my-8" />

        {/* Footer Support Link */}
        <p className="text-xs text-[#909090]">
          Need help?{' '}
          <a
            href={`mailto:${SUPPORT_EMAIL}`}
            className="font-medium text-[#6d28d9] hover:underline"
          >
            Contact support
          </a>
        </p>
      </div>
    </div>
  );
}
