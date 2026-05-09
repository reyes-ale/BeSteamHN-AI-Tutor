'use client';
// ─────────────────────────────────────────────
//  ColorDash — Fast reflex color-matching game
//  Export: <ColorDash onComplete={...} onExit={...} />
// ─────────────────────────────────────────────
import { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MascotBee, ResultsScreen } from '@/components/ui/GameShared';

interface Props {
  onComplete?: (score: number, xp: number) => void;
  onExit?: () => void;
}

const COLORS = [
  { name: 'Azul', bg: 'bg-blue-400', hex: '#60a5fa', text: 'text-blue-900' },
  { name: 'Rosa', bg: 'bg-pink-400', hex: '#f472b6', text: 'text-pink-900' },
  { name: 'Verde', bg: 'bg-emerald-400', hex: '#34d399', text: 'text-emerald-900' },
  { name: 'Naranja', bg: 'bg-orange-400', hex: '#fb923c', text: 'text-orange-900' },
  { name: 'Violeta', bg: 'bg-violet-400', hex: '#a78bfa', text: 'text-violet-900' },
  { name: 'Amarillo', bg: 'bg-yellow-400', hex: '#facc15', text: 'text-yellow-900' },
];

type Phase = 'intro' | 'playing' | 'results';

interface Round {
  targetColor: typeof COLORS[0];
  displayedWord: string;
  displayedColorHex: string;
  correctButton: number; // index
}

function generateRound(level: number): Round {
  const target = COLORS[Math.floor(Math.random() * COLORS.length)];
  // Sometimes word != displayed color (Stroop effect at higher levels)
  const wordColor = level > 5 && Math.random() < 0.5
    ? COLORS[Math.floor(Math.random() * COLORS.length)]
    : target;
  return {
    targetColor: target,
    displayedWord: wordColor.name,
    displayedColorHex: wordColor.hex,
    correctButton: COLORS.indexOf(target),
  };
}

