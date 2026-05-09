'use client';
// ─────────────────────────────────────────────
//  DragDropChallenge — Categorize items by dragging
//  Export: <DragDropChallenge items={...} zones={...} onComplete={...} />
// ─────────────────────────────────────────────
import { useState, useEffect } from 'react';
import { motion, AnimatePresence, Reorder } from 'framer-motion';
import type { DragDropItem, DragDropZone } from '@/types/games';
import { DD_ITEMS, DD_ZONES } from '@/data/mockData';
import { useGameTimer } from '@/hooks/useGameTimer';
import { GameHeader, TimerBar, ResultsScreen, MascotRocket } from '@/components/ui/GameShared';

interface Props {
  items?: DragDropItem[];
  zones?: DragDropZone[];
  onComplete?: (score: number, xp: number) => void;
  onExit?: () => void;
}

const ZONE_COLORS: Record<string, { bg: string; border: string; badge: string }> = {
  blue: { bg: 'from-blue-50 to-indigo-50', border: 'border-blue-300', badge: 'bg-blue-100 text-blue-700' },
  green: { bg: 'from-emerald-50 to-teal-50', border: 'border-emerald-300', badge: 'bg-emerald-100 text-emerald-700' },
  purple: { bg: 'from-violet-50 to-purple-50', border: 'border-violet-300', badge: 'bg-violet-100 text-violet-700' },
  pink: { bg: 'from-pink-50 to-rose-50', border: 'border-pink-300', badge: 'bg-pink-100 text-pink-700' },
};

