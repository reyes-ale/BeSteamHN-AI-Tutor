'use client';
// ─────────────────────────────────────────────
//  QuizBattle — Fast-paced quiz with combos
//  Export: <QuizBattle questions={...} onComplete={...} />
// ─────────────────────────────────────────────
import { useState, useCallback, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { QuizQuestion } from '@/types/games';
import { QUIZ_QUESTIONS } from '@/data/mockData';
import { useGameTimer } from '@/hooks/useGameTimer';
import {
  GameHeader, TimerBar, ScoreBadge,
  ResultsScreen, GameCountdown, MascotBee,
} from '@/components/ui/GameShared';

type Phase = 'countdown' | 'playing' | 'results';

interface Props {
  questions?: QuizQuestion[];
  onComplete?: (score: number, xp: number) => void;
  onExit?: () => void;
}

const LETTERS = ['A', 'B', 'C', 'D'];
const TIME_PER_QUESTION = 15;

export default function QuizBattle({
  questions = QUIZ_QUESTIONS.slice(0, 6),
  onComplete,
  onExit,
}: Props) {
  const [phase, setPhase] = useState<Phase>('countdown');
  const [qIndex, setQIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [combo, setCombo] = useState(0);
  const [lives, setLives] = useState(3);
  const [selected, setSelected] = useState<number | null>(null);
  const [feedback, setFeedback] = useState<'correct' | 'wrong' | null>(null);
  const [answered, setAnswered] = useState(0);
  const [correct, setCorrect] = useState(0);
  const [qDots, setQDots] = useState<Array<'pending' | 'correct' | 'wrong'>>(
    questions.map(() => 'pending')
  );

  const currentQ = questions[qIndex];
  const isLast = qIndex === questions.length - 1;

  const handleExpire = useCallback(() => {
    if (phase !== 'playing' || selected !== null) return;
    setFeedback('wrong');
    setCombo(0);
    setLives(l => l - 1);
    setQDots(d => d.map((v, i) => (i === qIndex ? 'wrong' : v)));
    setTimeout(() => advanceQuestion(false), 1000);
  }, [phase, selected, qIndex]);

  const timer = useGameTimer({
    initialSeconds: TIME_PER_QUESTION,
    onExpire: handleExpire,
  });

  function advanceQuestion(wasCorrect: boolean) {
    setFeedback(null);
    setSelected(null);
    if (wasCorrect ? correct + 1 : correct) setCorrect(c => c + (wasCorrect ? 1 : 0));
    setAnswered(a => a + 1);
    if (isLast || lives <= (wasCorrect ? 1 : 0)) {
      setPhase('results');
      return;
    }
    setQIndex(i => i + 1);
    timer.reset(TIME_PER_QUESTION);
    timer.start();
  }

  function handleAnswer(idx: number) {
    if (selected !== null || phase !== 'playing') return;
    timer.pause();
    setSelected(idx);
    const isCorrect = idx === currentQ.correctIndex;
    setFeedback(isCorrect ? 'correct' : 'wrong');

    if (isCorrect) {
      const timeBonus = Math.round((timer.timeLeft / TIME_PER_QUESTION) * 100);
      const comboMultiplier = combo >= 3 ? 2 : combo >= 2 ? 1.5 : 1;
      const pts = Math.round((100 + timeBonus) * comboMultiplier);
      setScore(s => s + pts);
      setCombo(c => c + 1);
      setCorrect(c => c + 1);
      setQDots(d => d.map((v, i) => (i === qIndex ? 'correct' : v)));
    } else {
      setCombo(0);
      setLives(l => l - 1);
      setQDots(d => d.map((v, i) => (i === qIndex ? 'wrong' : v)));
    }
    setAnswered(a => a + 1);

    setTimeout(() => {
      setFeedback(null);
      setSelected(null);
      if (isLast || (lives - (isCorrect ? 0 : 1)) <= 0) {
        setPhase('results');
      } else {
        setQIndex(i => i + 1);
        timer.reset(TIME_PER_QUESTION);
        timer.start();
      }
    }, 1100);
  }

  function handleStart() {
    setPhase('playing');
    timer.reset(TIME_PER_QUESTION);
    timer.start();
  }

  function handleRestart() {
    setPhase('countdown');
    setQIndex(0);
    setScore(0);
    setCombo(0);
    setLives(3);
    setSelected(null);
    setFeedback(null);
    setAnswered(0);
    setCorrect(0);
    setQDots(questions.map(() => 'pending'));
    timer.reset(TIME_PER_QUESTION);
  }

  const accuracy = answered > 0 ? correct / answered : 0;
  const xpEarned = Math.round(score / 8) + (accuracy === 1 ? 50 : 0);

  useEffect(() => {
    if (phase === 'results') onComplete?.(score, xpEarned);
  }, [phase]);

  const dotColors = {
    pending: 'bg-slate-200',
    correct: 'bg-emerald-400',
    wrong: 'bg-red-400',
  };

  return (
    <div className="flex flex-col min-h-full bg-gradient-to-br from-blue-50 via-indigo-50 to-violet-100 rounded-3xl p-5">

      {/* ── Countdown ── */}
      {phase === 'countdown' && (
        <div className="flex flex-col items-center justify-center min-h-[400px] gap-6">
          <MascotBee size={100} mood="excited" />
          <div className="text-center">
            <h2 className="text-3xl font-black text-slate-800">⚔️ Quiz Battle</h2>
            <p className="text-slate-500 mt-1 font-semibold">Responde rápido y consigue combos</p>
          </div>
          <div className="flex gap-4 text-center">
            <div className="bg-white rounded-2xl px-4 py-2 shadow-sm">
              <div className="font-black text-blue-600 text-xl">{questions.length}</div>
              <div className="text-xs text-slate-400 font-semibold">preguntas</div>
            </div>
            <div className="bg-white rounded-2xl px-4 py-2 shadow-sm">
              <div className="font-black text-violet-600 text-xl">{TIME_PER_QUESTION}s</div>
              <div className="text-xs text-slate-400 font-semibold">por pregunta</div>
            </div>
            <div className="bg-white rounded-2xl px-4 py-2 shadow-sm">
              <div className="font-black text-pink-500 text-xl">❤️x{lives}</div>
              <div className="text-xs text-slate-400 font-semibold">vidas</div>
            </div>
          </div>
          <motion.button
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.96 }}
            onClick={handleStart}
            className="bg-gradient-to-r from-blue-500 to-violet-500 text-white font-black text-lg px-10 py-4 rounded-2xl shadow-lg hover:shadow-xl transition-shadow"
          >
            ¡Comenzar! 🚀
          </motion.button>
        </div>
      )}

      {/* ── Playing ── */}
      {phase === 'playing' && (
        <>
          <GameHeader
            title="Quiz Battle"
            emoji="⚔️"
            onExit={onExit ?? (() => setPhase('results'))}
            score={score}
            combo={combo}
          />

          {/* Progress dots */}
          <div className="flex gap-2 justify-center mb-4">
            {qDots.map((status, i) => (
              <motion.div
                key={i}
                animate={{ scale: i === qIndex ? 1.3 : 1 }}
                className={`rounded-full transition-all duration-300 ${
                  i === qIndex ? 'w-4 h-4' : 'w-3 h-3'
                } ${dotColors[status]} ${i === qIndex ? 'ring-2 ring-blue-400 ring-offset-1' : ''}`}
              />
            ))}
          </div>

          {/* Lives */}
          <div className="text-center text-xl mb-3">
            {'❤️'.repeat(lives)}{'🖤'.repeat(3 - lives)}
          </div>

          {/* Timer */}
          <TimerBar
            percentLeft={timer.percentLeft}
            isWarning={timer.isWarning}
            isDanger={timer.isDanger}
            timeLeft={timer.timeLeft}
          />

          {/* Question Card */}
          <AnimatePresence mode="wait">
            <motion.div
              key={qIndex}
              initial={{ opacity: 0, x: 40 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -40 }}
              className="bg-white rounded-3xl p-6 my-4 shadow-sm border border-slate-100 text-center"
            >
              <div className="text-4xl mb-3">{currentQ.emoji}</div>
              <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">
                Pregunta {qIndex + 1} de {questions.length} · {currentQ.topicTag}
              </p>
              <h3 className="text-xl font-black text-slate-800 leading-snug">{currentQ.question}</h3>
            </motion.div>
          </AnimatePresence>

          {/* Answers */}
          <div className="grid grid-cols-2 gap-3">
            {currentQ.options.map((opt, i) => {
              const isSelected = selected === i;
              const isCorrect = i === currentQ.correctIndex;
              let btnClass = 'bg-white border-2 border-slate-200 hover:border-blue-400 hover:bg-blue-50';
              if (selected !== null) {
                if (isCorrect) btnClass = 'bg-emerald-50 border-2 border-emerald-400 text-emerald-800';
                else if (isSelected) btnClass = 'bg-red-50 border-2 border-red-400 text-red-800';
                else btnClass = 'bg-white border-2 border-slate-100 opacity-60';
              }

              return (
                <motion.button
                  key={i}
                  whileHover={selected === null ? { scale: 1.02, y: -2 } : {}}
                  whileTap={selected === null ? { scale: 0.97 } : {}}
                  onClick={() => handleAnswer(i)}
                  disabled={selected !== null}
                  className={`${btnClass} rounded-2xl p-4 text-left transition-all duration-200 flex items-center gap-3`}
                >
                  <span className={`w-7 h-7 rounded-lg flex items-center justify-center text-xs font-black flex-shrink-0 ${
                    selected !== null && isCorrect ? 'bg-emerald-500 text-white' :
                    selected !== null && isSelected ? 'bg-red-500 text-white' :
                    'bg-slate-100 text-slate-500'
                  }`}>
                    {LETTERS[i]}
                  </span>
                  <span className="font-bold text-sm leading-tight">{opt}</span>
                </motion.button>
              );
            })}
          </div>

          {/* Explanation after answer */}
          <AnimatePresence>
            {selected !== null && currentQ.explanation && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className={`mt-3 p-3 rounded-2xl text-sm font-semibold ${
                  feedback === 'correct'
                    ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                    : 'bg-amber-50 text-amber-700 border border-amber-200'
                }`}
              >
                💡 {currentQ.explanation}
              </motion.div>
            )}
          </AnimatePresence>

          {/* Feedback splash */}
          <AnimatePresence>
            {feedback && (
              <motion.div
                initial={{ opacity: 0, scale: 0.5 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 1.5 }}
                className="fixed inset-0 flex items-center justify-center pointer-events-none z-50"
              >
                <div className={`text-8xl drop-shadow-2xl`}>
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
          xpEarned={xpEarned}
          accuracy={accuracy}
          streak={combo}
          onPlayAgain={handleRestart}
          onExit={onExit ?? (() => {})}
          won={lives > 0}
        />
      )}
    </div>
  );
}
