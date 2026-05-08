import React, { useState, useMemo } from 'react';
import { useI18n } from '@/lib/i18n';
import { Link } from 'react-router-dom';
import { Search, Clock, Signal, Coins, Users, BookOpen } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { courses } from '@/lib/mockData';

type Category = 'all' | 'programming' | 'softSkills' | 'design' | 'robotics';
type Difficulty = 'all' | 'beginner' | 'intermediate' | 'advanced';

export default function Courses() {
  const { t, locale } = useI18n();
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState<Category>('all');
  const [difficulty, setDifficulty] = useState<Difficulty>('all');

  const categories: { key: Category; label: string }[] = [
    { key: 'all', label: t.courses.allCategories },
    { key: 'programming', label: t.courses.programming },
    { key: 'softSkills', label: t.courses.softSkills },
    { key: 'design', label: t.courses.design },
    { key: 'robotics', label: t.courses.robotics },
  ];

  const difficulties: { key: Difficulty; label: string }[] = [
    { key: 'all', label: t.courses.allDifficulties },
    { key: 'beginner', label: t.courses.beginner },
    { key: 'intermediate', label: t.courses.intermediate },
    { key: 'advanced', label: t.courses.advanced },
  ];

  const difficultyColors: Record<string, string> = {
    beginner: 'bg-success/10 text-success',
    intermediate: 'bg-warning/10 text-warning',
    advanced: 'bg-destructive/10 text-destructive',
  };

  const filtered = useMemo(() => {
    return courses.filter((c) => {
      const title = locale === 'es' ? c.title.es : c.title.en;
      const matchesSearch = title.toLowerCase().includes(search.toLowerCase());
      const matchesCategory = category === 'all' || c.category === category;
      const matchesDifficulty = difficulty === 'all' || c.difficulty === difficulty;
      return matchesSearch && matchesCategory && matchesDifficulty;
    });
  }, [search, category, difficulty, locale]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-foreground">{t.courses.catalog}</h1>
        <p className="mt-1 text-sm text-muted-foreground">{t.courses.catalogDesc}</p>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-3">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder={t.common.search}
            className="w-full rounded-lg border border-input bg-card pl-9 pr-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-secondary/50"
          />
        </div>
        <div className="flex items-center gap-1.5 rounded-lg border border-border bg-card p-1">
          {categories.map((cat) => (
            <button
              key={cat.key}
              onClick={() => setCategory(cat.key)}
              className={`rounded-md px-3 py-1.5 text-xs font-medium transition-base ${
                category === cat.key
                  ? 'bg-primary text-primary-foreground shadow-theme-sm'
                  : 'text-muted-foreground hover:bg-muted hover:text-foreground'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>
        <div className="flex items-center gap-1.5 rounded-lg border border-border bg-card p-1">
          {difficulties.map((d) => (
            <button
              key={d.key}
              onClick={() => setDifficulty(d.key)}
              className={`rounded-md px-3 py-1.5 text-xs font-medium transition-base ${
                difficulty === d.key
                  ? 'bg-primary text-primary-foreground shadow-theme-sm'
                  : 'text-muted-foreground hover:bg-muted hover:text-foreground'
              }`}
            >
              {d.label}
            </button>
          ))}
        </div>
      </div>

      {/* Course Grid */}
      {filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <BookOpen className="h-12 w-12 text-muted-foreground/30 mb-3" />
          <p className="text-sm text-muted-foreground">{t.common.noResults}</p>
        </div>
      ) : (
        <div className="grid grid-cols-3 gap-5">
          {filtered.map((course) => {
            const diffLabel = t.courses[course.difficulty as keyof typeof t.courses] || course.difficulty;
            return (
              <Card
                key={course.id}
                className="group overflow-hidden border-border bg-card shadow-theme-sm transition-base hover:shadow-theme-lg hover:border-secondary/30"
              >
                {/* Cover */}
                <div className={`relative flex h-36 items-center justify-center bg-gradient-to-br ${course.color}`}>
                  <span className="text-5xl transition-base group-hover:scale-110">{course.image}</span>
                  <div className="absolute bottom-3 right-3">
                    <span className={`rounded-full px-2.5 py-1 text-[10px] font-semibold ${difficultyColors[course.difficulty]}`}>
                      {diffLabel}
                    </span>
                  </div>
                </div>
                <CardContent className="p-4">
                  <h3 className="text-sm font-bold text-foreground leading-snug">
                    {locale === 'es' ? course.title.es : course.title.en}
                  </h3>
                  <p className="mt-1.5 text-xs text-muted-foreground line-clamp-2 leading-relaxed">
                    {locale === 'es' ? course.description.es : course.description.en}
                  </p>
                  <div className="mt-3 flex items-center gap-3 text-[11px] text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <Clock className="h-3 w-3" /> {course.duration}
                    </span>
                    <span className="flex items-center gap-1">
                      <Signal className="h-3 w-3" /> {course.lessons} {t.courses.lessons}
                    </span>
                    <span className="flex items-center gap-1">
                      <Users className="h-3 w-3" /> {course.enrolled}
                    </span>
                  </div>
                  <div className="mt-3 flex items-center justify-between">
                    <div className="flex items-center gap-1.5 rounded-full bg-gradient-steam px-2.5 py-1">
                      <Coins className="h-3 w-3 text-steam-foreground" />
                      <span className="text-[11px] font-bold text-steam-foreground">
                        +{course.steamReward} STEAM
                      </span>
                    </div>
                    <Link
                      to={`/courses/${course.id}`}
                      className="rounded-lg bg-gradient-accent px-3.5 py-1.5 text-xs font-semibold text-accent-foreground transition-base hover:opacity-90 hover:shadow-glow"
                    >
                      {t.courses.enroll}
                    </Link>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
