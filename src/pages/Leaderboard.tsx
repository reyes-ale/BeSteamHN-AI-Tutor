import React, { useState, useEffect } from 'react';
import { useI18n } from '@/lib/i18n';
import { Trophy, Coins, BookOpen, Award } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { leaderboard, type LeaderboardEntry } from '@/lib/mockData';
import { supabase } from '@/lib/supabase';

async function fetchLeaderboard(): Promise<LeaderboardEntry[]> {
  const { data, error } = await supabase
    .from('profiles')
    .select('id, name, steam_balance, courses_completed, certificates')
    .eq('role', 'student')
    .order('steam_balance', { ascending: false })
    .limit(10);

  if (error) throw new Error(error.message);
  if (!data || data.length === 0) return leaderboard;

  return data.map((row: any, i: number) => ({
    rank: i + 1,
    name: row.name || 'Unknown',
    avatar: (row.name as string || 'U')
      .split(' ')
      .map((n: string) => n[0])
      .join('')
      .slice(0, 2)
      .toUpperCase(),
    steam: row.steam_balance || 0,
    coursesCompleted: row.courses_completed || 0,
    certificates: row.certificates || 0,
  }));
}

function SkeletonRow() {
  return (
    <tr className="border-b border-border/50">
      <td className="px-5 py-3"><div className="h-7 w-7 rounded-full bg-muted animate-pulse" /></td>
      <td className="px-5 py-3"><div className="h-4 w-40 rounded bg-muted animate-pulse" /></td>
      <td className="px-5 py-3 text-right"><div className="ml-auto h-4 w-12 rounded bg-muted animate-pulse" /></td>
      <td className="px-5 py-3 text-right"><div className="ml-auto h-4 w-8 rounded bg-muted animate-pulse" /></td>
      <td className="px-5 py-3 text-right"><div className="ml-auto h-4 w-8 rounded bg-muted animate-pulse" /></td>
    </tr>
  );
}

