'use client';
// ─────────────────────────────────────────────
//  useGameTimer — Reusable countdown timer hook
// ─────────────────────────────────────────────
import { useState, useEffect, useRef, useCallback } from 'react';

interface UseGameTimerOptions {
  initialSeconds: number;
  onExpire?: () => void;
  autoStart?: boolean;
}

export function useGameTimer({
  initialSeconds,
  onExpire,
  autoStart = false,
}: UseGameTimerOptions) {
  const [timeLeft, setTimeLeft] = useState(initialSeconds);
  const [isRunning, setIsRunning] = useState(autoStart);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const onExpireRef = useRef(onExpire);
  onExpireRef.current = onExpire;

  const clear = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  }, []);

  useEffect(() => {
    if (!isRunning) { clear(); return; }
    intervalRef.current = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          clear();
          setIsRunning(false);
          onExpireRef.current?.();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return clear;
  }, [isRunning, clear]);

  const start = useCallback(() => { setIsRunning(true); }, []);
  const pause = useCallback(() => { setIsRunning(false); }, []);
  const reset = useCallback((newTime?: number) => {
    clear();
    setIsRunning(false);
    setTimeLeft(newTime ?? initialSeconds);
  }, [clear, initialSeconds]);

  const percentLeft = Math.round((timeLeft / initialSeconds) * 100);
  const isWarning = percentLeft <= 30;
  const isDanger = percentLeft <= 15;

  return { timeLeft, isRunning, percentLeft, isWarning, isDanger, start, pause, reset };
}
