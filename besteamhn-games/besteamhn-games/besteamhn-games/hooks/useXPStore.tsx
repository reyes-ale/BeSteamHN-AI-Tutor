'use client';
// ─────────────────────────────────────────────
//  useXPStore — Global XP & Progression System
//  Compatible with React state or Zustand
// ─────────────────────────────────────────────
import { useState, useCallback, useEffect } from 'react';
import type { PlayerStats, XPEvent, GameId, Badge } from '@/types/games';
import { XP_LEVELS, BADGE_DEFINITIONS } from '@/data/mockData';

const STORAGE_KEY = 'besteamhn_player_stats';

const DEFAULT_STATS: PlayerStats = {
  totalXP: 1240,
  level: 3,
  streak: 12,
  badges: [BADGE_DEFINITIONS[0]],
  gameRecords: {
    'sky-jump': { highScore: 0, timesPlayed: 0, bestStreak: 0, lastPlayed: 0 },
    'color-dash': { highScore: 0, timesPlayed: 0, bestStreak: 0, lastPlayed: 0 },
    'quiz-battle': { highScore: 820, timesPlayed: 3, bestStreak: 5, lastPlayed: Date.now() },
    'memory-match': { highScore: 600, timesPlayed: 2, bestStreak: 0, lastPlayed: Date.now() },
    'drag-drop': { highScore: 400, timesPlayed: 1, bestStreak: 0, lastPlayed: Date.now() },
    'speed-challenge': { highScore: 0, timesPlayed: 0, bestStreak: 0, lastPlayed: 0 },
  },
};

export function getLevelInfo(xp: number) {
  let currentLevel = XP_LEVELS[0];
  let nextLevel = XP_LEVELS[1];
  for (let i = XP_LEVELS.length - 1; i >= 0; i--) {
    if (xp >= XP_LEVELS[i].minXP) {
      currentLevel = XP_LEVELS[i];
      nextLevel = XP_LEVELS[Math.min(i + 1, XP_LEVELS.length - 1)];
      break;
    }
  }
  const xpInLevel = xp - currentLevel.minXP;
  const xpForNext = nextLevel.minXP - currentLevel.minXP;
  const progress = nextLevel === currentLevel ? 100 : Math.round((xpInLevel / xpForNext) * 100);
  return { currentLevel, nextLevel, xpInLevel, xpForNext, progress };
}

export function useXPStore() {
  const [stats, setStats] = useState<PlayerStats>(() => {
    if (typeof window === 'undefined') return DEFAULT_STATS;
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      return stored ? JSON.parse(stored) : DEFAULT_STATS;
    } catch {
      return DEFAULT_STATS;
    }
  });

  const [lastXPEvent, setLastXPEvent] = useState<XPEvent | null>(null);
  const [showXPPopup, setShowXPPopup] = useState(false);

  // Persist on change
  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(stats));
    }
  }, [stats]);

  const addXP = useCallback((event: XPEvent) => {
    setStats(prev => {
      const newXP = prev.totalXP + event.xpEarned;
      const { currentLevel } = getLevelInfo(newXP);
      const record = prev.gameRecords[event.gameId];

      // Check for new badges
      const newBadges: Badge[] = [...prev.badges];
      if (!newBadges.find(b => b.id === 'first-game')) {
        newBadges.push({ ...BADGE_DEFINITIONS[0], unlockedAt: Date.now() });
      }
      if (event.accuracy === 1 && !newBadges.find(b => b.id === 'perfect')) {
        newBadges.push({ ...BADGE_DEFINITIONS[2], unlockedAt: Date.now() });
      }

      return {
        ...prev,
        totalXP: newXP,
        level: currentLevel.level,
        streak: prev.streak + 1,
        badges: newBadges,
        gameRecords: {
          ...prev.gameRecords,
          [event.gameId]: {
            highScore: Math.max(record.highScore, event.score),
            timesPlayed: record.timesPlayed + 1,
            bestStreak: Math.max(record.bestStreak, event.streak ?? 0),
            lastPlayed: event.timestamp,
          },
        },
      };
    });
    setLastXPEvent(event);
    setShowXPPopup(true);
    setTimeout(() => setShowXPPopup(false), 3000);
  }, []);

  const resetStats = useCallback(() => {
    setStats(DEFAULT_STATS);
    localStorage.removeItem(STORAGE_KEY);
  }, []);

  const levelInfo = getLevelInfo(stats.totalXP);

  return {
    stats,
    lastXPEvent,
    showXPPopup,
    levelInfo,
    addXP,
    resetStats,
  };
}

// ── Singleton context for sharing across components ──
import { createContext, useContext, ReactNode } from 'react';

interface XPContextValue {
  stats: PlayerStats;
  lastXPEvent: XPEvent | null;
  showXPPopup: boolean;
  levelInfo: ReturnType<typeof getLevelInfo>;
  addXP: (event: XPEvent) => void;
  resetStats: () => void;
}

const XPContext = createContext<XPContextValue | null>(null);

export function XPProvider({ children }: { children: ReactNode }) {
  const xp = useXPStore();
  return <XPContext.Provider value={xp}>{children}</XPContext.Provider>;
}

export function useXP() {
  const ctx = useContext(XPContext);
  if (!ctx) throw new Error('useXP must be used inside <XPProvider>');
  return ctx;
}
