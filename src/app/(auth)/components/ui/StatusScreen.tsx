import type { ReactNode } from 'react';
import { CheckCircle2, CirclePause, Lock } from 'lucide-react';

type StatusTone = 'success' | 'warning' | 'danger';

interface StatusScreenProps {
  tone: StatusTone;
  /** Icon identifier or class. */
  icon: string;
  /** Custom SVG element override. */
  customIcon?: ReactNode;
  /** The larger 40px glyph used on success screens. */
  largeGlyph?: boolean;
  title: string;
  /** Body paragraphs, rendered in order with the shared centred treatment. */
  messages?: ReactNode[];
  /** Callouts and action buttons. */
  children?: ReactNode;
}

const MEDALLION_TONES: Record<StatusTone, string> = {
  success: 'bg-[#eaf5ea] text-[#586d4d]',
  warning: 'bg-[#fff1dd] text-[#d97706]',
  danger: 'bg-[#FDEAEA] text-[#D8201D]',
};

function DefaultDeactivatedSvg() {
  return (
    <svg className="w-8 h-8 sm:w-9 sm:h-9" viewBox="6 12 27 30" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M18.75 42C16.71 42 14.76 41.61 12.9 40.83C11.12 40.07 9.535 38.995 8.145 37.605C6.755 36.215 5.68 34.63 4.92 32.85C4.14 30.99 3.75 29.04 3.75 27C3.75 24.96 4.14 23.01 4.92 21.15C5.68 19.37 6.755 17.785 8.145 16.395C9.535 15.005 11.12 13.93 12.9 13.17C14.76 12.39 16.71 12 18.75 12C20.79 12 22.74 12.39 24.6 13.17C26.38 13.93 27.965 15.005 29.355 16.395C30.745 17.785 31.82 19.37 32.58 21.15C33.36 23.01 33.75 24.96 33.75 27C33.75 29.04 33.36 30.99 32.58 32.85C31.82 34.63 30.745 36.215 29.355 37.605C27.965 38.995 26.38 40.07 24.6 40.83C22.74 41.61 20.79 42 18.75 42ZM18.75 39C20.93 39 22.95 38.45 24.81 37.35C26.61 36.29 28.04 34.86 29.1 33.06C30.2 31.2 30.75 29.18 29.1 20.94C28.04 19.14 26.61 17.71 24.81 16.65C22.95 15.55 20.93 15 18.75 15C16.57 15 14.55 15.55 12.69 16.65C10.89 17.71 9.46 19.14 8.4 20.94C7.3 22.8 6.75 24.82 6.75 27C6.75 29.18 7.3 31.2 8.4 33.06C9.46 34.86 10.89 36.29 12.69 37.35C14.55 38.45 16.57 39 18.75 39ZM13.53 19.65L26.1 32.22C25.8 32.62 25.47 33 25.11 33.36C24.75 33.72 24.37 34.05 23.97 34.35L11.4 21.78C11.7 21.38 12.03 21 12.39 20.64C12.75 20.28 13.13 19.95 13.53 19.65Z"
        fill="#D8201D"
      />
    </svg>
  );
}

export function StatusScreen({
  tone,
  icon,
  customIcon,
  largeGlyph = false,
  title,
  messages = [],
  children,
}: StatusScreenProps) {
  const lastIndex = messages.length - 1;

  const renderIconContent = () => {
    if (customIcon) return customIcon;
    if (tone === 'danger' || icon.includes('forbid')) return <DefaultDeactivatedSvg />;
    if (tone === 'warning' || icon.includes('pause') || icon.includes('lock')) return <CirclePause className="w-8 h-8 sm:w-9 sm:h-9 text-[#d97706]" />;
    return <CheckCircle2 className="w-8 h-8 sm:w-9 sm:h-9" />;
  };

  return (
    <>
      <div className={`w-16 h-16 sm:w-18 sm:h-18 rounded-full flex items-center justify-center mx-auto mb-4 sm:mb-5 ${MEDALLION_TONES[tone]}`}>
        {renderIconContent()}
      </div>

      <h2 className="text-xl sm:text-3xl font-semibold leading-snug sm:leading-tight text-[#2b2b2b] mb-2 text-center">{title}</h2>

      {messages.map((message, index) => (
        <p
          key={index}
          className={`text-[13px] sm:text-sm text-center leading-relaxed text-[#6d6d6d] ${
            index === lastIndex ? 'mb-3' : 'mb-3'
          }`}
        >
          {message}
        </p>
      ))}

      {children}
    </>
  );
}
