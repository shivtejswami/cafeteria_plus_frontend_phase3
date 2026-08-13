'use client';

import { useState, useCallback, useEffect, useMemo } from 'react';
import SegmentedInput from '@/components/student-survey/SegmentedInput';
import ReadAloudButton from '@/components/student-survey/ReadAloudButton';

const MAX_ATTEMPTS = 5;
const RATE_LIMIT_MS = 30000;
const CORRECT_CODE = 'LUNCH7';

interface AccessCodeScreenProps {
  schoolName: string;
  onSuccess: () => void;
  isK5?: boolean;
  is912?: boolean;
}

export default function AccessCodeScreen({ schoolName, onSuccess, isK5 = true, is912 = false }: AccessCodeScreenProps) {
  const [code, setCode] = useState('');
  const [error, setError] = useState<false | 'invalid' | 'rateLimited'>(false);
  const [attempts, setAttempts] = useState(0);
  const [rateLimitUntil, setRateLimitUntil] = useState(0);
  const [isValidating, setIsValidating] = useState(false);
  const [countdown, setCountdown] = useState(0);

  const isRateLimited = Date.now() < rateLimitUntil;
  const codeComplete = code.length >= 4;
  const isDisabled = !codeComplete || isValidating || isRateLimited;

  const readAloudContent = useMemo(() => {
    let text = 'Type in the code. Your teacher will tell you the code.';
    if (error === 'invalid') {
      text += " That code didn't work. Try again, or ask your teacher.";
    } else if (error === 'rateLimited') {
      text += ` Let's wait a little bit. Try again in ${countdown} seconds.`;
    }
    return text;
  }, [error, countdown]);

  useEffect(() => {
    if (!isRateLimited) {
      setCountdown(0);
      return;
    }
    const remaining = Math.ceil((rateLimitUntil - Date.now()) / 1000);
    setCountdown(remaining);
    const interval = setInterval(() => {
      const next = Math.ceil((rateLimitUntil - Date.now()) / 1000);
      if (next <= 0) {
        clearInterval(interval);
        setCountdown(0);
        setError(false);
        setCode('');
      } else {
        setCountdown(next);
      }
    }, 1000);
    return () => clearInterval(interval);
  }, [isRateLimited, rateLimitUntil]);

  useEffect(() => {
    if (error === 'invalid') {
      const timer = setTimeout(() => {
        setCode('');
      }, 1200);
      return () => clearTimeout(timer);
    }
  }, [error]);

  const validateCode = useCallback(() => {
    if (isDisabled) return;

    if (isRateLimited) {
      setError('rateLimited');
      return;
    }

    setIsValidating(true);
    setError(false);

    setTimeout(() => {
      const nextAttempts = attempts + 1;
      setAttempts(nextAttempts);

      if (nextAttempts >= MAX_ATTEMPTS) {
        setRateLimitUntil(Date.now() + RATE_LIMIT_MS);
        setError('rateLimited');
        setIsValidating(false);
        return;
      }

      if (code.toUpperCase() === CORRECT_CODE) {
        setIsValidating(false);
        onSuccess();
        return;
      }

      setError('invalid');
      setIsValidating(false);
    }, 600);
  }, [code, isDisabled, isRateLimited, attempts, onSuccess]);

  if (is912) {
    return (
      <div className="min-h-screen flex flex-col bg-canvas">
        <div className="w-full bg-canvas">
          <div className="w-full max-w-[480px] mx-auto px-5 pt-6 pb-3">
            <span className="text-[14px] font-medium text-muted">
              {schoolName}
            </span>
          </div>
        </div>

        <div className="flex-1 w-full max-w-[480px] mx-auto px-5 pt-4 pb-10 flex flex-col">
          <h1
            className="text-[22px] leading-snug mb-1 text-ink font-bold"
          >
            Enter access code
          </h1>

          <p
            className="text-[14px] leading-relaxed mb-6 text-muted"
          >
            Provided by your teacher.
          </p>

          <div
            className="rounded-[14px] p-5 mb-5 bg-white border border-line"
          >
            <div role="group" aria-label="Access code">
              <SegmentedInput
                length={6}
                value={code}
                onChange={setCode}
                error={!!error && error !== 'rateLimited'}
                disabled={isRateLimited || isValidating}
                size="medium"
                numeric={true}
              />
            </div>

            {error && (
              <div
                className={`mt-4 rounded-[12px] px-4 py-3 flex items-start gap-3 ${error === 'rateLimited' ? 'bg-gold-50' : 'bg-[#faf5f5]'} border ${error === 'rateLimited' ? 'border-gold-150' : 'border-[#e8e0e0]'}`}
                role="alert"
                aria-live="polite"
              >
                <span className={`w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5 ${error === 'rateLimited' ? 'bg-[#fde8b5]' : 'bg-[#e8e0e0]'}`}
                >
                  <i
                    className={`${error === 'rateLimited' ? 'ri-time-line' : 'ri-error-warning-line'} text-[13px] ${error === 'rateLimited' ? 'text-[#8a6500]' : 'text-[#8b2c2c]'}`}
                  ></i>
                </span>
                <p
                  className={`text-[14px] font-medium leading-snug ${error === 'rateLimited' ? 'text-[#8a6500]' : 'text-[#8b2c2c]'}`}
                >
                  {error === 'rateLimited'
                    ? `Too many attempts. Try again in ${countdown}s.`
                    : 'Incorrect code. Check with your teacher.'}
                </p>
              </div>
            )}
          </div>

          <button
            onClick={validateCode}
            disabled={isDisabled}
            className={`mt-auto md:mt-0 w-full max-w-[335px] mx-auto rounded-full text-white text-[17px] sm:text-[18px] font-bold whitespace-nowrap transition-all duration-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-iris focus-visible:ring-offset-2 py-2 flex items-center justify-center gap-2 ${
              isDisabled ? 'cursor-not-allowed opacity-60' : 'hover:opacity-95 active:scale-[0.98]'
            } ${isDisabled ? 'bg-sage-300' : 'bg-sage'}`}
            aria-disabled={isDisabled}
          >
            {isValidating ? (
              <>
                <span
                  className="w-5 h-5 rounded-full border-2 animate-spin border-[rgba(255,255,255,0.3)] border-t-white"
                ></span>
                <span>Checking...</span>
              </>
            ) : (
              'Continue'
            )}
          </button>

          <p className="text-[13px] text-center mt-5 text-stone">
            Don&apos;t have a code? Ask your teacher.
          </p>
        </div>
      </div>
    );
  }

  if (!isK5) {
    return (
      <div className="min-h-screen flex flex-col bg-canvas">
        <div className="w-full bg-canvas">
          <div className="w-full max-w-[520px] mx-auto px-5 pt-6 pb-4">
            <span className="text-[14px] font-semibold text-muted">
              {schoolName}
            </span>
          </div>
        </div>

        <div className="flex-1 w-full max-w-[520px] mx-auto px-5 pt-4 pb-10 flex flex-col">
          <div className="text-center mb-6">
            <div
              className="w-16 h-16 rounded-[16px] flex items-center justify-center mx-auto mb-4 bg-sage-50"
            >
              <span className="w-8 h-8 flex items-center justify-center">
                <i className="ri-key-line text-[24px] text-sage"></i>
              </span>
            </div>
            <h1
              className="text-[22px] sm:text-[24px] leading-snug mb-2 text-ink font-bold"
            >
              Enter the access code
            </h1>
          </div>

          <p
            className="text-[15px] sm:text-[16px] leading-relaxed text-center mb-6 text-ink-700"
          >
            Your teacher will give you this code.
          </p>

          <div
            className="rounded-[20px] p-5 sm:p-6 mb-5 bg-white border border-line shadow-[0_2px_12px_rgba(0,0,0,0.03)]"
          >
            <div role="group" aria-label="Access code">
              <SegmentedInput
                length={6}
                value={code}
                onChange={setCode}
                error={!!error && error !== 'rateLimited'}
                disabled={isRateLimited || isValidating}
                size="medium"
                numeric={true}
              />
            </div>

            {error && (
              <div
                className={`mt-4 rounded-[16px] px-4 py-3 flex items-start gap-3 ${error === 'rateLimited' ? 'bg-gold-50' : 'bg-[#faf5f5]'} border ${error === 'rateLimited' ? 'border-gold-150' : 'border-[#e8e0e0]'}`}
                role="alert"
                aria-live="polite"
              >
                <span className={`w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5 ${error === 'rateLimited' ? 'bg-[#fde8b5]' : 'bg-[#e8e0e0]'}`}
                >
                  <i
                    className={`${error === 'rateLimited' ? 'ri-time-line' : 'ri-error-warning-line'} text-[14px] ${error === 'rateLimited' ? 'text-[#8a6500]' : 'text-[#8b2c2c]'}`}
                  ></i>
                </span>
                <p
                  className={`text-[14px] sm:text-[15px] font-medium leading-snug ${error === 'rateLimited' ? 'text-[#8a6500]' : 'text-[#8b2c2c]'}`}
                >
                  {error === 'rateLimited'
                    ? `Too many tries. You can try again in ${countdown} second${countdown === 1 ? '' : 's'}.`
                    : "That code isn't right. Check with your teacher and try again."}
                </p>
              </div>
            )}
          </div>

          <button
            onClick={validateCode}
            disabled={isDisabled}
            className={`mt-auto md:mt-0 w-full max-w-[335px] mx-auto rounded-full text-white text-[17px] sm:text-[18px] font-bold whitespace-nowrap transition-all duration-150 focus:outline-none focus-visible:ring-2 focus-visible:ring-iris focus-visible:ring-offset-2 py-2 flex items-center justify-center gap-2 ${
              isDisabled ? 'cursor-not-allowed opacity-60' : 'hover:opacity-95 active:scale-[0.97]'
            } ${isDisabled ? 'bg-sage-300' : 'bg-sage'} ${isDisabled ? 'shadow-none' : 'shadow-[0_4px_16px_rgba(88,109,77,0.25)]'}`}
            aria-disabled={isDisabled}
          >
            {isValidating ? (
              <>
                <span
                  className="w-5 h-5 rounded-full border-2 animate-spin border-[rgba(255,255,255,0.3)] border-t-white"
                ></span>
                <span>Checking...</span>
              </>
            ) : (
              'Continue'
            )}
          </button>

          <p className="text-[13px] text-center mt-5 text-stone">
            Don&apos;t have a code? Ask your teacher.
          </p>
        </div>
      </div>
    );
  }

  // K-5 version
  return (
    <div className="min-h-screen flex flex-col bg-canvas">

      <div
        className="w-full bg-[linear-gradient(180deg,_#f0eafb_0%,_#faf9f6_100%)] rounded-bl-[48px] rounded-br-[48px]"
      >
        <div className="w-full max-w-[520px] mx-auto px-5 pt-6 pb-10">
          <div className="flex items-center justify-between mb-8">
            <p className="text-[20px] font-bold text-ink">
              {schoolName}
            </p>
            <ReadAloudButton content={readAloudContent} />
          </div>

          <div className="text-center">
            <div
              className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-5 bg-white shadow-[0_4px_16px_rgba(109,40,217,0.12)]"
            >
              <span className="text-[36px]" role="img" aria-label="key">🔑</span>
            </div>
            <h1
              className="text-[22px] sm:text-[30px] font-bold mb-2 text-ink"
            >
              Type in the code
            </h1>
          </div>
        </div>
      </div>

      <div className="flex-1 w-full max-w-[520px] mx-auto px-5 pt-7 pb-10 flex flex-col">

        <p
          className="text-[18px] leading-relaxed text-center mb-8 text-ink-700"
        >
          Your teacher will tell you the code.
        </p>

        <div
          className="rounded-[28px] p-6 sm:p-8 mb-6 bg-white border border-line shadow-[0_2px_16px_rgba(0,0,0,0.03)]"
        >
          <div role="group" aria-label="Access code">
            <SegmentedInput
              length={6}
              value={code}
              onChange={setCode}
              error={!!error && error !== 'rateLimited'}
              disabled={isRateLimited || isValidating}
            />
          </div>

          {error && (
            <div
              className={`mt-5 rounded-2xl px-5 py-4 flex items-start gap-3 ${error === 'rateLimited' ? 'bg-gold-50' : 'bg-[#fef2f2]'} border ${error === 'rateLimited' ? 'border-gold-150' : 'border-[#fecaca]'}`}
              role="alert"
              aria-live="polite"
            >
              <span
                className={`w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0 ${error === 'rateLimited' ? 'bg-[#fde8b5]' : 'bg-[#fecaca]'}`}
              >
                <span className="text-[18px]" role="img" aria-hidden="true">
                  {error === 'rateLimited' ? '⏳' : '❓'}
                </span>
              </span>
              <p
                className={`text-[16px] font-semibold leading-snug ${error === 'rateLimited' ? 'text-[#8a6500]' : 'text-[#b91c1c]'}`}
              >
                {error === 'rateLimited'
                  ? `Let's wait a little bit. Try again in ${countdown} second${countdown === 1 ? '' : 's'}.`
                  : "That code didn't work. Try again, or ask your teacher."}
              </p>
            </div>
          )}
        </div>

        <button
          onClick={validateCode}
          disabled={isDisabled}
          className={`mt-auto md:mt-0 w-full max-w-[335px] mx-auto rounded-full text-white text-[17px] sm:text-[18px] font-bold whitespace-nowrap transition-all duration-150 focus:outline-none focus-visible:ring-4 focus-visible:ring-iris/30 py-2 flex items-center justify-center gap-2 ${
            isDisabled ? 'cursor-not-allowed opacity-60' : 'hover:opacity-95 active:scale-[0.98]'
          } ${isDisabled ? 'bg-sage-300' : 'bg-sage'} ${isDisabled ? 'shadow-none' : 'shadow-[0_6px_28px_rgba(88,109,77,0.40)]'}`}
          aria-disabled={isDisabled}
        >
          {isValidating ? (
            <>
              <span
                className="w-6 h-6 rounded-full border-2 animate-spin border-[rgba(255,255,255,0.3)] border-t-white"
              ></span>
              <span>Checking...</span>
            </>
          ) : (
            'Go'
          )}
        </button>

        <p className="text-[15px] text-center mt-6 text-stone">
          Don&apos;t have a code? Ask your teacher.
        </p>

      </div>
    </div>
  );
}