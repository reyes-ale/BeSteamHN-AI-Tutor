import React, { useEffect, useMemo, useState } from 'react';
import { useI18n } from '@/lib/i18n';
import { Link } from 'react-router-dom';
import { Search, Clock, Signal, Coins, Users, BookOpen, SlidersHorizontal, Plus, Presentation, Gamepad2, Pencil, Trash2 } from 'lucide-react';
import { useAuth } from '@/lib/auth';
import { canManageCourse, deleteSharedCourse, getAllCourses, getAllCoursesAsync } from '@/lib/courseProgress';
import type { Course } from '@/lib/mockData';

type Category = 'all' | 'programming' | 'softSkills' | 'design' | 'robotics';
type Difficulty = 'all' | 'beginner' | 'intermediate' | 'advanced';

const categoryMeta: Record<string, { emoji: string; gradient: string; activeBg: string; activeText: string }> = {
  all:         { emoji: '✨', gradient: 'from-violet-400 to-indigo-500', activeBg: 'bg-violet-500',  activeText: 'text-white' },
  programming: { emoji: '💻', gradient: 'from-blue-400 to-indigo-500',  activeBg: 'bg-blue-500',    activeText: 'text-white' },
  softSkills:  { emoji: '🤝', gradient: 'from-emerald-400 to-teal-500', activeBg: 'bg-emerald-500', activeText: 'text-white' },
  design:      { emoji: '🎨', gradient: 'from-pink-400 to-rose-500',    activeBg: 'bg-pink-500',    activeText: 'text-white' },
  robotics:    { emoji: '🤖', gradient: 'from-orange-400 to-amber-500', activeBg: 'bg-orange-500',  activeText: 'text-white' },
};

const difficultyMeta: Record<string, { label: string; bg: string; text: string; dot: string }> = {
  beginner:     { label: '',    bg: 'bg-emerald-100', text: 'text-emerald-700', dot: 'bg-emerald-400' },
  intermediate: { label: '',    bg: 'bg-amber-100',   text: 'text-amber-700',   dot: 'bg-amber-400'   },
  advanced:     { label: '',    bg: 'bg-rose-100',     text: 'text-rose-700',    dot: 'bg-rose-400'    },
};

