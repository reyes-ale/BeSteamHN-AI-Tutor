'use client';
// ─────────────────────────────────────────────
//  SpeedChallenge — Arcade-speed quiz with streaks
//  Export: <SpeedChallenge onComplete={...} />
// ─────────────────────────────────────────────
import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { QuizQuestion } from '@/types/games';
import { SPEED_QUESTIONS } from '@/data/mockData';
import { useGameTimer } from '@/hooks/useGameTimer';
import { GameHeader, ResultsScreen, MascotRocket } from '@/components/ui/GameShared';

interface Props {
  questions?: (QuizQuestion & { timeLimit?: number })[];
  onComplete?: (score: number, xp: number) => void;
  onExit?: () => void;
}

const BASE_TIME = 10;

export default function SpeedChallenge({
  questions = SPEED_QUESTIONS.slice(0, 8),
  onComplete,
  onExit,
}: Props) {
  const [phase, setPhase] = useState<'intro' | 'playing' | 'results'>('intro');
  const [qIndex, setQIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);
  const [maxStreak, setMaxStreak] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [correct, setCorrect] = useState(0);
  const [answered, setAnswered] = useState(0);
  const [powerups, setPowerups] = useState({ freeze: 1, fifty: 1, skip: 2 });
  const [hiddenOptions, setHiddenOptions] = useState<number[]>([]);
  const [roundSpeed, setRoundSpeed] = useState(BASE_TIME);

  const currentQ = questions[qIndex];
  const isLast = qIndex >= questions.length - 1;

  const timer = useGameTimer({
    initialSeconds: roundSpeed,
    onExpire: () => {
      if (selected !== null) return;
      handleTimeout();
    },
  });

  function handleTimeout() {
    setStreak(0);
    setAnswered(a => a + 1);
    setSelected(-1);
    setTimeout(nextQuestion, 900);
  }

  function nextQuestion() {
    setSelected(null);
    setHiddenOptions([]);
    if (isLast) { setPhase('results'); return; }
    const newIdx = qIndex + 1;
    setQIndex(newIdx);
    const newSpeed = Math.max(4, BASE_TIME - Math.floor(newIdx / 2));
    setRoundSpeed(newSpeed);
    timer.reset(newSpeed);
    timer.start();
  }

  function handleAnswer(idx: number) {
    if (selected !== null || phase !== 'playing') return;
    timer.pause();
    setSelected(idx);
    const isCorrect = idx === currentQ.correctIndex;
    setAnswered(a => a + 1);

    if (isCorrect) {
      const timeBonus = timer.timeLeft * 15;
      const streakBonus = streak * 25;
      setScore(s => s + 100 + timeBonus + streakBonus);
      setStreak(s => {
        const ns = s + 1;
        setMaxStreak(ms => Math.max(ms, ns));
        return ns;
      });
      setCorrect(c => c + 1);
    } else {
      setStreak(0);
    }
    setTimeout(nextQuestion, 900);
  }

  function usePowerup(type: 'freeze' | 'fifty' | 'skip') {
    if (powerups[type] <= 0 || selected !== null) return;
    if (type === 'freeze') {
      timer.pause();
      setPowerups(p => ({ ...p, freeze: p.freeze - 1 }));
      setTimeout(() => timer.start(), 4000);
    } else if (type === 'fifty') {
      const wrongIdxs = [0, 1, 2, 3]
        .filter(i => i !== currentQ.correctIndex)
        .sort(() => Math.random() - 0.5)
        .slice(0, 2);
      setHiddenOptions(wrongIdxs);
      setPowerups(p => ({ ...p, fifty: p.fifty - 1 }));
    } else {
      setScore(s => Math.max(0, s - 10));
      setAnswered(a => a + 1);
      setPowerups(p => ({ ...p, skip: p.skip - 1 }));
      setTimeout(nextQuestion, 100);
    }
  }

  function startGame() {
    setPhase('playing');
    setQIndex(0);
    setScore(0);
    setStreak(0);
    setMaxStreak(0);
    setSelected(null);
    setCorrect(0);
    setAnswered(0);
    setPowerups({ freeze: 1, fifty: 1, skip: 2 });
    setHiddenOptions([]);
    setRoundSpeed(BASE_TIME);
    timer.reset(BASE_TIME);
    timer.start();
  }

  useEffect(() => {
    if (phase === 'results') onComplete?.(score, Math.round(score / 6));
  }, [phase]);

  const accuracy = answered > 0 ? correct / answered : 0;
  const pct = timer.percentLeft;
  const barColor = pct < 20 ? 'bg-red-400' : pct < 50 ? 'bg-amber-400' : 'bg-emerald-400';

  const POWERUP_DEFS = [
    { key: 'freeze' as const, emoji: '🧊', label: 'Congelar', count: powerups.freeze },
    { key: 'fifty' as const, emoji: '✂️', label: '50/50', count: powerups.fifty },
    { key: 'skip' as const, emoji: '⏭', label: 'Saltar', count: powerups.skip },
  ];

  return (
    <div className="flex flex-col min-h-full bg-gradient-to-br from-amber-50 via-yellow-50 to-orange-100 rounded-3xl p-5">

      {/* ── Intro ── */}
      {phase === 'intro' && (
        <div className="flex flex-col items-center justify-center min-h-[420px] gap-6">
          <MascotRocket size={100} animated />
          <div className="text-center">
            <h2 className="text-3xl font-black text-slate-800">⚡ Speed Challenge</h2>
            <p className="text-slate-500 mt-1 font-semibold">Velocidad máxima · Racha de respuestas</p>
          </div>
          <div className="bg-amber-100 border border-amber-200 rounded-2xl p-4 text-sm text-amber-800 font-semibold max-w-xs text-center">
            ⚠️ La velocidad aumenta con cada ronda. ¡Usa los power-ups sabiamente!
          </div>
          <div className="grid grid-cols-3 gap-3 w-full max-w-xs">
            {POWERUP_DEFS.map(p => (
              <div key={p.key} className="bg-white rounded-2xl p-3 text-center shadow-sm">
                <div className="text-2xl">{p.emoji}</div>
                <div className="text-xs font-black text-slate-600 mt-1">{p.label}</div>
                <div className="text-xs text-slate-400">x{p.count}</div>
              </div>
            ))}
          </div>
          <motion.button
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.96 }}
            onClick={startGame}
            className="bg-gradient-to-r from-amber-500 to-orange-500 text-white font-black text-lg px-10 py-4 rounded-2xl shadow-lg"
          >
            ¡Al máximo! ⚡
          </motion.button>
        </div>
      )}

      {/* ── Playing ── */}
      {phase === 'playing' && currentQ && (
        <>
          <GameHeader
            title="Speed Challenge"
            emoji="⚡"
            onExit={onExit ?? (() => setPhase('results'))}
            score={score}
          />

          {/* Streak */}
          {streak >= 2 && (
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="flex justify-center mb-2"
            >
              <div className="bg-gradient-to-r from-orange-400 to-red-400 text-white px-4 py-1.5 rounded-full font-black text-sm shadow-md">
                🔥 Racha x{streak} — +{streak * 25} bonus
              </div>
            </motion.div>
          )}

          {/* Speed timer bar */}
          <div className="mb-3">
            <div className="flex justify-between text-xs font-bold text-slate-500 mb-1">
              <span>Ronda {qIndex + 1}/{questions.length}</span>
              <span className={timer.isDanger ? 'text-red-500 font-black' : ''}>{timer.timeLeft}s</span>
            </div>
            <div className="h-4 bg-slate-100 rounded-full overflow-hidden">
              <motion.div
                animate={{ width: `${pct}%` }}
                transition={{ duration: 0.3, ease: 'linear' }}
                className={`h-full rounded-full transition-colors ${barColor}`}
              />
            </div>
          </div>

          {/* Power-ups */}
          <div className="flex gap-2 justify-center mb-3">
            {POWERUP_DEFS.map(p => (
              <button
                key={p.key}
                onClick={() => usePowerup(p.key)}
                disabled={p.count <= 0 || selected !== null}
                className={`flex items-center gap-1 px-3 py-1.5 rounded-xl text-xs font-bold border transition-all ${
                  p.count <= 0 || selected !== null
                    ? 'border-slate-200 text-slate-300 bg-slate-50 cursor-not-allowed'
                    : 'border-amber-300 bg-amber-50 text-amber-700 hover:bg-amber-100 active:scale-95'
                }`}
              >
                <span>{p.emoji}</span>
                <span>{p.label} ({p.count})</span>
              </button>
            ))}
          </div>

          {/* Question */}
          <AnimatePresence mode="wait">
            <motion.div
              key={qIndex}
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 1.05, y: -20 }}
              transition={{ duration: 0.2 }}
              className="bg-white rounded-3xl p-5 mb-4 shadow-sm border border-slate-100 text-center"
            >
              <div className="text-4xl mb-2">{currentQ.emoji}</div>
              <p className="text-lg font-black text-slate-800 leading-snug">{currentQ.question}</p>
            </motion.div>
          </AnimatePresence>

          {/* Options */}
          <div className="flex flex-col gap-2.5">
            {currentQ.options.map((opt, i) => {
              if (hiddenOptions.includes(i)) return null;
              const isSelected = selected === i;
              const isCorrect = i === currentQ.correctIndex;
              let cls = 'bg-white border-2 border-slate-200 hover:border-amber-400 hover:bg-amber-50 active:scale-[0.98]';
              if (selected !== null) {
                if (isCorrect) cls = 'bg-emerald-50 border-2 border-emerald-400';
                else if (isSelected) cls = 'bg-red-50 border-2 border-red-400';
                else cls = 'bg-slate-50 border-2 border-slate-100 opacity-50';
              }
              return (
                <motion.button
                  key={i}
                  layout
                  whileHover={selected === null ? { x: 4 } : {}}
                  onClick={() => handleAnswer(i)}
                  disabled={selected !== null}
                  className={`${cls} rounded-2xl p-4 text-left font-bold text-sm transition-all duration-150 flex items-center gap-3`}
                >
                  <span className={`w-7 h-7 rounded-lg flex items-center justify-center text-xs font-black flex-shrink-0 ${
                    selected !== null && isCorrect ? 'bg-emerald-500 text-white' :
                    selected !== null && isSelected && !isCorrect ? 'bg-red-400 text-white' :
                    'bg-slate-100 text-slate-500'
                  }`}>
                    {['A','B','C','D'][i]}
                  </span>
                  {opt}
                </motion.button>
              );
            })}

            {/* Timeout state */}
            {selected === -1 && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center text-red-500 font-black py-2"
              >
                ⏰ ¡Tiempo! La respuesta era: {currentQ.options[currentQ.correctIndex]}
              </motion.div>
            )}
          </div>
        </>
      )}

      {/* ── Results ── */}
      {phase === 'results' && (
        <ResultsScreen
          score={score}
          xpEarned={Math.round(score / 6)}
          accuracy={accuracy}
          streak={maxStreak}
          onPlayAgain={startGame}
          onExit={onExit ?? (() => {})}
          won={correct > answered / 2}
        />
      )}
    </div>
  );
}