export default function DragDropChallenge({
  items = DD_ITEMS,
  zones = DD_ZONES,
  onComplete,
  onExit,
}: Props) {
  const [phase, setPhase] = useState<'intro' | 'playing' | 'results'>('intro');
  const [remaining, setRemaining] = useState<DragDropItem[]>([]);
  const [placed, setPlaced] = useState<Record<string, DragDropItem[]>>({});
  const [score, setScore] = useState(0);
  const [mistakes, setMistakes] = useState(0);
  const [feedback, setFeedback] = useState<{ id: string; correct: boolean } | null>(null);
  const [dragging, setDragging] = useState<string | null>(null);
  const [hoveredZone, setHoveredZone] = useState<string | null>(null);

  const timer = useGameTimer({
    initialSeconds: 60,
    onExpire: () => setPhase('results'),
  });

  function initGame() {
    const shuffled = [...items].sort(() => Math.random() - 0.5);
    setRemaining(shuffled);
    setPlaced(Object.fromEntries(zones.map(z => [z.id, []])));
    setScore(0);
    setMistakes(0);
    setFeedback(null);
    setPhase('playing');
    timer.reset(60);
    timer.start();
  }

  function handleDrop(zoneId: string, itemId: string) {
    const item = remaining.find(i => i.id === itemId);
    if (!item) return;
    const isCorrect = item.correctZoneId === zoneId;

    setFeedback({ id: itemId, correct: isCorrect });
    setTimeout(() => setFeedback(null), 800);

    if (isCorrect) {
      setScore(s => s + 120 + Math.round(timer.timeLeft * 2));
      setRemaining(r => r.filter(i => i.id !== itemId));
      setPlaced(prev => ({
        ...prev,
        [zoneId]: [...(prev[zoneId] ?? []), item],
      }));
      if (remaining.length === 1) {
        timer.pause();
        setTimeout(() => setPhase('results'), 800);
      }
    } else {
      setMistakes(m => m + 1);
      setScore(s => Math.max(0, s - 20));
    }
    setHoveredZone(null);
  }

  // Pointer events for drag (works on touch and mouse)
  function handleDragStart(id: string) { setDragging(id); }
  function handleDragEnd() { setDragging(null); setHoveredZone(null); }

  const totalItems = items.length;
  const placedCount = totalItems - remaining.length;
  const accuracy = totalItems > 0 ? placedCount / (placedCount + mistakes) : 0;

  useEffect(() => {
    if (phase === 'results') onComplete?.(score, Math.round(score / 7));
  }, [phase]);

  return (
    <div className="flex flex-col min-h-full bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-100 rounded-3xl p-5">

      {/* ── Intro ── */}
      {phase === 'intro' && (
        <div className="flex flex-col items-center justify-center min-h-[400px] gap-6">
          <MascotRocket size={100} animated />
          <div className="text-center">
            <h2 className="text-3xl font-black text-slate-800">🎯 Drag & Drop</h2>
            <p className="text-slate-500 mt-1 font-semibold">Arrastra cada elemento a su categoría correcta</p>
          </div>
          <div className="grid grid-cols-2 gap-3 w-full max-w-xs">
            {zones.map(zone => {
              const c = ZONE_COLORS[zone.color] ?? ZONE_COLORS.blue;
              return (
                <div key={zone.id} className={`bg-gradient-to-br ${c.bg} rounded-2xl p-3 border ${c.border} text-center`}>
                  <div className="text-sm font-black text-slate-700">{zone.label}</div>
                  <div className="text-xs text-slate-400 mt-0.5">
                    {items.filter(i => i.correctZoneId === zone.id).length} elementos
                  </div>
                </div>
              );
            })}
          </div>
          <motion.button
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.96 }}
            onClick={initGame}
            className="bg-gradient-to-r from-emerald-500 to-teal-500 text-white font-black text-lg px-10 py-4 rounded-2xl shadow-lg"
          >
            ¡Organizar! 🎯
          </motion.button>
        </div>
      )}

      {/* ── Playing ── */}
      {phase === 'playing' && (
        <>
          <GameHeader
            title="Drag & Drop"
            emoji="🎯"
            onExit={onExit ?? (() => setPhase('results'))}
            score={score}
          />

          <TimerBar
            percentLeft={timer.percentLeft}
            isWarning={timer.isWarning}
            isDanger={timer.isDanger}
            timeLeft={timer.timeLeft}
          />

          <div className="flex justify-between text-sm font-bold text-slate-500 my-2 px-1">
            <span>Colocados: <span className="text-emerald-600 font-black">{placedCount}/{totalItems}</span></span>
            <span>Errores: <span className="text-red-400 font-black">{mistakes}</span></span>
          </div>

          {/* Drop Zones */}
          <div className="grid grid-cols-1 gap-3 mb-4">
            {zones.map(zone => {
              const c = ZONE_COLORS[zone.color] ?? ZONE_COLORS.blue;
              const isHovered = hoveredZone === zone.id;
              return (
                <div
                  key={zone.id}
                  onDragOver={e => { e.preventDefault(); setHoveredZone(zone.id); }}
                  onDragLeave={() => setHoveredZone(null)}
                  onDrop={e => {
                    e.preventDefault();
                    const id = e.dataTransfer.getData('itemId');
                    if (id) handleDrop(zone.id, id);
                  }}
                  className={`bg-gradient-to-br ${c.bg} rounded-2xl border-2 ${
                    isHovered ? `${c.border} scale-[1.01] shadow-md` : 'border-dashed border-slate-300'
                  } p-3 min-h-[70px] transition-all duration-200`}
                >
                  <div className="text-xs font-black text-slate-600 mb-2">{zone.label}</div>
                  <div className="flex flex-wrap gap-2">
                    <AnimatePresence>
                      {(placed[zone.id] ?? []).map(item => (
                        <motion.div
                          key={item.id}
                          initial={{ scale: 0.5, opacity: 0 }}
                          animate={{ scale: 1, opacity: 1 }}
                          className={`${c.badge} rounded-xl px-3 py-1 text-xs font-bold flex items-center gap-1`}
                        >
                          <span>{item.emoji}</span>
                          <span>{item.text}</span>
                          <span className="text-emerald-600">✓</span>
                        </motion.div>
                      ))}
                    </AnimatePresence>
                    {placed[zone.id]?.length === 0 && (
                      <span className="text-slate-400 text-xs font-semibold italic">Arrastra aquí...</span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Source Items */}
          <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-3 border border-slate-200">
            <p className="text-xs font-black text-slate-400 uppercase tracking-widest mb-3">Elementos para clasificar</p>
            <div className="flex flex-wrap gap-2 min-h-[50px]">
              <AnimatePresence>
                {remaining.map(item => (
                  <motion.div
                    key={item.id}
                    layout
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0.5, opacity: 0 }}
                    draggable
                    onDragStart={e => {
                      e.dataTransfer.setData('itemId', item.id);
                      handleDragStart(item.id);
                    }}
                    onDragEnd={handleDragEnd}
                    whileHover={{ scale: 1.05, y: -3 }}
                    whileTap={{ scale: 0.95 }}
                    className={`cursor-grab active:cursor-grabbing bg-white border-2 rounded-xl px-3 py-2 text-sm font-bold flex items-center gap-1.5 shadow-sm select-none transition-colors ${
                      feedback?.id === item.id
                        ? feedback.correct
                          ? 'border-emerald-400 bg-emerald-50'
                          : 'border-red-400 bg-red-50 shake'
                        : 'border-slate-200 hover:border-blue-400'
                    }`}
                  >
                    <span>{item.emoji}</span>
                    <span>{item.text}</span>
                  </motion.div>
                ))}
              </AnimatePresence>
              {remaining.length === 0 && (
                <div className="w-full text-center text-emerald-600 font-black">
                  🎉 ¡Todos clasificados!
                </div>
              )}
            </div>
          </div>
        </>
      )}

      {/* ── Results ── */}
      {phase === 'results' && (
        <ResultsScreen
          score={score}
          xpEarned={Math.round(score / 7)}
          accuracy={accuracy}
          streak={0}
          onPlayAgain={initGame}
          onExit={onExit ?? (() => {})}
          won={remaining.length === 0}
        />
      )}
    </div>
  );
}
