'use client';

import { useState, useEffect, useRef } from 'react';
import { SurveyOption } from '@/lib/surveyInstruments';

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

interface MultiSelectQuestionProps {
  options: SurveyOption[];
  value: string[];
  otherValue: string;
  onChange: (selected: string[], otherText: string) => void;
  question: string;
  isK5: boolean;
  is912?: boolean;
}

export default function MultiSelectQuestion({
  options,
  value,
  otherValue,
  onChange,
  question,
  isK5,
  is912,
}: MultiSelectQuestionProps) {
  const [localOther, setLocalOther] = useState(otherValue);
  const [announcement, setAnnouncement] = useState('');
  const announceTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    setLocalOther(otherValue);
  }, [otherValue]);

  useEffect(() => {
    return () => {
      if (announceTimerRef.current) clearTimeout(announceTimerRef.current);
    };
  }, []);

  const announceTemporarily = (msg: string) => {
    if (announceTimerRef.current) clearTimeout(announceTimerRef.current);
    setAnnouncement(msg);
    announceTimerRef.current = setTimeout(() => setAnnouncement(''), 3000);
  };

  const mutuallyExclusiveOption = options.find((o) => o.mutuallyExclusive);
  const otherOption = options.find((o) => o.hasOtherInput);
  const isOtherSelected = otherOption ? value.includes(otherOption.value) : false;
  const isMutuallyExclusiveSelected = mutuallyExclusiveOption
    ? value.includes(mutuallyExclusiveOption.value)
    : false;

  const handleToggle = (optValue: string) => {
    let nextValue: string[];

    if (mutuallyExclusiveOption && optValue === mutuallyExclusiveOption.value) {
      if (isMutuallyExclusiveSelected) {
        nextValue = [];
        announceTemporarily(`${mutuallyExclusiveOption.label} unselected`);
      } else {
        nextValue = [mutuallyExclusiveOption.value];
        announceTemporarily(`${mutuallyExclusiveOption.label} selected. Cleared other selections.`);
      }
    } else {
      if (isMutuallyExclusiveSelected) {
        const target = options.find((o) => o.value === optValue);
        nextValue = [optValue];
        announceTemporarily(`${target?.label || optValue} selected. Cleared ${mutuallyExclusiveOption!.label}.`);
      } else if (value.includes(optValue)) {
        nextValue = value.filter((v) => v !== optValue);
        const target = options.find((o) => o.value === optValue);
        announceTemporarily(`${target?.label || optValue} unselected`);
      } else {
        nextValue = [...value, optValue];
        const target = options.find((o) => o.value === optValue);
        announceTemporarily(`${target?.label || optValue} selected`);
      }
    }

    const wasOther = isOtherSelected;
    const isNowOther = otherOption ? nextValue.includes(otherOption.value) : false;
    let nextOther = localOther;

    if (wasOther && !isNowOther) {
      nextOther = '';
      setLocalOther('');
    }

    onChange(nextValue, nextOther);
  };

  const handleOtherChange = (text: string) => {
    const limited = limitToMaxWords(text, 10);
    setLocalOther(limited);
    onChange(value, limited);
  };

  if (is912) {
    return (
      <div role="group" aria-label={question}>
        <div className="flex flex-col gap-2">
          {options.map((opt) => {
            const isSelected = value.includes(opt.value);

            return (
              <div key={opt.value}>
                <button
                  onClick={() => handleToggle(opt.value)}
                  className={`w-full text-left rounded-[16px] p-4 transition-all duration-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-iris focus-visible:ring-offset-2 active:scale-[0.99] cursor-pointer min-h-[48px] ${isSelected ? 'bg-sage-50' : 'bg-white'} ${isSelected ? 'border-2 border-sage' : 'border border-line'}`}
                  role="checkbox"
                  aria-checked={isSelected}
                  aria-label={opt.label}
                >
                  <div className="flex items-start gap-3">
                    <span
                      className={`w-5 h-5 rounded flex items-center justify-center flex-shrink-0 mt-0.5 transition-all duration-100 ${isSelected ? 'bg-sage' : 'bg-[#f4f2ed]'} ${isSelected ? 'border-2 border-sage' : 'border border-[#d0cdb8]'}`}
                    >
                      {isSelected && (
                        <i className="ri-check-line text-[12px] text-white"></i>
                      )}
                    </span>
                    <span
                      className={`text-[15px] font-medium leading-snug break-words ${isSelected ? 'text-sage' : 'text-ink'}`}
                    >
                      {opt.label}
                    </span>
                  </div>
                </button>

                {opt.hasOtherInput && isSelected && (
                  <div className="mt-2">
                    <div className="rounded-[12px] overflow-hidden bg-white border border-line">
                      <textarea
                        value={localOther}
                        onChange={(e) => handleOtherChange(e.target.value)}
                        placeholder="Specify"
                        aria-label={`Other: ${question}`}
                        rows={3}
                        className="w-full p-4 leading-relaxed resize-none focus:outline-none text-[15px] text-ink bg-transparent border-0"
                      />
                      <div className="flex items-center justify-between px-4 py-2.5 border-t border-t-[#f0eee9] bg-canvas">
                        <span className="text-[11px] font-medium text-sage">
                          Don&apos;t include your name or anyone else&apos;s
                        </span>
                        <span className="text-[11px] font-medium text-subtle">
                          {countWords(localOther)} / 10
                        </span>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        <div
          role="status"
          aria-live="polite"
          aria-atomic="true"
          className="sr-only absolute w-px h-px p-0 m-[-1px] overflow-hidden [clip:rect(0,0,0,0)] whitespace-nowrap border-0"
        >
          {announcement}
        </div>
      </div>
    );
  }

  if (!isK5) {
    return (
      <div role="group" aria-label={question}>
        <div className="flex flex-col gap-2.5">
          {options.map((opt) => {
            const isSelected = value.includes(opt.value);

            return (
              <div key={opt.value}>
                <button
                  onClick={() => handleToggle(opt.value)}
                  className={`w-full text-left rounded-2xl transition-all duration-[120ms] focus:outline-none focus-visible:ring-2 focus-visible:ring-iris focus-visible:ring-offset-2 active:scale-[0.99] cursor-pointer min-h-[54px] ${isSelected ? 'bg-sage-50' : 'bg-white'} ${isSelected ? 'border-2 border-sage' : 'border-[1.5px] border-line'} ${isSelected ? 'shadow-[0_4px_16px_rgba(88,109,77,0.12)]' : 'shadow-[0_1px_3px_rgba(0,0,0,0.03)]'}`}
                  role="checkbox"
                  aria-checked={isSelected}
                  aria-label={opt.label}
                >
                  <div className="flex items-start gap-3.5 px-4 py-3.5">
                    <span
                      className={`w-6 h-6 rounded-md flex items-center justify-center flex-shrink-0 mt-0.5 transition-all duration-[120ms] ${isSelected ? 'bg-sage' : 'bg-[#f0ede8]'} ${isSelected ? 'border-2 border-sage' : 'border-[1.5px] border-[#d6d2c8]'}`}
                    >
                      {isSelected && (
                        <i className="ri-check-line text-[13px] text-white"></i>
                      )}
                    </span>
                    <span
                      className={`text-[17px] font-medium leading-snug break-words ${isSelected ? 'text-sage' : 'text-ink'}`}
                    >
                      {opt.label}
                    </span>
                  </div>
                </button>

                {opt.hasOtherInput && isSelected && (
                  <div className="mt-2">
                    <div className="rounded-2xl overflow-hidden bg-white border-[1.5px] border-line shadow-[0_1px_3px_rgba(0,0,0,0.03)]">
                      <textarea
                        value={localOther}
                        onChange={(e) => handleOtherChange(e.target.value)}
                        placeholder="Tell us more..."
                        aria-label={`Other: ${question}`}
                        rows={3}
                        className="w-full p-4 leading-relaxed resize-none focus:outline-none text-ink bg-transparent border-0 text-[16px]"
                      />
                      <div className="flex items-center justify-between px-4 py-2.5 border-t border-t-[#f0eee9] bg-canvas">
                        <span className="text-[12px] font-medium text-sage">
                          Don&apos;t include your name or anyone else&apos;s
                        </span>
                        <span className="text-[12px] font-medium text-subtle">
                          {countWords(localOther)} / 10
                        </span>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        <div
          role="status"
          aria-live="polite"
          aria-atomic="true"
          className="sr-only absolute w-px h-px p-0 m-[-1px] overflow-hidden [clip:rect(0,0,0,0)] whitespace-nowrap border-0"
        >
          {announcement}
        </div>
      </div>
    );
  }

  return (
    <div role="group" aria-label={question}>
      <div className="flex flex-col gap-3">
        {options.map((opt) => {
          const isSelected = value.includes(opt.value);

          return (
            <div key={opt.value}>
              <button
                onClick={() => handleToggle(opt.value)}
                className={`w-full text-left rounded-[22px] py-5 px-5 transition-all duration-150 focus:outline-none focus-visible:ring-2 focus-visible:ring-iris focus-visible:ring-offset-2 active:scale-[0.98] cursor-pointer ${isSelected ? 'bg-sage-50' : 'bg-white'} ${isSelected ? 'border-2 border-sage' : 'border-2 border-line'} ${isSelected ? 'shadow-[0_4px_16px_rgba(88,109,77,0.12)]' : 'shadow-[0_2px_8px_rgba(0,0,0,0.03)]'}`}
                role="checkbox"
                aria-checked={isSelected}
                aria-label={opt.label}
              >
                <div className="flex items-start gap-4">
                  <span
                    className={`w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0 mt-0.5 transition-all duration-150 ${isSelected ? 'bg-sage' : 'bg-[#f0eee9]'} ${isSelected ? 'border-2 border-sage' : 'border-2 border-[#d8d5ce]'}`}
                  >
                    {isSelected && (
                      <i className="ri-check-line text-[18px] text-white"></i>
                    )}
                  </span>
                  <span
                    className={`text-[18px] font-semibold leading-snug break-words ${isSelected ? 'text-sage' : 'text-ink'}`}
                  >
                    {opt.label}
                  </span>
                </div>
              </button>

              {opt.hasOtherInput && isSelected && (
                <div
                  className="mt-2 [animation:k5SlideIn_200ms_ease_forwards]"
                >
                  <style>{`
                    @keyframes k5SlideIn {
                      from { opacity: 0; transform: translateY(-8px); }
                      to { opacity: 1; transform: translateY(0); }
                    }
                  `}</style>
                  <div className="rounded-[20px] overflow-hidden bg-white border-2 border-line">
                    <textarea
                      value={localOther}
                      onChange={(e) => handleOtherChange(e.target.value)}
                      placeholder="Tell us what..."
                      aria-label={`Other: ${question}`}
                      rows={3}
                      className="w-full p-4 leading-relaxed resize-none focus:outline-none text-ink bg-transparent border-0 text-[18px]"
                    />
                    <div className="flex items-center justify-between px-4 py-2 border-t border-t-[#f0eee9] bg-canvas">
                      <span className="text-[12px] font-medium text-sage">
                        Please don&apos;t type your name
                      </span>
                      <span className="text-[12px] font-medium text-subtle">
                        {countWords(localOther)} / 10
                      </span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      <div
        role="status"
        aria-live="polite"
        aria-atomic="true"
        className="sr-only absolute w-px h-px p-0 m-[-1px] overflow-hidden [clip:rect(0,0,0,0)] whitespace-nowrap border-0"
      >
        {announcement}
      </div>
    </div>
  );
}