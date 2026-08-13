'use client';

import { useCallback, useEffect, useRef, useState } from 'react';

interface UseCountdownOptions {
  /** Seconds to start from as soon as the hook mounts. Omit to start manually. */
  initialSeconds?: number;
  /** Called once the countdown reaches zero. */
  onComplete?: () => void;
}

interface Countdown {
  secondsLeft: number;
  isRunning: boolean;
  start: (seconds: number) => void;
  stop: () => void;
}

/**
 * One second-by-second countdown, used for resend cooldowns and rate limits.
 * Clears its interval on unmount and on every restart.
 */
export function useCountdown({ initialSeconds = 0, onComplete }: UseCountdownOptions = {}): Countdown {
  const [secondsLeft, setSecondsLeft] = useState(initialSeconds);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const onCompleteRef = useRef(onComplete);

  useEffect(() => {
    onCompleteRef.current = onComplete;
  }, [onComplete]);

  const stop = useCallback(() => {
    if (intervalRef.current !== null) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  }, []);

  const start = useCallback(
    (seconds: number) => {
      stop();
      setSecondsLeft(seconds);

      if (seconds <= 0) {
        onCompleteRef.current?.();
        return;
      }

      intervalRef.current = setInterval(() => {
        setSecondsLeft((previous) => {
          if (previous <= 1) {
            stop();
            onCompleteRef.current?.();
            return 0;
          }
          return previous - 1;
        });
      }, 1000);
    },
    [stop]
  );

  useEffect(() => {
    if (initialSeconds > 0) start(initialSeconds);
    return stop;
    // Intentionally runs once: `initialSeconds` is the mount-time seed only.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return { secondsLeft, isRunning: secondsLeft > 0, start, stop };
}

/** Formats a second count as m:ss. */
export function formatCountdown(totalSeconds: number): string {
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${minutes}:${seconds.toString().padStart(2, '0')}`;
}
