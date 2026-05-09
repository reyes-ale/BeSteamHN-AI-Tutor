'use client';
// ─────────────────────────────────────────────
//  Shared UI Components for BESTEAMHN Games
// ─────────────────────────────────────────────
import { motion, AnimatePresence } from 'framer-motion';
import type { XPEvent } from '@/types/games';

// ── Mascot SVG characters ─────────────────────
export function MascotBee({ size = 80, mood = 'happy' }: { size?: number; mood?: 'happy' | 'sad' | 'excited' | 'thinking' }) {
  const eyes = mood === 'sad' ? '😢' : mood === 'excited' ? '🤩' : mood === 'thinking' ? '🤔' : '😊';
  return (
    <div style={{ width: size, height: size }} className="relative select-none">
      <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" width={size} height={size}>
        {/* Wings */}
        <ellipse cx="25" cy="45" rx="20" ry="12" fill="#bfdbfe" opacity="0.8" />
        <ellipse cx="75" cy="45" rx="20" ry="12" fill="#bfdbfe" opacity="0.8" />
        {/* Body */}
        <ellipse cx="50" cy="58" rx="22" ry="26" fill="#fbbf24" />
        {/* Stripes */}
        <rect x="29" y="52" width="42" height="7" rx="3" fill="#1c1917" opacity="0.25" />
        <rect x="29" y="63" width="42" height="7" rx="3" fill="#1c1917" opacity="0.25" />
        {/* Head */}
        <circle cx="50" cy="34" r="20" fill="#fbbf24" />
        {/* Face */}
        <circle cx="43" cy="32" r="5" fill="white" />
        <circle cx="57" cy="32" r="5" fill="white" />
        <circle cx={mood === 'thinking' ? "44" : "44"} cy="33" r="3" fill="#1c1917" />
        <circle cx="58" cy="33" r="3" fill="#1c1917" />
        {/* Smile/Expression */}
        {mood === 'sad'
          ? <path d="M42 43 Q50 39 58 43" stroke="#1c1917" strokeWidth="2" strokeLinecap="round" fill="none" />
          : <path d="M42 40 Q50 46 58 40" stroke="#1c1917" strokeWidth="2" strokeLinecap="round" fill="none" />
        }
        {/* Antennae */}
        <line x1="43" y1="15" x2="37" y2="6" stroke="#fbbf24" strokeWidth="2.5" strokeLinecap="round" />
        <circle cx="37" cy="5" r="3" fill="#f9a8d4" />
        <line x1="57" y1="15" x2="63" y2="6" stroke="#fbbf24" strokeWidth="2.5" strokeLinecap="round" />
        <circle cx="63" cy="5" r="3" fill="#f9a8d4" />
        {/* Cheek blush */}
        {mood !== 'sad' && <>
          <ellipse cx="38" cy="38" rx="5" ry="3" fill="#fda4af" opacity="0.5" />
          <ellipse cx="62" cy="38" rx="5" ry="3" fill="#fda4af" opacity="0.5" />
        </>}
      </svg>
    </div>
  );
}

export function MascotRocket({ size = 80, animated = false }: { size?: number; animated?: boolean }) {
  return (
    <motion.div
      style={{ width: size, height: size }}
      animate={animated ? { y: [0, -6, 0] } : {}}
      transition={{ repeat: Infinity, duration: 1.8, ease: 'easeInOut' }}
    >
      <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" width={size} height={size}>
        {/* Flame */}
        <ellipse cx="50" cy="90" rx="12" ry="16" fill="#fb923c" opacity="0.85" />
        <ellipse cx="50" cy="92" rx="7" ry="10" fill="#fde68a" opacity="0.9" />
        {/* Body */}
        <rect x="35" y="30" width="30" height="50" rx="15" fill="#93c5fd" />
        {/* Nose cone */}
        <path d="M35 35 Q50 8 65 35 Z" fill="#3b82f6" />
        {/* Window */}
        <circle cx="50" cy="52" r="10" fill="white" />
        <circle cx="50" cy="52" r="7" fill="#dbeafe" />
        {/* Face in window */}
        <circle cx="47" cy="50" r="2" fill="#1c1917" />
        <circle cx="53" cy="50" r="2" fill="#1c1917" />
        <path d="M46 55 Q50 58 54 55" stroke="#1c1917" strokeWidth="1.5" strokeLinecap="round" fill="none" />
        {/* Wings */}
        <path d="M35 65 L20 78 L35 72 Z" fill="#7c3aed" />
        <path d="M65 65 L80 78 L65 72 Z" fill="#7c3aed" />
        {/* Stars around */}
        <text x="10" y="30" fontSize="10">⭐</text>
        <text x="80" y="40" fontSize="8">✨</text>
        <text x="14" y="60" fontSize="8">✨</text>
      </svg>
    </motion.div>
  );
}

