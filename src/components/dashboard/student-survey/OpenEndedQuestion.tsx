'use client';

import { useRef, useEffect } from 'react';

function countWords(text: string): number {
  const trimmed = text.trim();
  if (!trimmed) return 0;
  return trimmed.split(/\s+/).filter(Boolean).length;
}

function limitToMaxWords(text: string, maxWords: number = 10): string {
  const words = text.trim().split(/\s+/);
  if (!text.trim() || words.length <= maxWords) {
    return text;
  }
  let wordCount = 0;
  let cutoffIndex = text.length;
  const regex = /\S+/g;
  let match;
  while ((match = regex.exec(text)) !== null) {
    wordCount++;
    if (wordCount === maxWords) {
      cutoffIndex = match.index + match[0].length;
      break;
    }
  }
  return text.slice(0, cutoffIndex);
}

interface OpenEndedQuestionProps {
  value: string;
  onChange: (value: string) => void;
  anonymityReminder?: string;
  maxWords?: number;
  maxLength?: number;
  question: string;
  isK5: boolean;
  is912?: boolean;
}

export default function OpenEndedQuestion({
  value,
  onChange,
  anonymityReminder,
  maxWords,
  maxLength,
  question,
  isK5,
  is912,
}: OpenEndedQuestionProps) {
  const effectiveMaxWords = maxWords ?? maxLength ?? 10;
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const wordCount = countWords(value);
  const nearLimit = wordCount >= Math.floor(effectiveMaxWords * 0.8);
  const atLimit = wordCount >= effectiveMaxWords;

  useEffect(() => {
    const el = textareaRef.current;
    if (!el) return;

    const handleFocus = () => {
      setTimeout(() => {
        el.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }, 300);
    };

    el.addEventListener('focus', handleFocus);
    return () => el.removeEventListener('focus', handleFocus);
  }, []);

  const handleChange = (newVal: string) => {
    onChange(limitToMaxWords(newVal, effectiveMaxWords));
  };

  if (is912) {
    return (
      <div>
        <div
          className="rounded-[12px] overflow-hidden bg-white border border-line"
        >
          <textarea
            ref={textareaRef}
            value={value}
            onChange={(e) => handleChange(e.target.value)}
            placeholder="Type your answer"
            aria-label={question}
            rows={4}
            className="w-full p-5 leading-relaxed resize-none focus:outline-none text-ink bg-transparent border-0 text-[16px] leading-[1.6]"
          />
          <div className="flex items-center justify-between px-4 py-2.5 border-t border-t-[#f0eee9] bg-canvas">
            {anonymityReminder ? (
              <div className="flex items-center gap-1.5">
                <span className="w-4 h-4 flex items-center justify-center">
                  <i className="ri-shield-check-line text-[12px] text-sage"></i>
                </span>
                <span className="text-[12px] font-medium text-sage whitespace-nowrap">
                  {anonymityReminder}
                </span>
              </div>
            ) : (
              <span />
            )}
            <span
              className={`text-[12px] font-medium tabular-nums [transition:color_100ms_ease] ${nearLimit ? 'text-[#b45309]' : 'text-subtle'}`}
            >
              {wordCount} / {effectiveMaxWords}
            </span>
          </div>
        </div>
      </div>
    );
  }

  if (!isK5) {
    return (
      <div>
        <div
          className="rounded-2xl overflow-hidden bg-white border-[1.5px] border-line shadow-[0_1px_3px_rgba(0,0,0,0.03)]"
        >
          <textarea
            ref={textareaRef}
            value={value}
            onChange={(e) => handleChange(e.target.value)}
            placeholder="Type your answer..."
            aria-label={question}
            rows={4}
            className="w-full p-5 leading-relaxed resize-none focus:outline-none text-ink bg-transparent border-0 text-[16px] leading-[1.6]"
          />
          <div className="flex items-center justify-between px-4 py-2.5 border-t border-t-[#f0eee9] bg-canvas">
            {anonymityReminder ? (
              <div className="flex items-center gap-1.5">
                <span className="w-4 h-4 flex items-center justify-center">
                  <i className="ri-shield-check-line text-[13px] text-sage"></i>
                </span>
                <span className="text-[12px] font-medium text-sage whitespace-nowrap">
                  {anonymityReminder}
                </span>
              </div>
            ) : (
              <span />
            )}
            <span
              className={`text-[12px] font-medium tabular-nums [transition:color_120ms_ease] ${nearLimit ? 'text-[#b45309]' : 'text-subtle'}`}
            >
              {wordCount} / {effectiveMaxWords}
            </span>
          </div>
        </div>
      </div>
    );
  }

  const getCounterMessage = () => {
    if (atLimit) return 'You reached the limit';
    if (nearLimit) return `${effectiveMaxWords - wordCount} words left`;

    if (wordCount < 3) return 'You have plenty of room';
    if (wordCount < 6) return 'Take your time';

    return `${effectiveMaxWords - wordCount} words left`;
  };

  return (
    <div>
      <div
        className="rounded-[24px] overflow-hidden bg-white border-2 border-line shadow-[0_2px_8px_rgba(0,0,0,0.03)]"
      >
        <textarea
          ref={textareaRef}
          value={value}
          onChange={(e) => handleChange(e.target.value)}
          placeholder="Write here..."
          aria-label={question}
          rows={5}
          className="w-full px-6 pt-5 pb-3 leading-relaxed resize-none focus:outline-none text-ink bg-transparent border-0 text-[18px] leading-[1.6]"
        />

        <div
          className="flex items-center justify-between px-5 py-3 border-t border-t-[#f0eee9] bg-canvas"
        >
          <span
            className={`text-[14px] font-medium [transition:color_200ms_ease] ${nearLimit ? 'text-[#b45309]' : 'text-[#8b8b7d]'}`}
          >
            {getCounterMessage()}
          </span>
          <span
            className={`text-[14px] font-medium [transition:color_200ms_ease] ${nearLimit ? 'text-[#b45309]' : 'text-subtle'}`}
          >
            {wordCount} / {effectiveMaxWords}
          </span>
        </div>
      </div>

      {anonymityReminder && (
        <div className="flex items-center gap-2 mt-4 px-2">
          <span className="w-5 h-5 flex items-center justify-center flex-shrink-0">
            <i className="ri-shield-check-line text-[16px] text-sage"></i>
          </span>
          <span className="text-[14px] font-medium leading-snug text-sage whitespace-nowrap">
            {anonymityReminder}
          </span>
        </div>
      )}
    </div>
  );
}