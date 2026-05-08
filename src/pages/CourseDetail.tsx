import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useI18n } from '@/lib/i18n';
import {
  ArrowLeft,
  Clock,
  Signal,
  Coins,
  Users,
  CheckCircle2,
  Circle,
  PlayCircle,
  Bot,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { courses } from '@/lib/mockData';

export default function CourseDetail() {
  const { id } = useParams();
  const { t, locale } = useI18n();
  const course = courses.find((c) => c.id === id);
  const [enrolled, setEnrolled] = useState(false);

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

  const fakeLessons = Array.from({ length: course.lessons }, (_, i) => ({
    id: i + 1,
    title:
      locale === 'es'
        ? `Lección ${i + 1}: ${['Introducción', 'Conceptos Básicos', 'Práctica', 'Variables', 'Funciones', 'Bucles', 'Condicionales', 'Arrays', 'Objetos', 'Proyecto', 'Revisión', 'Examen', 'Avanzado', 'Patrones', 'Integración', 'Testing', 'Deploy', 'Final'][i] || `Tema ${i + 1}`}`
        : `Lesson ${i + 1}: ${['Introduction', 'Core Concepts', 'Practice', 'Variables', 'Functions', 'Loops', 'Conditionals', 'Arrays', 'Objects', 'Project', 'Review', 'Exam', 'Advanced', 'Patterns', 'Integration', 'Testing', 'Deploy', 'Final'][i] || `Topic ${i + 1}`}`,
    completed: i < 3 && enrolled,
    current: i === 3 && enrolled,
  }));

  const completedCount = fakeLessons.filter((l) => l.completed).length;
  const progressPct = enrolled ? Math.round((completedCount / course.lessons) * 100) : 0;

  return (
    <div className="space-y-6">
      {/* Back */}
      <Link
        to="/courses"
        className="inline-flex items-center gap-1.5 text-sm font-medium text-muted-foreground transition-base hover:text-foreground"
      >
        <ArrowLeft className="h-4 w-4" /> {t.common.back}
      </Link>

      {/* Course Header */}
      <div className="grid grid-cols-3 gap-6">
        <div className="col-span-2 space-y-4">
          <div className={`flex h-48 items-center justify-center rounded-2xl bg-gradient-to-br ${course.color}`}>
            <span className="text-7xl">{course.image}</span>
          </div>
          <div>
            <h1 className="text-2xl font-bold text-foreground">{title}</h1>
            <p className="mt-2 text-sm text-muted-foreground leading-relaxed">{desc}</p>
          </div>
          <div className="flex items-center gap-4 text-sm text-muted-foreground">
            <span className="flex items-center gap-1.5">
              <Clock className="h-4 w-4" /> {course.duration}
            </span>
            <span className="flex items-center gap-1.5">
              <Signal className="h-4 w-4" /> {diffLabel}
            </span>
            <span className="flex items-center gap-1.5">
              <Users className="h-4 w-4" /> {course.enrolled} {t.courses.students}
            </span>
            <span className="flex items-center gap-1.5 text-steam">
              <Coins className="h-4 w-4" /> +{course.steamReward} STEAM
            </span>
          </div>

          {enrolled && (
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-medium text-muted-foreground">{t.courses.progress}</span>
                <span className="text-xs font-semibold text-foreground">{progressPct}%</span>
              </div>
              <Progress value={progressPct} className="h-2.5" />
            </div>
          )}

          {!enrolled && (
            <button
              onClick={() => setEnrolled(true)}
              className="rounded-lg bg-gradient-accent px-6 py-2.5 text-sm font-bold text-accent-foreground shadow-theme-md transition-base hover:opacity-90 hover:shadow-glow"
            >
              {t.courses.enroll}
            </button>
          )}
        </div>

        {/* Lessons Sidebar */}
        <Card className="border-border bg-card shadow-theme-sm h-fit sticky top-24">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-semibold text-foreground">
              {t.courses.lessons} ({completedCount}/{course.lessons})
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-1 max-h-[400px] overflow-y-auto">
            {fakeLessons.map((lesson) => (
              <div
                key={lesson.id}
                className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-xs transition-base ${
                  lesson.current
                    ? 'bg-secondary/10 border border-secondary/20 text-foreground font-semibold'
                    : lesson.completed
                    ? 'text-muted-foreground'
                    : 'text-muted-foreground/70'
                }`}
              >
                {lesson.completed ? (
                  <CheckCircle2 className="h-4 w-4 text-success shrink-0" />
                ) : lesson.current ? (
                  <PlayCircle className="h-4 w-4 text-secondary shrink-0" />
                ) : (
                  <Circle className="h-4 w-4 shrink-0" />
                )}
                <span className="truncate">{lesson.title}</span>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      {/* Course Content Area (when enrolled) */}
      {enrolled && (
        <Card className="border-border bg-card shadow-theme-sm">
          <CardContent className="p-8">
            <div className="flex items-center gap-3 mb-4">
              <PlayCircle className="h-5 w-5 text-secondary" />
              <h2 className="text-lg font-bold text-foreground">
                {fakeLessons.find((l) => l.current)?.title ||
                  (locale === 'es' ? 'Lección 4: Variables' : 'Lesson 4: Variables')}
              </h2>
            </div>
            <div className="prose prose-sm max-w-none text-muted-foreground">
              <p>
                {locale === 'es'
                  ? 'Las variables son contenedores para almacenar valores de datos. En este lenguaje de programación, puedes crear una variable simplemente asignándole un valor. No necesitas declarar el tipo de la variable, ya que se detecta automáticamente.'
                  : 'Variables are containers for storing data values. In this programming language, you can create a variable simply by assigning a value to it. You don\'t need to declare the variable type, as it is detected automatically.'}
              </p>
              <p className="mt-3">
                {locale === 'es'
                  ? 'Practica creando diferentes tipos de variables: números, texto, listas y diccionarios. Tu Tutor IA puede ayudarte con cualquier pregunta.'
                  : 'Practice creating different types of variables: numbers, text, lists, and dictionaries. Your AI Tutor can help you with any questions.'}
              </p>
            </div>
            <div className="mt-6 flex items-center gap-3">
              <button className="rounded-lg bg-gradient-accent px-4 py-2 text-sm font-semibold text-accent-foreground transition-base hover:opacity-90">
                {t.common.next}
              </button>
              <button className="flex items-center gap-2 rounded-lg border border-border bg-card px-4 py-2 text-sm font-medium text-foreground transition-base hover:bg-muted">
                <Bot className="h-4 w-4 text-secondary" />
                {t.aiTutor.askQuestion}
              </button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
