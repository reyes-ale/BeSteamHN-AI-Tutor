'use client';
// ─────────────────────────────────────────────
//  SummaryGameButton — Drop anywhere in a course
//
//  import SummaryGameButton from "@/components/games/SummaryGameButton"
//  <SummaryGameButton courseTitle="Biología" questions={myQuestions} />
// ─────────────────────────────────────────────
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { GameId, QuizQuestion, MemoryCard, DragDropItem, DragDropZone } from '@/types/games';
import { useXP } from '@/hooks/useXPStore';
import { XPPopup } from '@/components/ui/GameShared';
import QuizBattle from './QuizBattle';
import MemoryMatch from './MemoryMatch';
import DragDropChallenge from './DragDropChallenge';
import SpeedChallenge from './SpeedChallenge';

interface Props {
  courseTitle?: string;
  /** Pass course-specific questions — falls back to mock data */
  questions?: QuizQuestion[];
  memoryCards?: MemoryCard[];
  dragItems?: DragDropItem[];
  dragZones?: DragDropZone[];
  /** Visual variant */
  variant?: 'primary' | 'secondary' | 'inline';
}

type SelectedGame = GameId | null;

const GAME_OPTIONS: Array<{ id: GameId; name: string; emoji: string; desc: string; color: string }> = [
  { id: 'quiz-battle', name: 'Quiz Battle', emoji: '⚔️', desc: 'Preguntas + combos', color: 'from-blue-400 to-violet-400' },
  { id: 'memory-match', name: 'Memory Match', emoji: '🧠', desc: 'Empareja conceptos', color: 'from-violet-400 to-pink-400' },
  { id: 'drag-drop', name: 'Drag & Drop', emoji: '🎯', desc: 'Clasifica elementos', color: 'from-emerald-400 to-teal-400' },
  { id: 'speed-challenge', name: 'Speed Run', emoji: '⚡', desc: 'Máxima velocidad', color: 'from-amber-400 to-orange-400' },
];

export default function SummaryGameButton({
  courseTitle = 'este tema',
  questions,
  memoryCards,
  dragItems,
  dragZones,
  variant = 'primary',
}: Props) {
  const [showPicker, setShowPicker] = useState(false);
  const [selectedGame, setSelectedGame] = useState<SelectedGame>(null);
  const { addXP, showXPPopup, lastXPEvent } = useXP();

  function handleComplete(score: number, xp: number) {
    addXP({ gameId: selectedGame!, xpEarned: xp, score, timestamp: Date.now() });
  }

  function launchGame(id: GameId) {
    setSelectedGame(id);
    setShowPicker(false);
  }

  function closeGame() {
    setSelectedGame(null);
  }

  const btnCls = {
    primary: 'bg-gradient-to-r from-blue-500 to-violet-500 hover:from-blue-600 hover:to-violet-600 text-white shadow-lg hover:shadow-xl',
    secondary: 'bg-white border-2 border-blue-200 hover:border-blue-400 text-blue-700 hover:bg-blue-50',
    inline: 'bg-blue-50 hover:bg-blue-100 text-blue-700 border border-blue-200',
  }[variant];

  return (
    <>
      {/* ── Trigger button ── */}
      <motion.button
        whileHover={{ scale: 1.03 }}
        whileTap={{ scale: 0.97 }}
        onClick={() => setShowPicker(true)}
        className={`inline-flex items-center gap-2.5 font-black px-5 py-3 rounded-2xl transition-all ${btnCls}`}
      >
        <span className="text-xl">🎮</span>
        <span>Hacer Summary Game</span>
        <span className="opacity-70 text-sm font-bold ml-1">→</span>
      </motion.button>

      {/* ── Picker modal ── */}
      <AnimatePresence>
        {showPicker && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
            onClick={e => { if (e.target === e.currentTarget) setShowPicker(false); }}
          >
            <motion.div
              initial={{ y: 60, opacity: 0, scale: 0.95 }}
              animate={{ y: 0, opacity: 1, scale: 1 }}
              exit={{ y: 40, opacity: 0 }}
              transition={{ type: 'spring', stiffness: 350, damping: 35 }}
              className="w-full max-w-md bg-white rounded-3xl shadow-2xl overflow-hidden"
            >
              {/* Header */}
              <div className="bg-gradient-to-r from-blue-500 via-violet-500 to-pink-500 p-6 text-white">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-white/70 text-sm font-semibold">{courseTitle}</p>
                    <h3 className="text-2xl font-black mt-0.5">🎮 ¿Qué modo quieres?</h3>
                  </div>
                  <button onClick={() => setShowPicker(false)} className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center text-white hover:bg-white/30 font-bold">
                    ✕
                  </button>
                </div>
              </div>

              {/* Game options */}
              <div className="p-4 grid grid-cols-2 gap-3">
                {GAME_OPTIONS.map((g, i) => (
                  <motion.button
                    key={g.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.06 }}
                    whileHover={{ scale: 1.03, y: -2 }}
                    whileTap={{ scale: 0.96 }}
                    onClick={() => launchGame(g.id)}
                    className="text-left bg-white border-2 border-slate-100 hover:border-transparent rounded-2xl p-4 transition-all hover:shadow-lg group"
                  >
                    <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${g.color} flex items-center justify-center text-2xl mb-3 shadow-md group-hover:scale-110 transition-transform`}>
                      {g.emoji}
                    </div>
                    <div className="font-black text-slate-800 text-sm">{g.name}</div>
                    <div className="text-xs text-slate-400 font-semibold mt-0.5">{g.desc}</div>
                  </motion.button>
                ))}
              </div>

              {/* Challenge mode button */}
              <div className="px-4 pb-4">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={() => launchGame('speed-challenge')}
                  className="w-full bg-gradient-to-r from-amber-400 to-orange-500 text-white font-black py-3.5 rounded-2xl flex items-center justify-center gap-2 shadow-md hover:shadow-lg"
                >
                  <span>⚡</span>
                  <span>Challenge Mode — ¡Modo difícil!</span>
                  <span>⚡</span>
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Active game modal ── */}
      <AnimatePresence>
        {selectedGame && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0 }}
              transition={{ type: 'spring', stiffness: 300, damping: 30 }}
              className="w-full max-w-lg max-h-[92vh] overflow-y-auto bg-white rounded-3xl shadow-2xl"
            >
              {selectedGame === 'quiz-battle' && (
                <QuizBattle questions={questions} onComplete={handleComplete} onExit={closeGame} />
              )}
              {selectedGame === 'memory-match' && (
                <MemoryMatch cards={memoryCards} onComplete={handleComplete} onExit={closeGame} />
              )}
              {selectedGame === 'drag-drop' && (
                <DragDropChallenge items={dragItems} zones={dragZones} onComplete={handleComplete} onExit={closeGame} />
              )}
              {selectedGame === 'speed-challenge' && (
                <SpeedChallenge questions={questions as any} onComplete={handleComplete} onExit={closeGame} />
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <XPPopup event={lastXPEvent} show={showXPPopup} />
    </>
  );
}