// ── TimerBar ──────────────────────────────────
export function TimerBar({
  percentLeft,
  isWarning,
  isDanger,
  timeLeft,
}: {
  percentLeft: number;
  isWarning: boolean;
  isDanger: boolean;
  timeLeft: number;
}) {
  const barColor = isDanger
    ? 'from-red-400 to-rose-500'
    : isWarning
    ? 'from-amber-400 to-orange-400'
    : 'from-blue-400 to-violet-500';

  return (
    <div className="w-full space-y-1">
      <div className="flex justify-between items-center">
        <span className="text-xs font-bold text-slate-500 uppercase tracking-wide">Tiempo</span>
        <motion.span
          key={timeLeft}
          initial={{ scale: 1.3 }}
          animate={{ scale: 1 }}
          className={`text-sm font-black tabular-nums ${isDanger ? 'text-red-500' : 'text-slate-700'}`}
        >
          {timeLeft}s
        </motion.span>
      </div>
      <div className="h-3 bg-slate-100 rounded-full overflow-hidden">
        <motion.div
          className={`h-full rounded-full bg-gradient-to-r ${barColor}`}
          animate={{ width: `${percentLeft}%` }}
          transition={{ duration: 0.4, ease: 'linear' }}
        />
      </div>
    </div>
  );
}

// ── ScoreBadge ────────────────────────────────
export function ScoreBadge({ score, combo }: { score: number; combo?: number }) {
  return (
    <div className="flex items-center gap-2">
      <motion.div
        key={score}
        initial={{ scale: 1.25, y: -4 }}
        animate={{ scale: 1, y: 0 }}
        className="bg-gradient-to-r from-blue-500 to-violet-500 text-white px-4 py-1.5 rounded-full font-black text-sm shadow-lg"
      >
        ⭐ {score.toLocaleString()}
      </motion.div>
      {combo != null && combo >= 2 && (
        <motion.div
          key={combo}
          initial={{ scale: 0, rotate: -10 }}
          animate={{ scale: 1, rotate: 0 }}
          className="bg-gradient-to-r from-amber-400 to-orange-400 text-white px-3 py-1.5 rounded-full font-black text-xs shadow-md"
        >
          🔥 x{combo}
        </motion.div>
      )}
    </div>
  );
}

