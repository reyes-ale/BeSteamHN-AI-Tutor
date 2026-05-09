'use client';
// ─────────────────────────────────────────────
//  GameHub — Main games dashboard page
//  Route: /game-hub  or embed in any layout
//
//  import GameHub from "@/components/games/GameHub"
//  <GameHub />
// ─────────────────────────────────────────────
import { useState } from 'react';
import { motion } from 'framer-motion';
import type { GameId } from '@/types/games';
import { GAME_CONFIGS } from '@/types/games';
import { LEADERBOARD_DATA } from '@/data/mockData';
import { getLevelInfo, useXP } from '@/hooks/useXPStore';
import { MascotBee, MascotRocket } from '@/components/ui/GameShared';
import GameCard from './GameCard';

const ALL_GAMES: GameId[] = [
  'sky-jump', 'color-dash',
  'quiz-battle', 'memory-match', 'drag-drop', 'speed-challenge',
];

const SUMMARY_GAMES: GameId[] = ['quiz-battle', 'memory-match', 'drag-drop', 'speed-challenge'];
const ARCADE_GAMES: GameId[] = ['sky-jump', 'color-dash'];

export default function GameHub() {
  const { stats, levelInfo } = useXP();
  const [tab, setTab] = useState<'all' | 'summary' | 'arcade'>('all');

  const displayGames = tab === 'all' ? ALL_GAMES : tab === 'summary' ? SUMMARY_GAMES : ARCADE_GAMES;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-pink-50 p-6">
      <div className="max-w-2xl mx-auto space-y-6">

        {/* ── Hero ── */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-r from-blue-500 via-violet-500 to-pink-500 rounded-3xl p-6 text-white relative overflow-hidden"
        >
          <div className="absolute -right-4 -top-4 opacity-20">
            <MascotRocket size={120} />
          </div>
          <div className="absolute -right-2 top-8 opacity-100">
            <MascotBee size={80} mood="excited" />
          </div>
          <span className="text-xs font-black uppercase tracking-widest bg-white/20 px-3 py-1 rounded-full">
            BESTEAMHN AI Tutor
          </span>
          <h1 className="text-3xl font-black mt-3 leading-tight">🎮 Game Zone</h1>
          <p className="text-white/80 font-semibold mt-1">Aprende jugando · Sube de nivel · Domina el tema</p>

          {/* XP bar */}
          <div className="mt-4 bg-white/20 rounded-full p-1">
            <div className="relative">
              <div className="h-5 bg-white/20 rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${levelInfo.progress}%` }}
                  transition={{ delay: 0.4, duration: 1, ease: 'easeOut' }}
                  className="h-full rounded-full bg-gradient-to-r from-yellow-300 to-amber-400"
                />
              </div>
              <div className="flex justify-between text-xs font-bold mt-1 text-white/80">
                <span>Nv. {levelInfo.currentLevel.level} — {levelInfo.currentLevel.title}</span>
                <span>{stats.totalXP.toLocaleString()} XP</span>
              </div>
            </div>
          </div>
        </motion.div>

        {/* ── Quick stats ── */}
        <div className="grid grid-cols-3 gap-3">
          {[
            { label: 'Racha', value: `🔥 ${stats.streak}`, sub: 'días' },
            { label: 'Total XP', value: `✨ ${(stats.totalXP / 1000).toFixed(1)}k`, sub: 'experiencia' },
            { label: 'Nivel', value: `⭐ ${levelInfo.currentLevel.level}`, sub: levelInfo.currentLevel.title },
          ].map((s, i) => (
            <motion.div
              key={s.label}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.1 + i * 0.05 }}
              className="bg-white rounded-2xl p-4 text-center shadow-sm border border-slate-100"
            >
              <div className="font-black text-slate-800 text-xl">{s.value}</div>
              <div className="text-xs text-slate-400 font-semibold mt-0.5">{s.sub}</div>
            </motion.div>
          ))}
        </div>

        {/* ── Tabs ── */}
        <div className="flex gap-2 bg-slate-100 p-1 rounded-2xl">
          {[
            { id: 'all', label: '🎮 Todos' },
            { id: 'summary', label: '📚 Summary Games' },
            { id: 'arcade', label: '🕹 Arcade' },
          ].map(t => (
            <button
              key={t.id}
              onClick={() => setTab(t.id as any)}
              className={`flex-1 py-2 px-3 rounded-xl text-sm font-black transition-all ${
                tab === t.id
                  ? 'bg-white text-slate-800 shadow-sm'
                  : 'text-slate-500 hover:text-slate-700'
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>

        {/* ── Game cards ── */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {displayGames.map((id, i) => (
            <motion.div
              key={id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.07 }}
            >
              <GameCard gameId={id} variant="card" />
            </motion.div>
          ))}
        </div>

        {/* ── Leaderboard ── */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="bg-white rounded-3xl p-5 shadow-sm border border-slate-100"
        >
          <h2 className="font-black text-slate-800 text-lg mb-4">🏆 Leaderboard</h2>
          <div className="space-y-2">
            {LEADERBOARD_DATA.map((entry, i) => (
              <motion.div
                key={entry.rank}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.5 + i * 0.05 }}
                className={`flex items-center gap-3 p-3 rounded-2xl transition-all ${
                  entry.isCurrentUser
                    ? 'bg-gradient-to-r from-blue-50 to-violet-50 border-2 border-blue-200'
                    : 'hover:bg-slate-50'
                }`}
              >
                <span className={`w-8 h-8 flex items-center justify-center font-black text-sm rounded-xl ${
                  entry.rank === 1 ? 'bg-yellow-100 text-yellow-600' :
                  entry.rank === 2 ? 'bg-slate-100 text-slate-500' :
                  entry.rank === 3 ? 'bg-orange-100 text-orange-600' :
                  'bg-slate-50 text-slate-400'
                }`}>
                  {entry.rank <= 3 ? ['🥇','🥈','🥉'][entry.rank - 1] : entry.rank}
                </span>
                <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-blue-100 to-violet-100 flex items-center justify-center text-xl flex-shrink-0">
                  {entry.avatar}
                </div>
                <div className="flex-1 min-w-0">
                  <div className={`font-bold text-sm truncate ${entry.isCurrentUser ? 'text-blue-700' : 'text-slate-700'}`}>
                    {entry.name} {entry.isCurrentUser && '← tú'}
                  </div>
                  <div className="text-xs text-slate-400 font-semibold">{entry.xp.toLocaleString()} XP</div>
                </div>
                <div className="font-black text-sm text-slate-700">{entry.score.toLocaleString()} pts</div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* ── Badges ── */}
        {stats.badges.length > 0 && (
          <div className="bg-white rounded-3xl p-5 shadow-sm border border-slate-100">
            <h2 className="font-black text-slate-800 text-lg mb-3">🏅 Mis Logros</h2>
            <div className="flex flex-wrap gap-3">
              {stats.badges.map(badge => (
                <motion.div
                  key={badge.id}
                  whileHover={{ scale: 1.05 }}
                  className="flex flex-col items-center bg-gradient-to-br from-amber-50 to-yellow-50 border border-amber-200 rounded-2xl p-3 w-20 text-center"
                >
                  <span className="text-2xl">{badge.emoji}</span>
                  <span className="text-[10px] font-bold text-amber-700 mt-1 leading-tight">{badge.name}</span>
                </motion.div>
              ))}
              {/* Locked badges */}
              {Array.from({ length: Math.max(0, 4 - stats.badges.length) }).map((_, i) => (
                <div key={i} className="flex flex-col items-center bg-slate-50 border border-slate-200 rounded-2xl p-3 w-20 text-center opacity-50">
                  <span className="text-2xl">🔒</span>
                  <span className="text-[10px] font-bold text-slate-400 mt-1">Bloqueado</span>
                </div>
              ))}
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
