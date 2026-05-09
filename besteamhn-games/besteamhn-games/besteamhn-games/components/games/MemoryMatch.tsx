'use client';
// ─────────────────────────────────────────────
//  MemoryMatch — Flip cards to match concepts
//  Export: <MemoryMatch cards={...} onComplete={...} />
// ─────────────────────────────────────────────
import { useState, useCallback, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { MemoryCard } from '@/types/games';
import { MEMORY_CARDS } from '@/data/mockData';
import { useGameTimer } from '@/hooks/useGameTimer';
import { GameHeader, TimerBar, ResultsScreen, MascotBee } from '@/components/ui/GameShared';

type CardState = 'hidden' | 'flipped' | 'matched' | 'wrong';

interface Props {
  cards?: MemoryCard[];
  onComplete?: (score: number, xp: number) => void;
  onExit?: () => void;
}

export default function MemoryMatch({
  cards = MEMORY_CARDS,
  onComplete,
  onExit,
}: Props) {
  const [phase, setPhase] = useState<'intro' | 'playing' | 'results'>('intro');
  const [shuffled, setShuffled] = useState<MemoryCard[]>([]);
  const [cardStates, setCardStates] = useState<Record<string, CardState>>({});
  const [flipped, setFlipped] = useState<string[]>([]);
  const [score, setScore] = useState(0);
  const [mistakes, setMistakes] = useState(0);
  const [pairs, setPairs] = useState(0);
  const lockRef = useRef(false);
  const totalPairs = cards.length / 2;

  const timer = useGameTimer({
    initialSeconds: 90,
    onExpire: () => setPhase('results'),
  });

  function initGame() {
    const s = [...cards].sort(() => Math.random() - 0.5);
    setShuffled(s);
    setCardStates(Object.fromEntries(s.map(c => [c.id, 'hidden'])));
    setFlipped([]);
    setScore(0);
    setMistakes(0);
    setPairs(0);
    lockRef.current = false;
    setPhase('playing');
    timer.reset(90);
    timer.start();
  }

  function handleFlip(cardId: string) {
    if (lockRef.current) return;
    if (cardStates[cardId] === 'matched' || cardStates[cardId] === 'flipped') return;

    const newFlipped = [...flipped, cardId];
    setCardStates(prev => ({ ...prev, [cardId]: 'flipped' }));
    setFlipped(newFlipped);

    if (newFlipped.length === 2) {
      lockRef.current = true;
      const [a, b] = newFlipped;
      const cardA = shuffled.find(c => c.id === a)!;
      const cardB = shuffled.find(c => c.id === b)!;
      const isMatch = cardA.matchId === cardB.id || cardB.matchId === cardA.id;

      setTimeout(() => {
        if (isMatch) {
          setCardStates(prev => ({ ...prev, [a]: 'matched', [b]: 'matched' }));
          const timeBonus = Math.round(timer.timeLeft * 3);
          const accuracyBonus = mistakes === 0 ? 100 : 0;
          setScore(s => s + 150 + timeBonus + accuracyBonus);
          const newPairs = pairs + 1;
          setPairs(newPairs);
          if (newPairs === totalPairs) {
            timer.pause();
            setTimeout(() => setPhase('results'), 600);
          }
        } else {
          setCardStates(prev => ({ ...prev, [a]: 'wrong', [b]: 'wrong' }));
          setMistakes(m => m + 1);
          setTimeout(() => {
            setCardStates(prev => ({ ...prev, [a]: 'hidden', [b]: 'hidden' }));
          }, 500);
        }
        setFlipped([]);
        lockRef.current = false;
      }, 800);
    }
  }

  useEffect(() => {
    if (phase === 'results') onComplete?.(score, Math.round(score / 8));
  }, [phase]);

  const accuracy = pairs > 0 ? pairs / (pairs + mistakes) : 0;

  const cardBg: Record<CardState, string> = {
    hidden: 'bg-gradient-to-br from-blue-400 to-violet-500',
    flipped: 'bg-white border-2 border-blue-300',
    matched: 'bg-gradient-to-br from-emerald-100 to-teal-100 border-2 border-emerald-400',
    wrong: 'bg-gradient-to-br from-red-100 to-rose-100 border-2 border-red-300',
  };

  const starsCount = accuracy >= 0.9 && mistakes <= 2 ? 3 : accuracy >= 0.7 ? 2 : 1;

  return (
    <div className="flex flex-col min-h-full bg-gradient-to-br from-violet-50 via-purple-50 to-pink-100 rounded-3xl p-5">

      {/* ── Intro ── */}
      {phase === 'intro' && (
        <div className="flex flex-col items-center justify-center min-h-[400px] gap-6">
          <MascotBee size={100} mood="thinking" />
          <div className="text-center">
            <h2 className="text-3xl font-black text-slate-800">🧠 Memory Match</h2>
            <p className="text-slate-500 mt-1 font-semibold">Empareja cada concepto con su definición</p>
          </div>
          <div className="grid grid-cols-3 gap-3 text-center">
            {[
              { icon: '🃏', label: `${cards.length} cartas` },
              { icon: '⏱', label: '90 segundos' },
              { icon: '🎯', label: `${totalPairs} pares` },
            ].map(item => (
              <div key={item.label} className="bg-white rounded-2xl px-4 py-3 shadow-sm">
                <div className="text-2xl">{item.icon}</div>
                <div className="text-xs text-slate-500 font-bold mt-1">{item.label}</div>
              </div>
            ))}
          </div>
          <p className="text-sm text-slate-400 font-semibold max-w-xs text-center">
            Toca dos cartas para revelarlas. Si hacen pareja, se quedan abiertas.
          </p>
          <motion.button
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.96 }}
            onClick={initGame}
            className="bg-gradient-to-r from-violet-500 to-pink-500 text-white font-black text-lg px-10 py-4 rounded-2xl shadow-lg"
          >
            ¡Empezar! 🃏
          </motion.button>
        </div>
      )}

      {/* ── Playing ── */}
      {phase === 'playing' && (
        <>
          <GameHeader
            title="Memory Match"
            emoji="🧠"
            onExit={onExit ?? (() => setPhase('results'))}
          />

          <div className="flex items-center justify-between mb-3">
            <TimerBar
              percentLeft={timer.percentLeft}
              isWarning={timer.isWarning}
              isDanger={timer.isDanger}
              timeLeft={timer.timeLeft}
            />
          </div>

          <div className="flex justify-between items-center mb-4 px-1">
            <span className="text-sm font-bold text-slate-500">
              Pares: <span className="text-violet-600 font-black">{pairs}/{totalPairs}</span>
            </span>
            <span className="text-sm font-bold text-slate-500">
              Errores: <span className="text-red-400 font-black">{mistakes}</span>
            </span>
          </div>

          {/* Grid */}
          <div className="grid grid-cols-4 gap-2.5">
            {shuffled.map(card => {
              const state = cardStates[card.id] ?? 'hidden';
              return (
                <motion.button
                  key={card.id}
                  onClick={() => handleFlip(card.id)}
                  whileHover={state === 'hidden' ? { scale: 1.05 } : {}}
                  whileTap={state === 'hidden' ? { scale: 0.95 } : {}}
                  animate={{
                    rotateY: state === 'hidden' ? 0 : 180,
                  }}
                  className="aspect-square"
                  style={{ perspective: 600 }}
                >
                  <motion.div
                    animate={{ rotateY: state === 'hidden' ? 0 : 180 }}
                    transition={{ duration: 0.4, type: 'spring', stiffness: 300 }}
                    className="w-full h-full relative"
                    style={{ transformStyle: 'preserve-3d' }}
                  >
                    {/* Front (hidden) */}
                    <div
                      className={`absolute inset-0 rounded-2xl flex items-center justify-center ${cardBg.hidden} shadow-sm`}
                      style={{ backfaceVisibility: 'hidden' }}
                    >
                      <span className="text-2xl text-white/70">?</span>
                    </div>
                    {/* Back (revealed) */}
                    <div
                      className={`absolute inset-0 rounded-2xl flex flex-col items-center justify-center gap-1 p-2 ${cardBg[state === 'hidden' ? 'hidden' : state]}`}
                      style={{ backfaceVisibility: 'hidden', transform: 'rotateY(180deg)' }}
                    >
                      <span className="text-xl">{card.emoji}</span>
                      <span className="text-[10px] font-black text-center leading-tight text-slate-700 line-clamp-2">
                        {card.content}
                      </span>
                    </div>
                  </motion.div>
                </motion.button>
              );
            })}
          </div>

          {/* Stars */}
          <div className="flex justify-center gap-1 mt-4">
            {[1, 2, 3].map(i => (
              <span key={i} className="text-2xl">
                {i <= starsCount ? '⭐' : '☆'}
              </span>
            ))}
          </div>
        </>
      )}

      {/* ── Results ── */}
      {phase === 'results' && (
        <ResultsScreen
          score={score}
          xpEarned={Math.round(score / 8)}
          accuracy={accuracy}
          streak={pairs}
          onPlayAgain={initGame}
          onExit={onExit ?? (() => {})}
          won={pairs === totalPairs}
        />
      )}
    </div>
  );
}