export default function Courses() {
  const { t, locale } = useI18n();
  const { user } = useAuth();
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState<Category>('all');
  const [difficulty, setDifficulty] = useState<Difficulty>('all');
  const canCreateCourses = user?.role === 'educator' || user?.role === 'admin';
  const [allCourses, setAllCourses] = useState<Course[]>(() => getAllCourses());

  useEffect(() => {
    let mounted = true;
    getAllCoursesAsync().then((loadedCourses) => {
      if (mounted) setAllCourses(loadedCourses);
    });
    return () => {
      mounted = false;
    };
  }, []);

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

  const filtered = useMemo(() => {
    return allCourses.filter((c) => {
      const title = locale === 'es' ? c.title.es : c.title.en;
      const matchesSearch = title.toLowerCase().includes(search.toLowerCase());
      const matchesCategory = category === 'all' || c.category === category;
      const matchesDifficulty = difficulty === 'all' || c.difficulty === difficulty;
      return matchesSearch && matchesCategory && matchesDifficulty;
    });
  }, [allCourses, search, category, difficulty, locale]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">{t.courses.catalog}</h1>
          <p className="mt-1 text-sm text-gray-500">{t.courses.catalogDesc}</p>
        </div>
        <div className="flex items-center gap-2">
          {canCreateCourses && (
            <Link
              to="/courses/create"
              className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-violet-500 to-indigo-600 px-4 py-2 text-xs font-bold text-white shadow-md shadow-violet-200/60 transition-all hover:scale-105 hover:opacity-90"
            >
              <Plus className="h-3.5 w-3.5" />
              {locale === 'es' ? 'Crear curso' : 'Create course'}
            </Link>
          )}
          <div className="flex items-center gap-1.5 rounded-xl bg-white/60 border border-white/50 px-3 py-1.5 text-xs font-medium text-gray-600 shadow-sm backdrop-blur-sm">
            <SlidersHorizontal className="h-3.5 w-3.5 text-violet-500" />
            <span>{filtered.length} {locale === 'es' ? 'cursos' : 'courses'}</span>
          </div>
        </div>
      </div>

      {/* Search + Filters */}
      <div className="flex flex-wrap items-center gap-3">
        {/* Search */}
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder={t.common.search}
            className="w-full rounded-xl border border-white/60 bg-white/70 pl-10 pr-4 py-2.5 text-sm text-gray-800 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-violet-300 backdrop-blur-sm transition-base shadow-sm"
          />
        </div>

        {/* Category pills */}
        <div className="flex items-center gap-1.5 rounded-2xl bg-white/60 border border-white/50 p-1.5 shadow-sm backdrop-blur-sm">
          {categories.map((cat) => {
            const meta = categoryMeta[cat.key];
            const isActive = category === cat.key;
            return (
              <button
                key={cat.key}
                onClick={() => setCategory(cat.key)}
                className={`flex items-center gap-1.5 rounded-xl px-3 py-1.5 text-xs font-semibold transition-all duration-200 ${
                  isActive
                    ? `${meta.activeBg} ${meta.activeText} shadow-md`
                    : 'text-gray-500 hover:bg-white/80 hover:text-gray-800'
                }`}
              >
                <span>{meta.emoji}</span>
                {cat.label}
              </button>
            );
          })}
        </div>

        {/* Difficulty pills */}
        <div className="flex items-center gap-1.5 rounded-2xl bg-white/60 border border-white/50 p-1.5 shadow-sm backdrop-blur-sm">
          {difficulties.map((d) => (
            <button
              key={d.key}
              onClick={() => setDifficulty(d.key)}
              className={`rounded-xl px-3 py-1.5 text-xs font-semibold transition-all duration-200 ${
                difficulty === d.key
                  ? 'bg-gray-800 text-white shadow-md'
                  : 'text-gray-500 hover:bg-white/80 hover:text-gray-800'
              }`}
            >
              {d.label}
            </button>
          ))}
        </div>
      </div>

      {/* Course Grid */}
      {filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <div className="flex h-20 w-20 items-center justify-center rounded-3xl bg-gray-100 mb-4">
            <BookOpen className="h-10 w-10 text-gray-300" />
          </div>
          <p className="text-sm font-medium text-gray-500">{t.common.noResults}</p>
        </div>
      ) : (
        <div className="grid grid-cols-3 gap-5">
          {filtered.map((course) => {
            const diffMeta = difficultyMeta[course.difficulty];
            const diffLabel = t.courses[course.difficulty as keyof typeof t.courses] || course.difficulty;
            const canManageThisCourse = canManageCourse(course, user);
            const handleDelete = async () => {
              const confirmed = window.confirm(locale === 'es' ? `Eliminar "${locale === 'es' ? course.title.es : course.title.en}"?` : `Delete "${course.title.en}"?`);
              if (!confirmed) return;
              await deleteSharedCourse(course);
              setAllCourses((current) => current.filter((item) => item.id !== course.id));
            };

            return (
              <div
                key={course.id}
                className="group glass-card rounded-2xl overflow-hidden transition-all duration-300 hover:scale-[1.02] hover:shadow-2xl"
              >
                {/* Cover */}
                  <div className={`relative flex h-40 items-center justify-center bg-gradient-to-br ${course.color} overflow-hidden`}>
                  {course.bannerUrl ? (
                    <img src={course.bannerUrl} alt={locale === 'es' ? course.title.es : course.title.en} className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105" />
                  ) : (
                    <span className="text-6xl font-black text-white transition-transform duration-300 group-hover:scale-110 drop-shadow-lg">
                      {course.image}
                    </span>
                  )}
                  {/* Progress bar placeholder */}
                  <div className="absolute bottom-0 left-0 right-0 h-1 bg-white/20">
                    <div className="h-full w-0 bg-white/60 rounded-full" />
                  </div>
                  {/* Difficulty badge */}
                  <div className={`absolute top-3 right-3 flex items-center gap-1.5 rounded-full ${diffMeta.bg} px-2.5 py-1`}>
                    <span className={`h-1.5 w-1.5 rounded-full ${diffMeta.dot}`} />
                    <span className={`text-[10px] font-semibold ${diffMeta.text}`}>{diffLabel}</span>
                  </div>
                  {canManageThisCourse && (
                    <div className="absolute left-3 top-3 flex items-center gap-1">
                      <Link
                        to={`/courses/${course.id}/edit`}
                        title={locale === 'es' ? 'Editar curso' : 'Edit course'}
                        className="flex h-8 w-8 items-center justify-center rounded-lg bg-white/85 text-gray-700 shadow-sm transition-all hover:bg-white hover:text-violet-700"
                      >
                        <Pencil className="h-4 w-4" />
                      </Link>
                      <button
                        onClick={handleDelete}
                        title={locale === 'es' ? 'Eliminar curso' : 'Delete course'}
                        className="flex h-8 w-8 items-center justify-center rounded-lg bg-white/85 text-gray-700 shadow-sm transition-all hover:bg-red-50 hover:text-red-600"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  )}
                </div>

                <div className="p-4">
                  <h3 className="text-sm font-bold text-gray-900 leading-snug">
                    {locale === 'es' ? course.title.es : course.title.en}
                  </h3>
                  <p className="mt-1.5 text-xs text-gray-500 line-clamp-2 leading-relaxed">
                    {locale === 'es' ? course.description.es : course.description.en}
                  </p>

                  {/* Meta row */}
                  <div className="mt-3 flex items-center gap-3 text-[11px] text-gray-400">
                    <span className="flex items-center gap-1">
                      <Clock className="h-3 w-3" /> {course.duration}
                    </span>
                    <span className="flex items-center gap-1">
                      <Signal className="h-3 w-3" /> {course.lessons} {t.courses.lessons}
                    </span>
                    <span className="flex items-center gap-1">
                      <Users className="h-3 w-3" /> {course.enrolled}
                    </span>
                    {course.modules?.some((module) => module.type === 'presentation' || module.type === 'video') && (
                      <span className="flex items-center gap-1">
                        <Presentation className="h-3 w-3" /> {locale === 'es' ? 'contenido' : 'content'}
                      </span>
                    )}
                    {course.game && (
                      <span className="flex items-center gap-1">
                        <Gamepad2 className="h-3 w-3" /> {locale === 'es' ? 'reto' : 'game'}
                      </span>
                    )}
                  </div>

                  {/* Footer row */}
                  <div className="mt-4 flex items-center justify-between">
                    <div className="flex items-center gap-1.5 rounded-full bg-gradient-to-r from-amber-400 to-orange-400 px-2.5 py-1 shadow-sm shadow-amber-200/60">
                      <Coins className="h-3 w-3 text-white" />
                      <span className="text-[11px] font-bold text-white">+{course.steamReward}</span>
                    </div>
                    <Link
                      to={`/courses/${course.id}`}
                      className="rounded-xl bg-gradient-to-r from-violet-500 to-indigo-600 px-4 py-1.5 text-xs font-bold text-white shadow-md shadow-violet-200/60 transition-all duration-200 hover:opacity-90 hover:scale-105"
                    >
                      {t.courses.enroll}
                    </Link>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
