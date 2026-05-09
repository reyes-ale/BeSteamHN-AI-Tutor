'use client';
// ─────────────────────────────────────────────
//  GameCard — Embeddable launcher for any game
//  Use inside course pages, dashboards, modals
//
//  import GameCard from "@/components/games/GameCard"
//  <GameCard gameId="quiz-battle" courseData={...} />
// ─────────────────────────────────────────────
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { GameId } from '@/types/games';
import { GAME_CONFIGS } from '@/types/games';
import { useXP } from '@/hooks/useXPStore';
import { XPPopup } from '@/components/ui/GameShared';
import { addNotification } from '@/lib/notifications';

import QuizBattle from './QuizBattle';
import MemoryMatch from './MemoryMatch';
import DragDropChallenge from './DragDropChallenge';
import SpeedChallenge from './SpeedChallenge';
import SkyJump from './SkyJump';
import ColorDash from './ColorDash';

const GAME_COMPONENTS: Record<GameId, React.ComponentType<any>> = {
  'quiz-battle': QuizBattle,
  'memory-match': MemoryMatch,
  'drag-drop': DragDropChallenge,
  'speed-challenge': SpeedChallenge,
  'sky-jump': SkyJump,
  'color-dash': ColorDash,
};

interface Props {
  gameId: GameId;
  /** Optional: pass custom quiz data for course-specific games */
  courseData?: {
    questions?: any[];
    cards?: any[];
    items?: any[];
    zones?: any[];
  };
  /** Compact card (default) or full-page embed */
  variant?: 'card' | 'embed' | 'button';
  className?: string;
}

export default function GameCard({ gameId, courseData, variant = 'card', className = '' }: Props) {
  const [isOpen, setIsOpen] = useState(false);
  const config = GAME_CONFIGS[gameId];
  const { addXP, showXPPopup, lastXPEvent } = useXP();

  function handleComplete(score: number, xp: number) {
    addXP({ gameId, xpEarned: xp, score, timestamp: Date.now() });
    addNotification({
      type: 'reward',
      title: 'XP ganado',
      description: `${config.name} · +${xp} XP`,
    });
  }

  const GameComponent = GAME_COMPONENTS[gameId];

  // ── Button only ──
  if (variant === 'button') {
    return (
      <>
        <motion.button
          whileHover={{ scale: 1.04 }}
          whileTap={{ scale: 0.96 }}
          onClick={() => setIsOpen(true)}
          className={`inline-flex items-center gap-2 bg-gradient-to-r from-blue-500 to-violet-500 hover:from-blue-600 hover:to-violet-600 text-white font-black px-5 py-2.5 rounded-xl shadow-md transition-all ${className}`}
        >
          <span className="text-lg">{config.emoji}</span>
          <span>{variant === 'button' ? `🎮 Summary Game` : config.name}</span>
        </motion.button>

        <AnimatePresence>
          {isOpen && (
            <GameModal gameId={gameId} config={config} onClose={() => setIsOpen(false)}
              onComplete={handleComplete} GameComponent={GameComponent} courseData={courseData} />
          )}
        </AnimatePresence>
        <XPPopup event={lastXPEvent} show={showXPPopup} />
      </>
    );
  }

  // ── Embed (no modal, renders directly) ──
  if (variant === 'embed') {
    return (
      <div className={`rounded-3xl overflow-hidden shadow-lg ${className}`}>
        <GameComponent
          onComplete={handleComplete}
          onExit={undefined}
          {...(courseData ?? {})}
        />
        <XPPopup event={lastXPEvent} show={showXPPopup} />
      </div>
    );
  }

  // ── Default: Card ──
  return (
    <>
      <motion.div
        whileHover={{ y: -4, shadow: '0 20px 40px rgba(0,0,0,0.1)' }}
        onClick={() => setIsOpen(true)}
        className={`cursor-pointer bg-white rounded-3xl overflow-hidden shadow-sm border border-slate-100 hover:shadow-xl transition-all duration-300 ${className}`}
      >
        {/* Header gradient */}
        <div className={`bg-gradient-to-br ${config.bgGradient} p-6 flex items-center gap-4`}>
          <motion.div
            animate={{ rotate: [0, -5, 5, 0] }}
            transition={{ repeat: Infinity, duration: 3, ease: 'easeInOut' }}
            className="text-5xl"
          >
            {config.emoji}
          </motion.div>
          <div>
            <h3 className="font-black text-slate-800 text-lg">{config.name}</h3>
            <p className="text-slate-500 text-sm font-semibold">{config.description}</p>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 flex items-center justify-between">
          <div className="flex gap-2">
            <span className={`px-3 py-1 rounded-full text-xs font-bold ${
              config.difficulty === 'easy' ? 'bg-emerald-100 text-emerald-700' :
              config.difficulty === 'medium' ? 'bg-amber-100 text-amber-700' :
              'bg-red-100 text-red-700'
            }`}>
              {config.difficulty === 'easy' ? '⭐ Fácil' : config.difficulty === 'medium' ? '⭐⭐ Medio' : '⭐⭐⭐ Difícil'}
            </span>
            <span className="px-3 py-1 rounded-full text-xs font-bold bg-violet-100 text-violet-700">
              +{config.xpReward} XP
            </span>
          </div>
          <span className="text-blue-500 font-black text-sm">Jugar →</span>
        </div>
      </motion.div>

      <AnimatePresence>
        {isOpen && (
          <GameModal gameId={gameId} config={config} onClose={() => setIsOpen(false)}
            onComplete={handleComplete} GameComponent={GameComponent} courseData={courseData} />
        )}
      </AnimatePresence>
      <XPPopup event={lastXPEvent} show={showXPPopup} />
    </>
  );
}

// ── Modal wrapper ──────────────────────────────
function GameModal({ config, onClose, onComplete, GameComponent, courseData }: any) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
      onClick={e => { if (e.target === e.currentTarget) onClose(); }}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.95, opacity: 0, y: 10 }}
        transition={{ type: 'spring', stiffness: 300, damping: 30 }}
        className="w-full max-w-lg max-h-[90vh] overflow-y-auto bg-white rounded-3xl shadow-2xl"
      >
        <GameComponent
          onComplete={(score: number, xp: number) => { onComplete(score, xp); }}
          onExit={onClose}
          {...(courseData ?? {})}
        />
      </motion.div>
    </motion.div>
  );
}
