import React, { useEffect, useState } from 'react';
import { useI18n } from '@/lib/i18n';
import { useAuth } from '@/lib/auth';
import { useWallet, useConnection } from '@solana/wallet-adapter-react';
import { getAssociatedTokenAddress } from '@solana/spl-token';
import { PublicKey } from '@solana/web3.js';
import { useSteamBalance } from '@/hooks/useSteamBalance';
import { Link } from 'react-router-dom';
import { BookOpen, Award, Coins, TrendingUp, Bot, Flame, ArrowRight, ChevronRight, Sparkles, Puzzle, CheckCircle2 } from 'lucide-react';
import {
  getCourseModuleCount,
  getProgressForCourse,
  getProfileProgressSummary,
  getProgressPercent,
} from '@/lib/courseProgress';
import { Area, AreaChart, CartesianGrid, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL as string;
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY as string;
const STEAM_MINT = import.meta.env.VITE_STEAM_MINT_ADDRESS as string | undefined;

interface AiSession {
  title: string;
  date: string;
  messageCount: number;
}

export default function Dashboard() {
  const { t, locale } = useI18n();
  const { user } = useAuth();
  const { publicKey } = useWallet();
  const { connection } = useConnection();
  const studentName = user?.name?.split(' ')[0] || 'Student';
  const { balance: steamBalance } = useSteamBalance();

  const [profileProgress, setProfileProgress] = useState(() => getProfileProgressSummary());
  const [aiSessions, setAiSessions] = useState<AiSession[]>([]);
  const [steamHistory, setSteamHistory] = useState<Record<string, number>>({});
  const [loadingHistory, setLoadingHistory] = useState(false);

  // Refresh progress when any course activity fires
  useEffect(() => {
    const refresh = () => setProfileProgress(getProfileProgressSummary());
    window.addEventListener('besteamhn-progress-updated', refresh);
    window.addEventListener('storage', refresh);
    return () => {
      window.removeEventListener('besteamhn-progress-updated', refresh);
      window.removeEventListener('storage', refresh);
    };
  }, []);

  // Load recent AI sessions from MongoDB
  useEffect(() => {
    if (!user) return;
    fetch(`${SUPABASE_URL}/functions/v1/mongodb-auth/conversations?userId=${user.id}`, {
      headers: { apikey: SUPABASE_ANON_KEY, Authorization: `Bearer ${SUPABASE_ANON_KEY}` },
    })
      .then(r => r.json())
      .then(data => {
        if (data.conversations?.length) {
          setAiSessions(
            data.conversations.slice(0, 3).map((c: any) => ({
              title: c.title || (locale === 'es' ? 'Nueva sesión' : 'New session'),
              date: c.date || new Date().toISOString().split('T')[0],
              messageCount: c.messages?.length || 0,
            }))
          );
        }
      })
      .catch(() => {});
  }, [user?.id]);

  // Read per-day STEAM received from Solana transaction history
  useEffect(() => {
    if (!publicKey || !STEAM_MINT) return;
    setLoadingHistory(true);

    async function fetchOnChainHistory() {
      try {
        const mint = new PublicKey(STEAM_MINT!);
        const ata = await getAssociatedTokenAddress(mint, publicKey!);
        const signatures = await connection.getSignaturesForAddress(ata, { limit: 50 });

        const history: Record<string, number> = {};

        await Promise.all(signatures.map(async ({ signature }) => {
          try {
            const tx = await connection.getParsedTransaction(signature, {
              maxSupportedTransactionVersion: 0,
            });
            if (!tx?.blockTime) return;

            const day = new Date(tx.blockTime * 1000).toISOString().slice(0, 10);
            const owner = publicKey!.toString();

            const pre = tx.meta?.preTokenBalances
              ?.find(b => b.mint === STEAM_MINT && b.owner === owner)
              ?.uiTokenAmount.uiAmount ?? 0;

            const post = tx.meta?.postTokenBalances
              ?.find(b => b.mint === STEAM_MINT && b.owner === owner)
              ?.uiTokenAmount.uiAmount ?? 0;

            const received = post - pre;
            if (received > 0) history[day] = (history[day] ?? 0) + received;
          } catch {}
        }));

        setSteamHistory(history);
      } catch (e) {
        console.warn('STEAM history fetch failed:', e);
      } finally {
        setLoadingHistory(false);
      }
    }

    fetchOnChainHistory();
  }, [publicKey?.toString(), connection]);

  // Courses where user has started progress; fallback to first 4
  const coursesWithProgress = profileProgress.allCourses.filter(course => {
    const p = getProgressForCourse(course.id);
    return p.completedModules.length > 0 || p.gameCompleted;
  });
  const visibleCourses = (coursesWithProgress.length > 0
    ? coursesWithProgress
    : profileProgress.allCourses
  ).slice(0, 4);

  // Curved area chart: STEAM received on-chain per day (last 7 days)
  const last7 = Array.from({ length: 7 }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - (6 - i));
    return d.toISOString().slice(0, 10);
  });
  const chartData = last7.map(day => ({
    day: new Date(day + 'T12:00:00').toLocaleDateString(
      locale === 'es' ? 'es-HN' : 'en-US',
      { weekday: 'short', day: 'numeric' }
    ),
    steam: steamHistory[day] ?? 0,
  }));

  // Recent activity: completed courses as token earnings
  const recentActivity = profileProgress.completedCourses.slice(0, 4).map(course => ({
    label: { es: `Completaste: ${course.title.es}`, en: `Completed: ${course.title.en}` },
    amount: course.steamReward || 0,
  }));

  const stats = [
    {
      label: t.dashboard.lessonsCompleted,
      value: `${profileProgress.completedActivities}`,
      icon: BookOpen,
      gradient: 'from-violet-400 to-indigo-500',
      shadow: 'shadow-violet-100',
      trend: profileProgress.completedActivities > 0 ? `+${profileProgress.completedActivities}` : '',
    },
    {
      label: t.dashboard.coursesEnrolled,
      value: `${profileProgress.coursesInProgress}`,
      icon: TrendingUp,
      gradient: 'from-blue-400 to-cyan-500',
      shadow: 'shadow-blue-100',
      trend: '',
    },
    {
      label: t.dashboard.certificatesEarned,
      value: `${profileProgress.completedCourses.length}`,
      icon: Award,
      gradient: 'from-pink-400 to-rose-500',
      shadow: 'shadow-pink-100',
      trend: '',
    },
    {
      label: 'STEAM',
      value: `${steamBalance}`,
      icon: Coins,
      gradient: 'from-amber-400 to-orange-500',
      shadow: 'shadow-amber-100',
      trend: '',
    },
  ];

  return (
    <div className="space-y-6">
      {/* Welcome Banner */}
      <div className="glass-card rounded-2xl p-6 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-violet-500 to-indigo-600 shadow-lg shadow-violet-200 text-2xl">
            {user?.name ? user.name.charAt(0).toUpperCase() + '🎓' : '🎓'}
          </div>
          <div>
            <p className="text-xs font-semibold text-violet-500 uppercase tracking-wide flex items-center gap-1">
              <Sparkles className="h-3 w-3" />
              {locale === 'es' ? 'Bienvenido de vuelta' : 'Welcome back'}
            </p>
            <h1 className="text-xl font-bold text-gray-900">
              {t.dashboard.welcome}, {studentName} 👋
            </h1>
            <p className="text-sm text-gray-500 mt-0.5">{t.dashboard.aiGreeting}</p>
          </div>
        </div>
        <Link
          to="/courses"
          className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-violet-500 to-indigo-600 px-5 py-2.5 text-sm font-bold text-white shadow-lg shadow-violet-200/60 transition-base hover:opacity-90 hover:scale-105"
        >
          {t.dashboard.viewCatalog}
          <ArrowRight className="h-4 w-4" />
        </Link>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-4 gap-4">
        {stats.map((stat) => (
          <div
            key={stat.label}
            className="glass-card rounded-2xl p-5 transition-all duration-300 hover:scale-[1.03] hover:shadow-xl group"
          >
            <div className="flex items-center justify-between mb-4">
              <div className={`flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br ${stat.gradient} shadow-md ${stat.shadow} transition-transform duration-300 group-hover:scale-110`}>
                <stat.icon className="h-5 w-5 text-white" />
              </div>
              {stat.trend && (
                <span className="rounded-full bg-emerald-100 px-2 py-0.5 text-[10px] font-bold text-emerald-700">
                  {stat.trend}
                </span>
              )}
            </div>
            <p className="text-3xl font-extrabold text-gray-900">{stat.value}</p>
            <p className="mt-1 text-xs text-gray-500 font-medium">{stat.label}</p>
          </div>
        ))}
      </div>

      {/* Main Bento Grid */}
      <div className="grid grid-cols-3 gap-5">
        {/* Left: Courses + Chart */}
        <div className="col-span-2 space-y-5">
          {/* My Courses */}
          <div className="glass-card rounded-2xl overflow-hidden">
            <div className="flex items-center justify-between px-5 py-4 border-b border-white/40">
              <h2 className="text-sm font-bold text-gray-900 flex items-center gap-2">
                <BookOpen className="h-4 w-4 text-violet-500" />
                {t.dashboard.myCourses}
              </h2>
              <Link to="/courses" className="flex items-center gap-1 text-xs font-semibold text-violet-600 hover:text-violet-800 transition-colors">
                {t.common.viewAll} <ChevronRight className="h-3.5 w-3.5" />
              </Link>
            </div>
            <div className="p-4 space-y-3">
              {visibleCourses.length === 0 ? (
                <p className="py-6 text-center text-sm text-gray-400">
                  {locale === 'es' ? 'Aún no has comenzado ningún curso.' : 'You haven\'t started any courses yet.'}
                </p>
              ) : visibleCourses.map((course) => {
                const localProgress = getProgressForCourse(course.id);
                const progress = getProgressPercent(course, localProgress);
                const completedLessons = localProgress.completedModules.length;
                const lessonCount = getCourseModuleCount(course);
                const hasGame = !!course.game;
                const gameCompleted = localProgress.gameCompleted;
                return (
                  <div
                    key={course.id}
                    className="flex items-center gap-4 rounded-xl bg-white/50 border border-white/60 p-3.5 transition-all duration-200 hover:bg-white/80 hover:shadow-md group"
                  >
                    <div className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br ${course.color} text-2xl shadow-sm`}>
                      {course.image}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="text-sm font-semibold text-gray-900 truncate">
                        {locale === 'es' ? course.title.es : course.title.en}
                      </h3>
                      <div className="mt-1.5 flex items-center gap-3">
                        <div className="flex-1 h-2 rounded-full bg-gray-100 overflow-hidden">
                          <div
                            className="h-full rounded-full bg-gradient-to-r from-violet-400 to-indigo-500 transition-all duration-500"
                            style={{ width: `${progress}%` }}
                          />
                        </div>
                        <span className="text-xs font-semibold text-gray-500 shrink-0">
                          {completedLessons}/{lessonCount}
                        </span>
                      </div>
                      {hasGame && (
                        <div className="mt-1.5 flex items-center gap-1.5">
                          {gameCompleted
                            ? <CheckCircle2 className="h-3 w-3 text-emerald-500 shrink-0" />
                            : <Puzzle className="h-3 w-3 text-amber-400 shrink-0" />}
                          <span className={`text-[10px] font-semibold ${gameCompleted ? 'text-emerald-600' : 'text-amber-500'}`}>
                            {gameCompleted
                              ? locale === 'es' ? 'Reto completado' : 'Challenge done'
                              : locale === 'es' ? 'Reto pendiente' : 'Challenge pending'}
                          </span>
                        </div>
                      )}
                    </div>
                    <Link
                      to={`/courses/${course.id}`}
                      className="shrink-0 rounded-xl bg-gradient-to-r from-violet-500 to-indigo-600 px-3 py-1.5 text-[11px] font-bold text-white shadow-sm shadow-violet-200/60 opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                    >
                      {progress >= 100 && (!hasGame || gameCompleted) ? t.common.completed : t.courses.continueLesson}
                    </Link>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Progress Chart */}
          <div className="glass-card rounded-2xl overflow-hidden">
            <div className="flex items-center justify-between px-5 py-4 border-b border-white/40">
              <div className="flex items-center gap-2">
                <TrendingUp className="h-4 w-4 text-violet-500" />
                <h2 className="text-sm font-bold text-gray-900">{t.dashboard.progressAnalytics}</h2>
              </div>
              <span className="text-[10px] font-semibold text-gray-400 uppercase tracking-wide">
                {locale === 'es' ? 'Últimos 7 días · STEAM on-chain' : 'Last 7 days · STEAM on-chain'}
              </span>
            </div>
            <div className="p-4 relative">
              {!publicKey && (
                <div className="absolute inset-0 flex items-center justify-center z-10 bg-white/60 backdrop-blur-sm rounded-b-2xl">
                  <p className="text-sm text-gray-400 font-medium">
                    {locale === 'es' ? 'Conecta tu wallet para ver el historial' : 'Connect your wallet to see history'}
                  </p>
                </div>
              )}
              {loadingHistory && publicKey && (
                <div className="absolute inset-0 flex items-center justify-center z-10 bg-white/60 backdrop-blur-sm rounded-b-2xl">
                  <div className="flex items-center gap-2 text-sm text-violet-500 font-medium">
                    <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24" fill="none">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/>
                    </svg>
                    {locale === 'es' ? 'Leyendo historial de Solana…' : 'Reading Solana history…'}
                  </div>
                </div>
              )}
              <ResponsiveContainer width="100%" height={200}>
                <AreaChart data={chartData} margin={{ top: 8, right: 8, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="steamGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.25} />
                      <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,0,0,0.04)" vertical={false} />
                  <XAxis
                    dataKey="day"
                    tick={{ fontSize: 10, fill: '#9ca3af' }}
                    axisLine={false}
                    tickLine={false}
                  />
                  <YAxis
                    tick={{ fontSize: 10, fill: '#9ca3af' }}
                    axisLine={false}
                    tickLine={false}
                    allowDecimals={false}
                  />
                  <Tooltip
                    formatter={(v: number) => [`${v} STEAM`, '']}
                    labelFormatter={(label) => label}
                    contentStyle={{
                      backgroundColor: 'rgba(255,255,255,0.92)',
                      border: '1px solid rgba(139,92,246,0.15)',
                      borderRadius: '12px',
                      fontSize: '12px',
                      boxShadow: '0 4px 20px rgba(139,92,246,0.12)',
                    }}
                    cursor={{ stroke: '#8b5cf6', strokeWidth: 1, strokeDasharray: '4 4' }}
                  />
                  <Area
                    type="monotone"
                    dataKey="steam"
                    stroke="#8b5cf6"
                    strokeWidth={2.5}
                    fill="url(#steamGradient)"
                    dot={{ fill: '#8b5cf6', stroke: '#fff', strokeWidth: 2, r: 4 }}
                    activeDot={{ r: 6, fill: '#6d28d9', stroke: '#fff', strokeWidth: 2 }}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Right Column */}
        <div className="space-y-4">
          {/* STEAM Balance */}
          <div className="rounded-2xl overflow-hidden shadow-lg shadow-amber-100/60">
            <div className="bg-gradient-to-br from-amber-400 via-orange-400 to-orange-500 p-5">
              <div className="flex items-center gap-2 mb-1">
                <Coins className="h-5 w-5 text-white" />
                <span className="text-sm font-bold text-white">{t.dashboard.steamBalance}</span>
              </div>
              <p className="text-4xl font-extrabold text-white mt-1">{steamBalance}</p>
              <p className="text-xs text-white/70 mt-1">{t.dashboard.totalEarned}: {steamBalance} STEAM</p>
            </div>
            <div className="bg-white/80 backdrop-blur-sm p-4 border border-white/50">
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-2">
                {t.dashboard.recentActivity}
              </p>
              {recentActivity.length === 0 ? (
                <p className="py-2 text-xs text-center text-gray-400">
                  {locale === 'es' ? 'Completa cursos para ganar STEAM.' : 'Complete courses to earn STEAM.'}
                </p>
              ) : (
                <div className="space-y-2">
                  {recentActivity.map((item, i) => (
                    <div key={i} className="flex items-center justify-between rounded-xl bg-amber-50/80 px-3 py-2">
                      <p className="text-xs font-medium text-gray-800 leading-tight truncate max-w-[75%]">
                        {locale === 'es' ? item.label.es : item.label.en}
                      </p>
                      <span className="text-xs font-bold text-emerald-600 shrink-0">+{item.amount}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Achievements */}
          <div className="glass-card rounded-2xl overflow-hidden">
            <div className="flex items-center gap-2 px-4 py-3.5 border-b border-white/40">
              <Award className="h-4 w-4 text-pink-500" />
              <h2 className="text-sm font-bold text-gray-900">{t.dashboard.myAchievements}</h2>
            </div>
            <div className="p-3 space-y-2">
              {profileProgress.completedCourses.length === 0 ? (
                <p className="py-4 text-center text-sm text-gray-400">{t.nfts.noCertificates}</p>
              ) : profileProgress.completedCourses.slice(0, 3).map((course) => (
                <Link
                  key={course.id}
                  to="/nfts"
                  className="flex items-center gap-3 rounded-xl bg-white/50 border border-white/60 p-3 transition-all duration-200 hover:bg-white/80 hover:shadow-sm group"
                >
                  <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br ${course.color} text-lg shadow-sm`}>
                    {course.image}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-semibold text-gray-800 truncate">
                      {locale === 'es' ? course.title.es : course.title.en}
                    </p>
                    <p className="text-[10px] text-gray-400 mt-0.5">
                      {locale === 'es' ? 'Completado' : 'Completed'} · {course.steamReward} STEAM
                    </p>
                  </div>
                  <Award className="h-4 w-4 text-pink-400 shrink-0" />
                </Link>
              ))}
            </div>
          </div>

          {/* AI Sessions */}
          <div className="glass-card rounded-2xl overflow-hidden">
            <div className="flex items-center justify-between px-4 py-3.5 border-b border-white/40">
              <div className="flex items-center gap-2">
                <Bot className="h-4 w-4 text-violet-500" />
                <h2 className="text-sm font-bold text-gray-900">{t.dashboard.aiSessions}</h2>
              </div>
              <Link to="/ai-tutor" className="text-[10px] font-semibold text-violet-600 hover:text-violet-800">
                {t.common.viewAll}
              </Link>
            </div>
            <div className="p-3 space-y-2">
              {aiSessions.length === 0 ? (
                <p className="py-4 text-center text-sm text-gray-400">
                  {locale === 'es' ? 'No hay sesiones aún.' : 'No sessions yet.'}
                </p>
              ) : aiSessions.map((session, i) => (
                <Link
                  key={i}
                  to="/ai-tutor"
                  className="flex items-center justify-between rounded-xl bg-white/50 border border-white/60 px-3 py-2.5 hover:bg-white/80 transition-all"
                >
                  <div className="min-w-0">
                    <p className="text-xs font-semibold text-gray-800 truncate">{session.title}</p>
                    <p className="text-[10px] text-gray-400 mt-0.5">{session.date}</p>
                  </div>
                  <span className="ml-2 shrink-0 rounded-full bg-violet-100 px-2 py-0.5 text-[10px] font-semibold text-violet-700">
                    {session.messageCount} msgs
                  </span>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
