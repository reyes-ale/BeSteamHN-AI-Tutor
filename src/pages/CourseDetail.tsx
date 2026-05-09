import React, { useMemo, useState } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { useI18n } from '@/lib/i18n';
import { useAuth } from '@/lib/auth';
import {
  ArrowLeft,
  Bot,
  CheckCircle2,
  Circle,
  Clock,
  Coins,
  FileVideo,
  Gamepad2,
  PlayCircle,
  Presentation,
  Puzzle,
  Signal,
  Pencil,
  Trash2,
  Users,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import {
  canManageCourse,
  getCompletedModuleCount,
  getCourseById,
  getCourseModuleCount,
  getProgressForCourse,
  getProgressPercent,
  deleteSharedCourse,
  saveProgressForCourse,
} from '@/lib/courseProgress';
import type { CourseModule } from '@/lib/mockData';

export default function CourseDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { t, locale } = useI18n();
  const { user } = useAuth();
  const course = id ? getCourseById(id) : undefined;
  const [progress, setProgress] = useState(() => (id ? getProgressForCourse(id) : null));
  const [enrolled, setEnrolled] = useState(() => !!progress && (progress.completedModules.length > 0 || progress.gameCompleted));
  const [gameAnswer, setGameAnswer] = useState('');
  const [gameMessage, setGameMessage] = useState('');

  const modules = useMemo(() => {
    if (!course) return [] as CourseModule[];
    if (course.modules?.length) return course.modules;

    return Array.from<CourseModule>({ length: course.lessons }, (_, i) => ({
      id: `lesson-${i + 1}`,
      type: 'lesson' as const,
      title: {
        en: `Lesson ${i + 1}: ${['Introduction', 'Core Concepts', 'Practice', 'Variables', 'Functions', 'Loops', 'Conditionals', 'Arrays', 'Objects', 'Project', 'Review', 'Exam'][i] || `Topic ${i + 1}`}`,
        es: `Leccion ${i + 1}: ${['Introduccion', 'Conceptos Basicos', 'Practica', 'Variables', 'Funciones', 'Bucles', 'Condicionales', 'Arrays', 'Objetos', 'Proyecto', 'Revision', 'Examen'][i] || `Tema ${i + 1}`}`,
      },
      description: {
        en: 'Complete this activity and mark it as done.',
        es: 'Completa esta actividad y marcala como lista.',
      },
    }));
  }, [course]);

  if (!course) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <p className="text-lg text-muted-foreground">{t.common.noResults}</p>
        <Link to="/courses" className="mt-4 text-sm text-secondary hover:underline">
          {t.common.back}
        </Link>
      </div>
    );
  }

  const title = locale === 'es' ? course.title.es : course.title.en;
  const desc = locale === 'es' ? course.description.es : course.description.en;
  const diffLabel = t.courses[course.difficulty as keyof typeof t.courses] || course.difficulty;
  const canEdit = canManageCourse(course, user);

  const totalModules = getCourseModuleCount(course);
  const completedCount = progress ? getCompletedModuleCount(course, progress) : 0;
  const progressPct = progress ? getProgressPercent(course, progress) : 0;
  const currentModule = modules.find((module) => !progress?.completedModules.includes(module.id)) ?? modules[0];

  const completeModule = (moduleId: string) => {
    if (!progress || progress.completedModules.includes(moduleId)) return;

    const completedModules = [...progress.completedModules, moduleId];
    const next = {
      ...progress,
      completedModules,
      completedAt: completedModules.length >= totalModules && progress.gameCompleted ? new Date().toISOString() : progress.completedAt,
    };

    setProgress(next);
    saveProgressForCourse(next);
    setEnrolled(true);
  };

  const completeGame = () => {
    if (!progress || !course.game) return;

    if (gameAnswer.trim().toLowerCase() !== course.game.answer.trim().toLowerCase()) {
      setGameMessage(locale === 'es' ? 'Intenta otra vez. Revisa la pista y ajusta tu respuesta.' : 'Try again. Read the clue and adjust your answer.');
      return;
    }

    const next = {
      ...progress,
      gameCompleted: true,
      completedAt: progress.completedModules.length >= totalModules ? new Date().toISOString() : progress.completedAt,
    };
    setProgress(next);
    saveProgressForCourse(next);
    setGameMessage(locale === 'es' ? 'Reto completado. Tu perfil ya refleja este avance.' : 'Challenge completed. Your profile now reflects this progress.');
    setEnrolled(true);
  };

  const removeCourse = async () => {
    const confirmed = window.confirm(locale === 'es' ? `Eliminar "${title}"?` : `Delete "${title}"?`);
    if (!confirmed) return;

    await deleteSharedCourse(course);
    navigate('/courses');
  };

  return (
    <div className="space-y-6">
      <Link to="/courses" className="inline-flex items-center gap-1.5 text-sm font-medium text-muted-foreground transition-base hover:text-foreground">
        <ArrowLeft className="h-4 w-4" /> {t.common.back}
      </Link>

      <div className="grid grid-cols-3 gap-6">
        <div className="col-span-2 space-y-4">
          <div className={`flex h-48 items-center justify-center rounded-2xl bg-gradient-to-br ${course.color}`}>
            {course.bannerUrl ? (
              <img src={course.bannerUrl} alt={title} className="h-full w-full rounded-2xl object-cover" />
            ) : (
              <span className="text-7xl font-black text-white">{course.image}</span>
            )}
          </div>
          <div>
            <h1 className="text-2xl font-bold text-foreground">{title}</h1>
            <p className="mt-2 text-sm text-muted-foreground leading-relaxed">{desc}</p>
          </div>
          <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
            <span className="flex items-center gap-1.5"><Clock className="h-4 w-4" /> {course.duration}</span>
            <span className="flex items-center gap-1.5"><Signal className="h-4 w-4" /> {diffLabel}</span>
            <span className="flex items-center gap-1.5"><Users className="h-4 w-4" /> {course.enrolled} {t.courses.students}</span>
            <span className="flex items-center gap-1.5 text-steam"><Coins className="h-4 w-4" /> +{course.steamReward} STEAM</span>
          </div>

          {enrolled && (
            <div>
              <div className="mb-2 flex items-center justify-between">
                <span className="text-xs font-medium text-muted-foreground">{t.courses.progress}</span>
                <span className="text-xs font-semibold text-foreground">{progressPct}%</span>
              </div>
              <Progress value={progressPct} className="h-2.5" />
            </div>
          )}

          <div className="flex flex-wrap items-center gap-3">
            {!enrolled && (
              <button onClick={() => setEnrolled(true)} className="rounded-lg bg-gradient-accent px-6 py-2.5 text-sm font-bold text-accent-foreground shadow-theme-md transition-base hover:opacity-90 hover:shadow-glow">
                {t.courses.enroll}
              </button>
            )}
            {canEdit && (
              <Link to={`/courses/${course.id}/edit`} className="inline-flex items-center gap-2 rounded-lg border border-violet-200 bg-violet-50 px-4 py-2 text-sm font-semibold text-violet-700 transition-base hover:bg-violet-100">
                <Pencil className="h-4 w-4" />
                {locale === 'es' ? 'Editar curso' : 'Edit course'}
              </Link>
            )}
            {canEdit && (
              <button onClick={removeCourse} className="inline-flex items-center gap-2 rounded-lg border border-red-200 bg-red-50 px-4 py-2 text-sm font-semibold text-red-600 transition-base hover:bg-red-100">
                <Trash2 className="h-4 w-4" />
                {locale === 'es' ? 'Eliminar curso' : 'Delete course'}
              </button>
            )}
          </div>
        </div>

        <Card className="border-border bg-card shadow-theme-sm h-fit sticky top-24">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-semibold text-foreground">
              {t.courses.lessons} ({completedCount}/{totalModules})
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-1 max-h-[400px] overflow-y-auto">
            {modules.map((lesson) => {
              const isCompleted = !!progress?.completedModules.includes(lesson.id);
              const isCurrent = currentModule.id === lesson.id && !isCompleted;
              const Icon = lesson.type === 'video' ? FileVideo : lesson.type === 'presentation' ? Presentation : lesson.type === 'game' ? Gamepad2 : Circle;

              return (
                <div key={lesson.id} className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-xs transition-base ${isCurrent ? 'bg-secondary/10 border border-secondary/20 text-foreground font-semibold' : isCompleted ? 'text-muted-foreground' : 'text-muted-foreground/70'}`}>
                  {isCompleted ? <CheckCircle2 className="h-4 w-4 text-success shrink-0" /> : isCurrent ? <PlayCircle className="h-4 w-4 text-secondary shrink-0" /> : <Icon className="h-4 w-4 shrink-0" />}
                  <span className="truncate">{locale === 'es' ? lesson.title.es : lesson.title.en}</span>
                </div>
              );
            })}
          </CardContent>
        </Card>
      </div>

      {enrolled && (
        <Card className="border-border bg-card shadow-theme-sm">
          <CardContent className="p-8">
            <div className="mb-4 flex items-center gap-3">
              <PlayCircle className="h-5 w-5 text-secondary" />
              <h2 className="text-lg font-bold text-foreground">{locale === 'es' ? currentModule.title.es : currentModule.title.en}</h2>
            </div>
            <div className="prose prose-sm max-w-none text-muted-foreground">
              <p>{locale === 'es' ? currentModule.description.es : currentModule.description.en}</p>
              {currentModule.content && <p className="mt-3">{currentModule.content}</p>}
              {currentModule.fileName && (
                <p className="mt-3 rounded-lg bg-muted px-3 py-2 text-xs font-semibold text-foreground">
                  {locale === 'es' ? 'Archivo adjunto: ' : 'Attached file: '}{currentModule.fileName}
                </p>
              )}
            </div>
            <div className="mt-6 flex items-center gap-3">
              <button onClick={() => completeModule(currentModule.id)} className="rounded-lg bg-gradient-accent px-4 py-2 text-sm font-semibold text-accent-foreground transition-base hover:opacity-90">
                {progress?.completedModules.includes(currentModule.id) ? t.common.completed : locale === 'es' ? 'Completar bloque' : 'Complete block'}
              </button>
              <button className="flex items-center gap-2 rounded-lg border border-border bg-card px-4 py-2 text-sm font-medium text-foreground transition-base hover:bg-muted">
                <Bot className="h-4 w-4 text-secondary" />
                {t.aiTutor.askQuestion}
              </button>
            </div>
          </CardContent>
        </Card>
      )}

      {enrolled && course.game && (
        <Card className="border-amber-200 bg-amber-50 shadow-theme-sm">
          <CardContent className="p-6">
            <div className="flex items-start justify-between gap-4">
              <div>
                <div className="flex items-center gap-2">
                  <Puzzle className="h-5 w-5 text-amber-600" />
                  <h2 className="text-lg font-bold text-amber-950">{locale === 'es' ? course.game.title.es : course.game.title.en}</h2>
                </div>
                <p className="mt-2 text-sm text-amber-900">{locale === 'es' ? course.game.prompt.es : course.game.prompt.en}</p>
                <p className="mt-1 text-xs font-semibold text-amber-700">+{course.game.reward} STEAM</p>
              </div>
              {progress?.gameCompleted && <CheckCircle2 className="h-6 w-6 text-success" />}
            </div>
            <div className="mt-4 flex flex-wrap items-center gap-3">
              <input value={gameAnswer} onChange={(event) => setGameAnswer(event.target.value)} disabled={progress?.gameCompleted} className="min-w-64 rounded-xl border border-amber-200 bg-white px-3.5 py-2 text-sm outline-none focus:ring-2 focus:ring-amber-300 disabled:opacity-60" placeholder={locale === 'es' ? 'Tu respuesta' : 'Your answer'} />
              <button onClick={completeGame} disabled={progress?.gameCompleted} className="rounded-xl bg-amber-500 px-4 py-2 text-sm font-bold text-white transition-all hover:bg-amber-600 disabled:opacity-60">
                {progress?.gameCompleted ? t.common.completed : locale === 'es' ? 'Resolver reto' : 'Solve challenge'}
              </button>
              {gameMessage && <span className="text-xs font-semibold text-amber-800">{gameMessage}</span>}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
