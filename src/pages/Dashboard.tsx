import React from 'react';
import { useI18n } from '@/lib/i18n';
import { useAuth } from '@/lib/auth';
import { useWallet } from '@solana/wallet-adapter-react';
import { Link } from 'react-router-dom';
import { BookOpen, Award, Coins, TrendingUp, Bot, Flame, ArrowRight, ChevronRight, Sparkles } from 'lucide-react';
import { Progress } from '@/components/ui/progress';
import { enrolledCourses, nftCertificates, weeklyProgress, tokenHistory } from '@/lib/mockData';
import { Area, AreaChart, CartesianGrid, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

export default function Dashboard() {
  const { t, locale } = useI18n();
  const { publicKey } = useWallet();
  const { user } = useAuth();
  const studentName = user?.name?.split(' ')[0] || 'Student';

  const stats = [
    {
      label: t.dashboard.lessonsCompleted,
      value: '19',
      icon: BookOpen,
      gradient: 'from-violet-400 to-indigo-500',
      bg: 'bg-violet-50',
      text: 'text-violet-600',
      shadow: 'shadow-violet-100',
      trend: '+5 ' + t.dashboard.thisWeek,
    },
    {
      label: t.dashboard.coursesEnrolled,
      value: '3',
      icon: TrendingUp,
      gradient: 'from-blue-400 to-cyan-500',
      bg: 'bg-blue-50',
      text: 'text-blue-600',
      shadow: 'shadow-blue-100',
      trend: '',
    },
    {
      label: t.dashboard.certificatesEarned,
      value: `${nftCertificates.length}`,
      icon: Award,
      gradient: 'from-pink-400 to-rose-500',
      bg: 'bg-pink-50',
      text: 'text-pink-600',
      shadow: 'shadow-pink-100',
      trend: '',
    },
    {
      label: t.dashboard.streak,
      value: '12',
      icon: Flame,
      gradient: 'from-orange-400 to-amber-500',
      bg: 'bg-orange-50',
      text: 'text-orange-600',
      shadow: 'shadow-orange-100',
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

      {/* Stats Grid — Bento Row */}
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
        {/* My Courses — 2 cols */}
        <div className="col-span-2 space-y-5">
          {/* Courses Card */}
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
              {enrolledCourses.map((course) => {
                const progress = Math.round((course.lessonsCompleted / course.lessons) * 100);
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
                          {course.lessonsCompleted}/{course.lessons}
                        </span>
                      </div>
                    </div>
                    <Link
                      to={`/courses/${course.id}`}
                      className="shrink-0 rounded-xl bg-gradient-to-r from-violet-500 to-indigo-600 px-3 py-1.5 text-[11px] font-bold text-white shadow-sm shadow-violet-200/60 opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                    >
                      {course.status === 'completed' ? t.common.completed : t.courses.continueLesson}
                    </Link>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Progress Chart */}
          <div className="glass-card rounded-2xl overflow-hidden">
            <div className="flex items-center gap-2 px-5 py-4 border-b border-white/40">
              <TrendingUp className="h-4 w-4 text-violet-500" />
              <h2 className="text-sm font-bold text-gray-900">{t.dashboard.progressAnalytics}</h2>
            </div>
            <div className="p-4">
              <ResponsiveContainer width="100%" height={200}>
                <AreaChart data={weeklyProgress}>
                  <defs>
                    <linearGradient id="gradLessons" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.25} />
                      <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0} />
                    </linearGradient>
                    <linearGradient id="gradSteam" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.25} />
                      <stop offset="95%" stopColor="#f59e0b" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,0,0,0.05)" />
                  <XAxis dataKey="week" tick={{ fontSize: 11, fill: '#9ca3af' }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fontSize: 11, fill: '#9ca3af' }} axisLine={false} tickLine={false} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: 'rgba(255,255,255,0.9)',
                      border: '1px solid rgba(255,255,255,0.5)',
                      borderRadius: '12px',
                      fontSize: '12px',
                      boxShadow: '0 4px 24px rgba(120,80,200,0.12)',
                    }}
                  />
                  <Area type="monotone" dataKey="lessons" stroke="#8b5cf6" fill="url(#gradLessons)" strokeWidth={2} name={t.dashboard.lessonsCompleted} />
                  <Area type="monotone" dataKey="steam" stroke="#f59e0b" fill="url(#gradSteam)" strokeWidth={2} name="STEAM" />
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
              <p className="text-4xl font-extrabold text-white mt-1">350</p>
              <p className="text-xs text-white/70 mt-1">{t.dashboard.totalEarned}: 350 STEAM</p>
            </div>
            <div className="bg-white/80 backdrop-blur-sm p-4 border border-white/50">
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-2">
                {t.dashboard.recentActivity}
              </p>
              <div className="space-y-2">
                {tokenHistory.slice(0, 4).map((item, i) => (
                  <div key={i} className="flex items-center justify-between rounded-xl bg-amber-50/80 px-3 py-2">
                    <div>
                      <p className="text-xs font-medium text-gray-800 leading-tight">
                        {locale === 'es' ? item.reason.es : item.reason.en}
                      </p>
                      <p className="text-[10px] text-gray-400">{item.date}</p>
                    </div>
                    <span className="text-xs font-bold text-emerald-600">+{item.amount}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* NFT Achievements */}
          <div className="glass-card rounded-2xl overflow-hidden">
            <div className="flex items-center gap-2 px-4 py-3.5 border-b border-white/40">
              <Award className="h-4 w-4 text-pink-500" />
              <h2 className="text-sm font-bold text-gray-900">{t.dashboard.myAchievements}</h2>
            </div>
            <div className="p-3 space-y-2">
              {nftCertificates.map((cert) => (
                <Link
                  key={cert.id}
                  to="/nfts"
                  className="flex items-center gap-3 rounded-xl bg-white/50 border border-white/60 p-3 transition-all duration-200 hover:bg-white/80 hover:shadow-sm group"
                >
                  <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br ${cert.color} text-lg shadow-sm`}>
                    {cert.image}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-semibold text-gray-800 truncate">
                      {locale === 'es' ? cert.courseName.es : cert.courseName.en}
                    </p>
                    <p className="text-[10px] text-gray-400 mt-0.5">
                      {cert.grade} · {cert.completionDate}
                    </p>
                  </div>
                  <Award className="h-4 w-4 text-pink-400 shrink-0" />
                </Link>
              ))}
              {nftCertificates.length === 0 && (
                <p className="py-4 text-center text-sm text-gray-400">{t.nfts.noCertificates}</p>
              )}
            </div>
          </div>

          {/* AI Sessions */}
          <div className="glass-card rounded-2xl overflow-hidden">
            <div className="flex items-center gap-2 px-4 py-3.5 border-b border-white/40">
              <Bot className="h-4 w-4 text-violet-500" />
              <h2 className="text-sm font-bold text-gray-900">{t.dashboard.aiSessions}</h2>
            </div>
            <div className="p-3 space-y-2">
              {[
                { date: '2026-05-08', topic: locale === 'es' ? 'Variables en Python' : 'Python Variables', msgs: 12 },
                { date: '2026-05-07', topic: locale === 'es' ? 'Bucles y condicionales' : 'Loops & Conditionals', msgs: 8 },
                { date: '2026-05-06', topic: locale === 'es' ? 'Quiz de Liderazgo' : 'Leadership Quiz', msgs: 15 },
              ].map((session, i) => (
                <div key={i} className="flex items-center justify-between rounded-xl bg-white/50 border border-white/60 px-3 py-2.5">
                  <div>
                    <p className="text-xs font-semibold text-gray-800">{session.topic}</p>
                    <p className="text-[10px] text-gray-400 mt-0.5">{session.date}</p>
                  </div>
                  <span className="rounded-full bg-violet-100 px-2 py-0.5 text-[10px] font-semibold text-violet-700">
                    {session.msgs} msgs
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