export default function ColorDash({ onComplete, onExit }: Props) {
  const [phase, setPhase] = useState<Phase>('intro');
  const [round, setRound] = useState<Round | null>(null);
  const [score, setScore] = useState(0);
  const [combo, setCombo] = useState(0);
  const [maxCombo, setMaxCombo] = useState(0);
  const [roundNum, setRoundNum] = useState(0);
  const [totalRounds] = useState(20);
  const [timeLeft, setTimeLeft] = useState(100); // 0-100%
  const [correct, setCorrect] = useState(0);
  const [feedback, setFeedback] = useState<'correct' | 'wrong' | null>(null);
  const [particles, setParticles] = useState<Array<{ id: number; x: number; y: number; color: string }>>([]);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const speedRef = useRef(2); // timer drain speed

  const ROUND_TIME = 100;

  function nextRound(currentRound: number, currentLevel: number) {
    if (currentRound >= totalRounds) { setPhase('results'); return; }
    const r = generateRound(currentLevel);
    setRound(r);
    setTimeLeft(ROUND_TIME);
    clearInterval(timerRef.current!);
    speedRef.current = Math.min(4, 2 + currentLevel * 0.15);
    timerRef.current = setInterval(() => {
      setTimeLeft(t => {
        if (t <= 0) {
          clearInterval(timerRef.current!);
          handleWrongAnswer();
          return 0;
        }
        return t - speedRef.current;
      });
    }, 100);
  }

  function handleWrongAnswer() {
    clearInterval(timerRef.current!);
    setFeedback('wrong');
    setCombo(0);
    setTimeout(() => {
      setFeedback(null);
      setRoundNum(r => {
        nextRound(r + 1, r + 1);
        return r + 1;
      });
    }, 500);
  }

  function handleAnswer(colorIdx: number) {
    if (!round || feedback) return;
    clearInterval(timerRef.current!);
    const isCorrect = colorIdx === round.correctButton;

    if (isCorrect) {
      const timeBonus = Math.round(timeLeft * 2);
      const newCombo = combo + 1;
      setCombo(newCombo);
      setMaxCombo(m => Math.max(m, newCombo));
      const pts = 100 + timeBonus + newCombo * 20;
      setScore(s => s + pts);
      setCorrect(c => c + 1);
      setFeedback('correct');
      // Particles
      const newParticles = Array.from({ length: 8 }, (_, i) => ({
        id: Date.now() + i,
        x: Math.random() * 100,
        y: Math.random() * 100,
        color: COLORS[colorIdx].hex,
      }));
      setParticles(p => [...p, ...newParticles]);
      setTimeout(() => setParticles(p => p.filter(pp => !newParticles.find(np => np.id === pp.id))), 800);
    } else {
      setCombo(0);
      setFeedback('wrong');
    }

    setTimeout(() => {
      setFeedback(null);
      setRoundNum(r => {
        nextRound(r + 1, r + 1);
        return r + 1;
      });
    }, 500);
  }

  function startGame() {
    setPhase('playing');
    setScore(0); setCombo(0); setMaxCombo(0); setRoundNum(0); setCorrect(0);
    setFeedback(null); setParticles([]);
    nextRound(0, 0);
  }

  useEffect(() => () => clearInterval(timerRef.current!), []);
  useEffect(() => {
    if (phase === 'results') {
      clearInterval(timerRef.current!);
      onComplete?.(score, Math.round(score / 10));
    }
  }, [phase]);

  const accuracy = roundNum > 0 ? correct / roundNum : 0;
  const progress = (roundNum / totalRounds) * 100;

  const barColor = timeLeft > 60 ? '#34d399' : timeLeft > 30 ? '#fb923c' : '#ef4444';

  return (
    <div className="flex flex-col min-h-full bg-gradient-to-br from-pink-50 via-rose-50 to-purple-100 rounded-3xl p-5">

      {/* ── Intro ── */}
      {phase === 'intro' && (
        <div className="flex flex-col items-center justify-center min-h-[420px] gap-6">
          <MascotBee size={100} mood="excited" />
          <div className="text-center">
            <h2 className="text-3xl font-black text-slate-800">🎨 Color Dash</h2>
            <p className="text-slate-500 mt-1 font-semibold">¡Toca el botón del color que se muestra!</p>
          </div>
          <div className="bg-white rounded-2xl p-4 max-w-xs text-sm text-slate-600 font-semibold">
            <p className="mb-2">🎯 Aparece un color en pantalla.</p>
            <p className="mb-2">⚡ Toca el botón correcto rápido.</p>
            <p>🌀 ¡En niveles avanzados el texto puede confundirte!</p>
          </div>
          <div className="flex gap-3 flex-wrap justify-center">
            {COLORS.slice(0, 3).map(c => (
              <div key={c.name} className={`${c.bg} w-12 h-12 rounded-xl shadow-md flex items-center justify-center text-white font-black text-xs`}>
                {c.name[0]}
              </div>
            ))}
          </div>
          <motion.button
            whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.96 }}
            onClick={startGame}
            className="bg-gradient-to-r from-pink-500 to-rose-500 text-white font-black text-lg px-10 py-4 rounded-2xl shadow-lg"
          >
            ¡A colorear! 🎨
          </motion.button>
        </div>
      )}

      {/* ── Playing ── */}
      {phase === 'playing' && round && (
        <>
          {/* Header */}
          <div className="flex justify-between items-center mb-3">
            <button onClick={onExit ?? (() => setPhase('results'))} className="text-sm font-bold text-slate-400 hover:text-slate-600">← Salir</button>
            <div className="text-sm font-black text-slate-600">Ronda {roundNum + 1}/{totalRounds}</div>
            <div className="bg-gradient-to-r from-pink-500 to-violet-500 text-white px-3 py-1 rounded-full text-sm font-black">
              ⭐ {score.toLocaleString()}
            </div>
          </div>

          {/* Progress */}
          <div className="h-2 bg-slate-100 rounded-full mb-3 overflow-hidden">
            <motion.div
              animate={{ width: `${progress}%` }}
              className="h-full rounded-full bg-gradient-to-r from-pink-400 to-violet-500"
            />
          </div>

          {/* Timer bar */}
          <div className="h-3 bg-slate-100 rounded-full mb-4 overflow-hidden">
            <motion.div
              animate={{ width: `${timeLeft}%` }}
              transition={{ duration: 0.1, ease: 'linear' }}
              className="h-full rounded-full transition-colors"
              style={{ backgroundColor: barColor }}
            />
          </div>

          {/* Combo */}
          {combo >= 2 && (
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="text-center mb-2"
            >
              <span className="bg-gradient-to-r from-amber-400 to-orange-400 text-white px-4 py-1.5 rounded-full font-black text-sm">
                🔥 Combo x{combo}!
              </span>
            </motion.div>
          )}

          {/* Main color display */}
          <motion.div
            key={roundNum}
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-white rounded-3xl shadow-md border border-slate-100 p-8 text-center mb-5 relative overflow-hidden"
          >
            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-3">¿Qué color es este?</p>
            <motion.div
              animate={feedback ? {
                scale: feedback === 'correct' ? [1, 1.15, 1] : [1, 0.9, 1.05, 1],
              } : {}}
              className="flex items-center justify-center gap-4"
            >
              <div
                className="w-16 h-16 rounded-2xl shadow-lg"
                style={{ backgroundColor: round.targetColor.hex }}
              />
              <span
                className="text-4xl font-black"
                style={{ color: round.displayedColorHex }}
              >
                {round.displayedWord}
              </span>
            </motion.div>
            <p className="text-xs text-slate-400 font-semibold mt-3">
              Toca el color que ves en el cuadro ←
            </p>

            {/* Particles */}
            {particles.map(p => (
              <motion.div
                key={p.id}
                initial={{ opacity: 1, scale: 1, x: `${p.x}%`, y: `${p.y}%` }}
                animate={{ opacity: 0, scale: 0, y: `${p.y - 30}%` }}
                transition={{ duration: 0.7 }}
                className="absolute w-3 h-3 rounded-full pointer-events-none"
                style={{ backgroundColor: p.color }}
              />
            ))}
          </motion.div>

          {/* Color buttons */}
          <div className="grid grid-cols-3 gap-3">
            {COLORS.map((c, i) => (
              <motion.button
                key={c.name}
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.93 }}
                onClick={() => handleAnswer(i)}
                disabled={!!feedback}
                className={`${c.bg} rounded-2xl py-4 font-black text-white text-sm shadow-md transition-all active:scale-95 ${feedback ? 'opacity-80' : 'hover:shadow-lg'}`}
              >
                {c.name}
              </motion.button>
            ))}
          </div>

          {/* Feedback overlay */}
          <AnimatePresence>
            {feedback && (
              <motion.div
                initial={{ opacity: 0, scale: 0.5 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 flex items-center justify-center pointer-events-none z-50"
              >
                <div className="text-8xl drop-shadow-2xl">
                  {feedback === 'correct' ? '✅' : '❌'}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </>
      )}

      {/* ── Results ── */}
      {phase === 'results' && (
        <ResultsScreen
          score={score}
          xpEarned={Math.round(score / 10)}
          accuracy={accuracy}
          streak={maxCombo}
          onPlayAgain={startGame}
          onExit={onExit ?? (() => {})}
          won={correct >= totalRounds * 0.6}
        />
      )}
    </div>
  );
}
