import React from 'react';
import { useI18n } from '@/lib/i18n';
import { useAuth } from '@/lib/auth';
import { useWallet } from '@solana/wallet-adapter-react';
import { Link } from 'react-router-dom';
import {
  BookOpen,
  Award,
  Coins,
  TrendingUp,
  Bot,
  Flame,
  ArrowRight,
  ChevronRight,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { enrolledCourses, nftCertificates, weeklyProgress, tokenHistory } from '@/lib/mockData';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Area, AreaChart } from 'recharts';

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
      color: 'bg-primary/10 text-primary',
      trend: '+5 ' + t.dashboard.thisWeek,
    },
    {
      label: t.dashboard.coursesEnrolled,
      value: '3',
      icon: TrendingUp,
      color: 'bg-secondary/10 text-secondary',
      trend: '',
    },
    {
      label: t.dashboard.certificatesEarned,
      value: `${nftCertificates.length}`,
      icon: Award,
      color: 'bg-info/10 text-info',
      trend: '',
    },
    {
      label: t.dashboard.streak,
      value: '12',
      icon: Flame,
      color: 'bg-destructive/10 text-destructive',
      trend: '',
    },
  ];

  return (
    <div className="space-y-6">
      {/* Welcome */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">
            {t.dashboard.welcome}, {studentName} 👋
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">{t.dashboard.aiGreeting}</p>
        </div>
        <Link
          to="/courses"
          className="flex items-center gap-2 rounded-lg bg-gradient-accent px-4 py-2 text-sm font-semibold text-accent-foreground transition-base hover:opacity-90 hover:shadow-glow"
        >
          {t.dashboard.viewCatalog}
          <ArrowRight className="h-4 w-4" />
        </Link>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-4 gap-4">
        {stats.map((stat) => (
          <Card key={stat.label} className="border-border bg-card shadow-theme-sm transition-base hover:shadow-theme-md">
            <CardContent className="flex items-center gap-4 p-4">
              <div className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ${stat.color}`}>
                <stat.icon className="h-5 w-5" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">{stat.value}</p>
                <p className="text-xs text-muted-foreground">{stat.label}</p>
                {stat.trend && (
                  <p className="mt-0.5 text-[10px] font-medium text-success">{stat.trend}</p>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-3 gap-6">
        {/* My Courses - Spans 2 columns */}
        <div className="col-span-2 space-y-4">
          <Card className="border-border bg-card shadow-theme-sm">
            <CardHeader className="flex flex-row items-center justify-between pb-3">
              <CardTitle className="text-base font-semibold text-foreground">
                {t.dashboard.myCourses}
              </CardTitle>
              <Link to="/courses" className="flex items-center gap-1 text-xs font-medium text-secondary hover:underline">
                {t.common.viewAll} <ChevronRight className="h-3 w-3" />
              </Link>
            </CardHeader>
            <CardContent className="space-y-3">
              {enrolledCourses.map((course) => {
                const progress = Math.round((course.lessonsCompleted / course.lessons) * 100);
                return (
                  <div
                    key={course.id}
                    className="flex items-center gap-4 rounded-xl border border-border bg-background p-4 transition-base hover:border-secondary/30 hover:shadow-theme-sm"
                  >
                    <div className={`flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br ${course.color} text-2xl`}>
                      {course.image}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="text-sm font-semibold text-foreground truncate">
                        {locale === 'es' ? course.title.es : course.title.en}
                      </h3>
                      <div className="mt-1.5 flex items-center gap-3">
                        <Progress value={progress} className="h-2 flex-1" />
                        <span className="text-xs font-medium text-muted-foreground shrink-0">
                          {course.lessonsCompleted}/{course.lessons}
                        </span>
                      </div>
                      <p className="mt-1 text-[11px] text-muted-foreground">
                        {progress}% {t.common.completed.toLowerCase()}
                      </p>
                    </div>
                    <Link
                      to={`/courses/${course.id}`}
                      className="shrink-0 rounded-lg border border-border bg-card px-3 py-1.5 text-xs font-medium text-foreground transition-base hover:bg-muted"
                    >
                      {course.status === 'completed' ? t.common.completed : t.courses.continueLesson}
                    </Link>
                  </div>
                );
              })}
            </CardContent>
          </Card>

          {/* Progress Chart */}
          <Card className="border-border bg-card shadow-theme-sm">
            <CardHeader className="pb-2">
              <CardTitle className="text-base font-semibold text-foreground">
                {t.dashboard.progressAnalytics}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={220}>
                <AreaChart data={weeklyProgress}>
                  <defs>
                    <linearGradient id="colorLessons" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="hsl(213 52% 35%)" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="hsl(213 52% 35%)" stopOpacity={0} />
                    </linearGradient>
                    <linearGradient id="colorSteam" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="hsl(170 65% 50%)" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="hsl(170 65% 50%)" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(214 20% 90%)" />
                  <XAxis dataKey="week" tick={{ fontSize: 11, fill: 'hsl(215 16% 47%)' }} />
                  <YAxis tick={{ fontSize: 11, fill: 'hsl(215 16% 47%)' }} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: 'hsl(0 0% 100%)',
                      border: '1px solid hsl(214 20% 90%)',
                      borderRadius: '8px',
                      fontSize: '12px',
                    }}
                  />
                  <Area type="monotone" dataKey="lessons" stroke="hsl(213 52% 35%)" fill="url(#colorLessons)" strokeWidth={2} name={t.dashboard.lessonsCompleted} />
                  <Area type="monotone" dataKey="steam" stroke="hsl(170 65% 50%)" fill="url(#colorSteam)" strokeWidth={2} name="STEAM" />
                </AreaChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>

        {/* Right Column */}
        <div className="space-y-4">
          {/* STEAM Balance */}
          <Card className="overflow-hidden border-border shadow-theme-sm">
            <div className="bg-gradient-steam p-5">
              <div className="flex items-center gap-2">
                <Coins className="h-5 w-5 text-steam-foreground" />
                <span className="text-sm font-semibold text-steam-foreground">{t.dashboard.steamBalance}</span>
              </div>
              <p className="mt-2 text-4xl font-bold text-steam-foreground">350</p>
              <p className="mt-1 text-xs text-steam-foreground/70">{t.dashboard.totalEarned}: 350 STEAM</p>
            </div>
            <CardContent className="p-4">
              <h4 className="mb-2 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                {t.dashboard.recentActivity}
              </h4>
              <div className="space-y-2">
                {tokenHistory.slice(0, 4).map((item, i) => (
                  <div key={i} className="flex items-center justify-between rounded-lg bg-background p-2">
                    <div>
                      <p className="text-xs font-medium text-foreground">
                        {locale === 'es' ? item.reason.es : item.reason.en}
                      </p>
                      <p className="text-[10px] text-muted-foreground">{item.date}</p>
                    </div>
                    <span className="text-xs font-bold text-success">+{item.amount}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Achievements */}
          <Card className="border-border bg-card shadow-theme-sm">
            <CardHeader className="pb-3">
              <CardTitle className="text-base font-semibold text-foreground">
                {t.dashboard.myAchievements}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {nftCertificates.map((cert) => (
                <Link
                  key={cert.id}
                  to="/nfts"
                  className="flex items-center gap-3 rounded-xl border border-border bg-background p-3 transition-base hover:border-secondary/30 hover:shadow-theme-sm"
                >
                  <div className={`flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br ${cert.color} text-lg`}>
                    {cert.image}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-semibold text-foreground truncate">
                      {locale === 'es' ? cert.courseName.es : cert.courseName.en}
                    </p>
                    <p className="text-[10px] text-muted-foreground">
                      {cert.grade} · {cert.completionDate}
                    </p>
                  </div>
                  <Award className="h-4 w-4 text-secondary shrink-0" />
                </Link>
              ))}
              {nftCertificates.length === 0 && (
                <p className="py-4 text-center text-sm text-muted-foreground">
                  {t.nfts.noCertificates}
                </p>
              )}
            </CardContent>
          </Card>

          {/* AI Sessions */}
          <Card className="border-border bg-card shadow-theme-sm">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-base font-semibold text-foreground">
                <Bot className="h-4 w-4 text-secondary" />
                {t.dashboard.aiSessions}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {[
                  { date: '2026-05-08', topic: locale === 'es' ? 'Variables en Python' : 'Python Variables', msgs: 12 },
                  { date: '2026-05-07', topic: locale === 'es' ? 'Bucles y condicionales' : 'Loops & Conditionals', msgs: 8 },
                  { date: '2026-05-06', topic: locale === 'es' ? 'Quiz de Liderazgo' : 'Leadership Quiz', msgs: 15 },
                ].map((session, i) => (
                  <div key={i} className="flex items-center justify-between rounded-lg bg-background p-2.5">
                    <div>
                      <p className="text-xs font-medium text-foreground">{session.topic}</p>
                      <p className="text-[10px] text-muted-foreground">{session.date}</p>
                    </div>
                    <span className="text-[10px] text-muted-foreground">{session.msgs} msgs</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}