// ── XP Popup ──────────────────────────────────
export function XPPopup({ event, show }: { event: XPEvent | null; show: boolean }) {
  return (
    <AnimatePresence>
      {show && event && (
        <motion.div
          initial={{ opacity: 0, y: 40, scale: 0.8 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -30, scale: 0.9 }}
          className="fixed bottom-8 left-1/2 -translate-x-1/2 z-50 pointer-events-none"
        >
          <div className="bg-gradient-to-r from-amber-400 to-yellow-300 text-amber-900 px-8 py-4 rounded-2xl shadow-2xl flex items-center gap-3">
            <span className="text-3xl">✨</span>
            <div>
              <div className="font-black text-xl">+{event.xpEarned} XP</div>
              <div className="text-sm font-semibold opacity-80">¡Sigue así!</div>
            </div>
            <span className="text-3xl">🎉</span>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

// ── GameHeader ────────────────────────────────
export function GameHeader({
  title,
  emoji,
  onExit,
  score,
  combo,
}: {
  title: string;
  emoji: string;
  onExit: () => void;
  score?: number;
  combo?: number;
}) {
  return (
    <div className="flex items-center justify-between w-full mb-4">
      <button
        onClick={onExit}
        className="flex items-center gap-1.5 bg-white/80 hover:bg-white border border-slate-200 text-slate-600 font-bold text-sm px-4 py-2 rounded-full transition-all hover:shadow-md active:scale-95"
      >
        ← Salir
      </button>
      <div className="flex items-center gap-2">
        <span className="text-xl">{emoji}</span>
        <span className="font-black text-slate-700 text-base">{title}</span>
      </div>
      {score !== undefined ? (
        <ScoreBadge score={score} combo={combo} />
      ) : (
        <div className="w-24" />
      )}
    </div>
  );
}

// ── ResultsScreen ─────────────────────────────
export function ResultsScreen({
  score,
  xpEarned,
  accuracy,
  streak,
  onPlayAgain,
  onExit,
  won = true,
}: {
  score: number;
  xpEarned: number;
  accuracy: number;
  streak: number;
  onPlayAgain: () => void;
  onExit: () => void;
  won?: boolean;
}) {
  const trophy = won && score > 600 ? '🏆' : won ? '🥈' : '😤';
  const title = won && score > 600 ? '¡Absolutamente épico!' : won ? '¡Buen trabajo!' : '¡Casi! Inténtalo de nuevo';

  const stars = accuracy >= 0.9 ? 3 : accuracy >= 0.6 ? 2 : 1;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className="flex flex-col items-center gap-5 py-6 text-center"
    >
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: 'spring', delay: 0.1, stiffness: 200 }}
        className="text-7xl"
      >
        {trophy}
      </motion.div>

      <div>
        <h2 className="text-2xl font-black text-slate-800">{title}</h2>
        <div className="flex justify-center gap-1 mt-2">
          {[1, 2, 3].map(i => (
            <motion.span
              key={i}
              initial={{ scale: 0, rotate: -20 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ delay: 0.2 + i * 0.1 }}
              className="text-2xl"
            >
              {i <= stars ? '⭐' : '☆'}
            </motion.span>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-3 gap-3 w-full max-w-xs">
        {[
          { label: 'Puntos', value: score.toLocaleString(), emoji: '🎯' },
          { label: 'Precisión', value: `${Math.round(accuracy * 100)}%`, emoji: '✅' },
          { label: 'Mejor racha', value: `x${streak}`, emoji: '🔥' },
        ].map(stat => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-white rounded-2xl p-3 shadow-sm border border-slate-100"
          >
            <div className="text-xl">{stat.emoji}</div>
            <div className="font-black text-slate-800 text-lg">{stat.value}</div>
            <div className="text-xs text-slate-400 font-semibold">{stat.label}</div>
          </motion.div>
        ))}
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="bg-gradient-to-r from-amber-100 to-yellow-100 border border-amber-200 rounded-2xl px-6 py-3 w-full max-w-xs"
      >
        <div className="text-3xl font-black text-amber-600">+{xpEarned} XP</div>
        <div className="text-sm text-amber-700 font-semibold">¡Experiencia ganada!</div>
      </motion.div>

      <div className="flex gap-3 w-full max-w-xs">
        <button
          onClick={onPlayAgain}
          className="flex-1 bg-gradient-to-r from-blue-500 to-violet-500 hover:from-blue-600 hover:to-violet-600 text-white font-black py-3 rounded-xl transition-all hover:shadow-lg active:scale-95"
        >
          🔄 Repetir
        </button>
        <button
          onClick={onExit}
          className="flex-1 bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 font-bold py-3 rounded-xl transition-all hover:shadow-sm active:scale-95"
        >
          🏠 Salir
        </button>
      </div>
    </motion.div>
  );
}

// ── Loading/Countdown ─────────────────────────
export function GameCountdown({ onDone }: { onDone: () => void }) {
  const [count, setCount] = useState(3);

  useEffect(() => {
    if (count === 0) { onDone(); return; }
    const t = setTimeout(() => setCount(c => c - 1), 800);
    return () => clearTimeout(t);
  }, [count, onDone]);

  return (
    <div className="flex flex-col items-center justify-center min-h-[300px] gap-4">
      <AnimatePresence mode="wait">
        <motion.div
          key={count}
          initial={{ scale: 0.3, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 1.5, opacity: 0 }}
          transition={{ duration: 0.35, type: 'spring' }}
          className="text-8xl font-black text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-violet-500"
        >
          {count === 0 ? '¡YA!' : count}
        </motion.div>
      </AnimatePresence>
      <p className="text-slate-400 font-semibold">Preparándose...</p>
    </div>
  );
}

function useState<T>(initialValue: T | (() => T)): [T, React.Dispatch<React.SetStateAction<T>>] {
  return require('react').useState(initialValue);
}
function useEffect(effect: React.EffectCallback, deps?: React.DependencyList): void {
  return require('react').useEffect(effect, deps);
}
