// ─────────────────────────────────────────────
//  BESTEAMHN AI Tutor — Games Index
//  Import anything from here:
//
//  import { GameHub, GameCard, SummaryGameButton } from "@/components/games"
//  import { QuizBattle, MemoryMatch } from "@/components/games"
// ─────────────────────────────────────────────

// ── Core game components ──────────────────────
export { default as QuizBattle } from './QuizBattle';
export { default as MemoryMatch } from './MemoryMatch';
export { default as DragDropChallenge } from './DragDropChallenge';
export { default as SpeedChallenge } from './SpeedChallenge';
export { default as SkyJump } from './SkyJump';
export { default as ColorDash } from './ColorDash';

// ── Launcher / integration components ─────────
export { default as GameCard } from './GameCard';
export { default as GameHub } from './GameHub';
export { default as SummaryGameButton } from './SummaryGameButton';

// ── Shared UI ─────────────────────────────────
export {
  MascotBee,
  MascotRocket,
  TimerBar,
  ScoreBadge,
  XPPopup,
  GameHeader,
  ResultsScreen,
  GameCountdown,
} from '@/components/ui/GameShared';

// ── Hooks ─────────────────────────────────────
export { useXP, XPProvider, useXPStore, getLevelInfo } from '@/hooks/useXPStore';
export { useGameTimer } from '@/hooks/useGameTimer';

// ── Types ─────────────────────────────────────
export type {
  GameId,
  GameConfig,
  QuizQuestion,
  MemoryCard,
  DragDropItem,
  DragDropZone,
  PlayerStats,
  XPEvent,
  Badge,
} from '@/types/games';

export { GAME_CONFIGS } from '@/types/games';

// ── Data ──────────────────────────────────────
export {
  QUIZ_QUESTIONS,
  MEMORY_CARDS,
  DD_ITEMS,
  DD_ZONES,
  SPEED_QUESTIONS,
  LEADERBOARD_DATA,
  XP_LEVELS,
} from '@/data/mockData';