export default function Leaderboard() {
  const { t } = useI18n();
  const [entries, setEntries] = useState<LeaderboardEntry[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchLeaderboard()
      .then(setEntries)
      .catch(() => setEntries(leaderboard))
      .finally(() => setLoading(false));
  }, []);

  const top3 = loading ? [] : entries.slice(0, 3);
  const rest = loading ? [] : entries.slice(3);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">{t.leaderboard.title}</h1>
        <p className="mt-1 text-sm text-muted-foreground">{t.leaderboard.description}</p>
      </div>

      <Tabs defaultValue="allTime">
        <TabsList className="bg-muted">
          <TabsTrigger value="allTime" className="text-sm">{t.leaderboard.allTime}</TabsTrigger>
          <TabsTrigger value="month" className="text-sm">{t.leaderboard.thisMonth}</TabsTrigger>
        </TabsList>

        <TabsContent value="allTime" className="mt-4 space-y-6">
          {/* Podium */}
          {!loading && top3.length > 0 && (
            <div className="mx-auto grid w-full max-w-xl grid-cols-3 items-end justify-items-center gap-4 pb-4">
              {/* 2nd Place */}
              {top3[1] && <div className="flex flex-col items-center">
                <div className="flex h-14 w-14 items-center justify-center rounded-full bg-muted text-lg font-bold text-foreground border-2 border-border">
                  {top3[1].avatar}
                </div>
                <p className="mt-2 text-sm font-semibold text-foreground">{top3[1].name}</p>
                <div className="flex items-center gap-1 mt-1">
                  <Coins className="h-3 w-3 text-steam" />
                  <span className="text-xs font-bold text-steam">{top3[1].steam}</span>
                </div>
                <div className="mt-3 flex h-20 w-24 items-center justify-center rounded-t-xl bg-muted">
                  <span className="text-2xl font-bold text-muted-foreground">2</span>
                </div>
              </div>}

              {/* 1st Place */}
              <div className="flex flex-col items-center">
                <div className="relative">
                  <div className="flex h-[72px] w-[72px] items-center justify-center rounded-full bg-gradient-steam text-xl font-bold text-steam-foreground border-3 border-steam">
                    {top3[0].avatar}
                  </div>
                  <div className="absolute -top-2 -right-1">
                    <Trophy className="h-5 w-5 text-steam" />
                  </div>
                </div>
                <p className="mt-2 text-sm font-bold text-foreground">{top3[0].name}</p>
                <div className="flex items-center gap-1 mt-1">
                  <Coins className="h-3 w-3 text-steam" />
                  <span className="text-xs font-bold text-steam">{top3[0].steam}</span>
                </div>
                <div className="mt-3 flex h-28 w-24 items-center justify-center rounded-t-xl bg-gradient-steam">
                  <span className="text-3xl font-bold text-steam-foreground">1</span>
                </div>
              </div>

              {/* 3rd Place */}
              {top3[2] && <div className="flex flex-col items-center">
                <div className="flex h-14 w-14 items-center justify-center rounded-full bg-muted text-lg font-bold text-foreground border-2 border-border">
                  {top3[2].avatar}
                </div>
                <p className="mt-2 text-sm font-semibold text-foreground">{top3[2].name}</p>
                <div className="flex items-center gap-1 mt-1">
                  <Coins className="h-3 w-3 text-steam" />
                  <span className="text-xs font-bold text-steam">{top3[2].steam}</span>
                </div>
                <div className="mt-3 flex h-14 w-24 items-center justify-center rounded-t-xl bg-muted">
                  <span className="text-2xl font-bold text-muted-foreground">3</span>
                </div>
              </div>}
            </div>
          )}

          {/* Table */}
          <Card className="border-border bg-card shadow-theme-sm overflow-hidden">
            <CardContent className="p-0">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-border bg-muted/50">
                    <th className="px-5 py-3 text-left text-xs font-semibold text-muted-foreground">{t.leaderboard.rank}</th>
                    <th className="px-5 py-3 text-left text-xs font-semibold text-muted-foreground">{t.leaderboard.student}</th>
                    <th className="px-5 py-3 text-right text-xs font-semibold text-muted-foreground">{t.leaderboard.steam}</th>
                    <th className="px-5 py-3 text-right text-xs font-semibold text-muted-foreground">{t.leaderboard.courses}</th>
                    <th className="px-5 py-3 text-right text-xs font-semibold text-muted-foreground">{t.leaderboard.certificates}</th>
                  </tr>
                </thead>
                <tbody>
                  {loading
                    ? Array.from({ length: 5 }).map((_, i) => <SkeletonRow key={i} />)
                    : (rest.length > 0 ? rest : entries).map((entry) => (
                        <tr key={entry.rank} className="border-b border-border/50 transition-base hover:bg-muted/30">
                          <td className="px-5 py-3">
                            <span className="flex h-7 w-7 items-center justify-center rounded-full bg-muted text-xs font-bold text-muted-foreground">
                              {entry.rank}
                            </span>
                          </td>
                          <td className="px-5 py-3">
                            <div className="flex items-center gap-3">
                              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-xs font-bold text-primary">
                                {entry.avatar}
                              </div>
                              <span className="text-sm font-medium text-foreground">{entry.name}</span>
                            </div>
                          </td>
                          <td className="px-5 py-3 text-right">
                            <span className="flex items-center justify-end gap-1 text-sm font-bold text-steam">
                              <Coins className="h-3 w-3" /> {entry.steam}
                            </span>
                          </td>
                          <td className="px-5 py-3 text-right">
                            <span className="flex items-center justify-end gap-1 text-sm text-muted-foreground">
                              <BookOpen className="h-3 w-3" /> {entry.coursesCompleted}
                            </span>
                          </td>
                          <td className="px-5 py-3 text-right">
                            <span className="flex items-center justify-end gap-1 text-sm text-muted-foreground">
                              <Award className="h-3 w-3" /> {entry.certificates}
                            </span>
                          </td>
                        </tr>
                      ))}
                </tbody>
              </table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="month" className="mt-4">
          <Card className="border-border bg-card shadow-theme-sm overflow-hidden">
            <CardContent className="p-0">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-border bg-muted/50">
                    <th className="px-5 py-3 text-left text-xs font-semibold text-muted-foreground">{t.leaderboard.rank}</th>
                    <th className="px-5 py-3 text-left text-xs font-semibold text-muted-foreground">{t.leaderboard.student}</th>
                    <th className="px-5 py-3 text-right text-xs font-semibold text-muted-foreground">{t.leaderboard.steam}</th>
                    <th className="px-5 py-3 text-right text-xs font-semibold text-muted-foreground">{t.leaderboard.courses}</th>
                    <th className="px-5 py-3 text-right text-xs font-semibold text-muted-foreground">{t.leaderboard.certificates}</th>
                  </tr>
                </thead>
                <tbody>
                  {loading
                    ? Array.from({ length: 5 }).map((_, i) => <SkeletonRow key={i} />)
                    : entries.slice(0, 5).map((entry, i) => (
                        <tr key={entry.rank} className="border-b border-border/50 transition-base hover:bg-muted/30">
                          <td className="px-5 py-3">
                            <span className={`flex h-7 w-7 items-center justify-center rounded-full text-xs font-bold ${
                              i === 0 ? 'bg-gradient-steam text-steam-foreground' : 'bg-muted text-muted-foreground'
                            }`}>
                              {i + 1}
                            </span>
                          </td>
                          <td className="px-5 py-3">
                            <div className="flex items-center gap-3">
                              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-xs font-bold text-primary">
                                {entry.avatar}
                              </div>
                              <span className="text-sm font-medium text-foreground">{entry.name}</span>
                            </div>
                          </td>
                          <td className="px-5 py-3 text-right">
                            <span className="flex items-center justify-end gap-1 text-sm font-bold text-steam">
                              <Coins className="h-3 w-3" /> {Math.round(entry.steam * 0.3)}
                            </span>
                          </td>
                          <td className="px-5 py-3 text-right text-sm text-muted-foreground">
                            {Math.max(1, Math.round(entry.coursesCompleted * 0.3))}
                          </td>
                          <td className="px-5 py-3 text-right text-sm text-muted-foreground">
                            {Math.max(0, Math.round(entry.certificates * 0.3))}
                          </td>
                        </tr>
                      ))}
                </tbody>
              </table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
