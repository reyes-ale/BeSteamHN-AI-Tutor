// ─────────────────────────────────────────────
//  BESTEAMHN AI Tutor — Game System Types
// ─────────────────────────────────────────────

export type GameId =
  | 'sky-jump'
  | 'color-dash'
  | 'quiz-battle'
  | 'memory-match'
  | 'drag-drop'
  | 'speed-challenge';

export type GameDifficulty = 'easy' | 'medium' | 'hard';
export type GameStatus = 'idle' | 'playing' | 'paused' | 'gameover' | 'completed';

// ── XP & Progression ──────────────────────────
export interface XPEvent {
  gameId: GameId;
  xpEarned: number;
  score: number;
  accuracy?: number;
  streak?: number;
  timestamp: number;
}

export interface PlayerStats {
  totalXP: number;
  level: number;
  streak: number;
  badges: Badge[];
  gameRecords: Record<GameId, GameRecord>;
}

export interface GameRecord {
  highScore: number;
  timesPlayed: number;
  bestStreak: number;
  lastPlayed: number;
}

// ── Badges ────────────────────────────────────
export interface Badge {
  id: string;
  name: string;
  emoji: string;
  description: string;
  unlockedAt: number;
}

export const BADGE_DEFINITIONS: Badge[] = [
  { id: 'first-game', name: 'Primer juego', emoji: '🎮', description: 'Jugaste tu primer mini juego', unlockedAt: 0 },
  { id: 'streak-5', name: 'En racha', emoji: '🔥', description: '5 respuestas correctas seguidas', unlockedAt: 0 },
  { id: 'perfect', name: 'Perfecto', emoji: '⭐', description: '100% de precisión en un juego', unlockedAt: 0 },
  { id: 'speedster', name: 'Velocista', emoji: '⚡', description: 'Completa Speed Challenge en menos de 30s', unlockedAt: 0 },
  { id: 'memory-master', name: 'Memoria de acero', emoji: '🧠', description: 'Memory Match sin errores', unlockedAt: 0 },
];

// ── Quiz / Summary Games ───────────────────────
export interface QuizQuestion {
  id: string;
  question: string;
  emoji: string;
  options: string[];
  correctIndex: number;
  explanation?: string;
  topicTag: string;
}

export interface MemoryCard {
  id: string;
  content: string;
  emoji: string;
  matchId: string;
  type: 'term' | 'definition';
}

export interface DragDropItem {
  id: string;
  text: string;
  emoji: string;
  correctZoneId: string;
}

export interface DragDropZone {
  id: string;
  label: string;
  color: string;
}

// ── Game Config ───────────────────────────────
export interface GameConfig {
  id: GameId;
  name: string;
  description: string;
  emoji: string;
  color: string;
  bgGradient: string;
  difficulty: GameDifficulty;
  xpReward: number;
  maxDuration?: number; // seconds
}

export const GAME_CONFIGS: Record<GameId, GameConfig> = {
  'sky-jump': {
    id: 'sky-jump',
    name: 'Sky Jump',
    description: '¡Salta obstáculos y llega más lejos!',
    emoji: '🦘',
    color: '#93c5fd',
    bgGradient: 'from-blue-100 via-sky-50 to-indigo-100',
    difficulty: 'easy',
    xpReward: 80,
  },
  'color-dash': {
    id: 'color-dash',
    name: 'Color Dash',
    description: '¡Reflejos rápidos y colores explosivos!',
    emoji: '🎨',
    color: '#f9a8d4',
    bgGradient: 'from-pink-100 via-rose-50 to-purple-100',
    difficulty: 'medium',
    xpReward: 100,
  },
  'quiz-battle': {
    id: 'quiz-battle',
    name: 'Quiz Battle',
    description: 'Responde rápido y acumula combos',
    emoji: '⚔️',
    color: '#93c5fd',
    bgGradient: 'from-blue-100 to-indigo-100',
    difficulty: 'medium',
    xpReward: 150,
    maxDuration: 120,
  },
  'memory-match': {
    id: 'memory-match',
    name: 'Memory Match',
    description: 'Empareja conceptos con sus definiciones',
    emoji: '🧠',
    color: '#c4b5fd',
    bgGradient: 'from-violet-100 to-purple-100',
    difficulty: 'easy',
    xpReward: 120,
    maxDuration: 90,
  },
  'drag-drop': {
    id: 'drag-drop',
    name: 'Drag & Drop',
    description: 'Organiza y clasifica con precisión',
    emoji: '🎯',
    color: '#86efac',
    bgGradient: 'from-green-100 to-teal-100',
    difficulty: 'medium',
    xpReward: 130,
    maxDuration: 60,
  },
  'speed-challenge': {
    id: 'speed-challenge',
    name: 'Speed Challenge',
    description: '¡Velocidad máxima! Responde antes de que acabe el tiempo',
    emoji: '⚡',
    color: '#fde68a',
    bgGradient: 'from-yellow-100 to-amber-100',
    difficulty: 'hard',
    xpReward: 200,
    maxDuration: 45,
  },
};

// ── Leaderboard ───────────────────────────────
export interface LeaderboardEntry {
  rank: number;
  name: string;
  avatar: string;
  score: number;
  xp: number;
  isCurrentUser?: boolean;
}
