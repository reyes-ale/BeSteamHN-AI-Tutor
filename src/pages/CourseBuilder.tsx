import React, { useMemo, useState } from 'react';
import { Navigate, useNavigate, useParams } from 'react-router-dom';
import { useI18n } from '@/lib/i18n';
import { useAuth } from '@/lib/auth';
import { canManageCourse, getCourseById, saveSharedCourse } from '@/lib/courseProgress';
import type { Course, CourseModule, CourseModuleType } from '@/lib/mockData';
import { GAME_CONFIGS, type GameId } from '@/types/games';
import { addNotification } from '@/lib/notifications';
import { ArrowLeft, ChevronDown, ChevronUp, FileVideo, Gamepad2, Plus, Presentation, Save, Trash2 } from 'lucide-react';

const moduleTypes: { type: CourseModuleType; labelEs: string; labelEn: string }[] = [
  { type: 'lesson', labelEs: 'Leccion', labelEn: 'Lesson' },
  { type: 'video', labelEs: 'Video', labelEn: 'Video' },
  { type: 'presentation', labelEs: 'Presentacion', labelEn: 'Presentation' },
  { type: 'quiz', labelEs: 'Prueba', labelEn: 'Quiz' },
  { type: 'game', labelEs: 'Juego', labelEn: 'Game' },
];

function makeModule(type: CourseModuleType, order: number): CourseModule {
  return {
    id: `module-${Date.now()}-${order}`,
    type,
    title: { en: `${type} ${order}`, es: `${type} ${order}` },
    description: { en: '', es: '' },
    content: '',
  };
}

function modulesFromCourse(course?: Course): CourseModule[] {
  if (!course) return [makeModule('lesson', 1), makeModule('quiz', 2), makeModule('game', 3)];
  if (course.modules?.length) return course.modules;

  return Array.from<CourseModule>({ length: course.lessons }, (_, index) => ({
    id: `lesson-${index + 1}`,
    type: 'lesson',
    title: {
      en: `Lesson ${index + 1}`,
      es: `Leccion ${index + 1}`,
    },
    description: {
      en: course.description.en,
      es: course.description.es,
    },
    content: '',
  }));
}

export default function CourseBuilder() {
  const { locale } = useI18n();
  const { user } = useAuth();
  const navigate = useNavigate();
  const { id } = useParams();
  const existingCourse = id ? getCourseById(id) : undefined;
  const [title, setTitle] = useState(() => (existingCourse ? (locale === 'es' ? existingCourse.title.es : existingCourse.title.en) : ''));
  const [description, setDescription] = useState(() => (existingCourse ? (locale === 'es' ? existingCourse.description.es : existingCourse.description.en) : ''));
  const [category, setCategory] = useState<Course['category']>(() => existingCourse?.category ?? 'programming');
  const [difficulty, setDifficulty] = useState<Course['difficulty']>(() => existingCourse?.difficulty ?? 'beginner');
  const [reward, setReward] = useState(() => existingCourse?.steamReward ?? 50);
  const [bannerLabel, setBannerLabel] = useState(() => existingCourse?.image ?? 'BT');
  const [bannerColor, setBannerColor] = useState(() => existingCourse?.color ?? 'from-teal-500 to-cyan-600');
  const [bannerUrl, setBannerUrl] = useState(() => existingCourse?.bannerUrl ?? '');
  const [modules, setModules] = useState<CourseModule[]>(() => modulesFromCourse(existingCourse));
  const [gamePrompt, setGamePrompt] = useState(() => {
    if (existingCourse?.game) return locale === 'es' ? existingCourse.game.prompt.es : existingCourse.game.prompt.en;
    return locale === 'es' ? 'Escribe la palabra clave correcta para completar el reto.' : 'Type the correct keyword to complete the challenge.';
  });
  const [gameAnswer, setGameAnswer] = useState(() => existingCourse?.game?.answer ?? 'steam');
  const [assignedGameId, setAssignedGameId] = useState<GameId>(() => existingCourse?.game?.gameId ?? 'quiz-battle');

  const canCreate = user?.role === 'educator' || user?.role === 'admin';
  const canEditExisting = !existingCourse || canManageCourse(existingCourse, user);
  const totalLessons = useMemo(() => Math.max(1, modules.length), [modules.length]);

  if (!canCreate || !canEditExisting) return <Navigate to="/courses" replace />;

  const updateModule = (moduleId: string, patch: Partial<CourseModule>) => {
    setModules((current) => current.map((module) => (module.id === moduleId ? { ...module, ...patch } : module)));
  };

  const moveModule = (moduleId: string, direction: -1 | 1) => {
    setModules((current) => {
      const index = current.findIndex((module) => module.id === moduleId);
      const target = index + direction;
      if (index < 0 || target < 0 || target >= current.length) return current;

      const next = [...current];
      [next[index], next[target]] = [next[target], next[index]];
      return next;
    });
  };

  const insertModuleAfter = (index: number, type: CourseModuleType) => {
    setModules((current) => {
      const next = [...current];
      next.splice(index + 1, 0, makeModule(type, current.length + 1));
      return next;
    });
  };

  const loadBannerFile = (file?: File) => {
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => setBannerUrl(String(reader.result ?? ''));
    reader.readAsDataURL(file);
  };

  const saveCourse = async () => {
    const courseTitle = title.trim() || (locale === 'es' ? 'Curso sin titulo' : 'Untitled course');
    const course: Course = {
      id: existingCourse?.id ?? `custom-${Date.now()}`,
      title: { en: courseTitle, es: courseTitle },
      description: { en: description, es: description },
      category,
      difficulty,
      lessons: totalLessons,
      duration: existingCourse?.duration ?? `${Math.max(1, Math.ceil(totalLessons / 2))} weeks`,
      steamReward: reward,
      enrolled: existingCourse?.enrolled ?? 0,
      image: bannerLabel.trim() || 'BT',
      color: bannerColor,
      bannerUrl: bannerUrl || undefined,
      educatorId: existingCourse?.educatorId ?? user?.id,
      educatorName: existingCourse?.educatorName ?? user?.name,
      modules,
      game: {
        title: { en: GAME_CONFIGS[assignedGameId].name, es: GAME_CONFIGS[assignedGameId].name },
        prompt: { en: gamePrompt, es: gamePrompt },
        answer: gameAnswer.trim().toLowerCase(),
        reward: GAME_CONFIGS[assignedGameId].xpReward,
        gameId: assignedGameId,
      },
    };

    await saveSharedCourse(course);
    addNotification({
      type: 'course',
      title: existingCourse
        ? locale === 'es' ? 'Curso actualizado' : 'Course updated'
        : locale === 'es' ? 'Curso creado' : 'Course created',
      description: courseTitle,
      href: `/courses/${course.id}`,
    });
    navigate(`/courses/${course.id}`);
  };

  return (
    <div className="space-y-6">
      <button
        onClick={() => navigate('/courses')}
        className="inline-flex items-center gap-2 text-sm font-semibold text-gray-500 transition-colors hover:text-gray-900"
      >
        <ArrowLeft className="h-4 w-4" />
        {locale === 'es' ? 'Volver a cursos' : 'Back to courses'}
      </button>

      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            {existingCourse
              ? locale === 'es' ? 'Editar curso' : 'Edit course'
              : locale === 'es' ? 'Crear curso editable' : 'Create editable course'}
          </h1>
          <p className="mt-1 max-w-2xl text-sm text-gray-500">
            {locale === 'es'
              ? 'Arma el curso por bloques. Puedes insertar pruebas, videos, presentaciones o juegos en cualquier punto.'
              : 'Build the course with blocks. Insert quizzes, videos, presentations, or games anywhere.'}
          </p>
        </div>
        <button
          onClick={saveCourse}
          className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-violet-500 to-indigo-600 px-5 py-2.5 text-sm font-bold text-white shadow-lg shadow-violet-200/60 transition-all hover:scale-105 hover:opacity-90"
        >
          <Save className="h-4 w-4" />
          {locale === 'es' ? 'Guardar curso' : 'Save course'}
        </button>
      </div>

      <div className="grid grid-cols-3 gap-5">
        <section className="col-span-1 space-y-4 rounded-2xl border border-white/60 bg-white/70 p-5 shadow-sm backdrop-blur-sm">
          <h2 className="text-sm font-bold text-gray-900">{locale === 'es' ? 'Datos generales' : 'Course details'}</h2>
          <label className="block text-xs font-bold text-gray-600">
            {locale === 'es' ? 'Titulo' : 'Title'}
            <input value={title} onChange={(event) => setTitle(event.target.value)} className="mt-1.5 w-full rounded-xl border border-white/60 bg-white px-3.5 py-2.5 text-sm outline-none focus:ring-2 focus:ring-violet-300" />
          </label>
          <label className="block text-xs font-bold text-gray-600">
            {locale === 'es' ? 'Descripcion' : 'Description'}
            <textarea value={description} onChange={(event) => setDescription(event.target.value)} className="mt-1.5 h-24 w-full resize-none rounded-xl border border-white/60 bg-white px-3.5 py-2.5 text-sm outline-none focus:ring-2 focus:ring-violet-300" />
          </label>
          <div className="grid grid-cols-2 gap-3">
            <label className="block text-xs font-bold text-gray-600">
              {locale === 'es' ? 'Categoria' : 'Category'}
              <select value={category} onChange={(event) => setCategory(event.target.value as Course['category'])} className="mt-1.5 w-full rounded-xl border border-white/60 bg-white px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-violet-300">
                <option value="programming">Programacion</option>
                <option value="softSkills">Habilidades</option>
                <option value="design">Diseno</option>
                <option value="robotics">Robotica</option>
              </select>
            </label>
            <label className="block text-xs font-bold text-gray-600">
              {locale === 'es' ? 'Nivel' : 'Level'}
              <select value={difficulty} onChange={(event) => setDifficulty(event.target.value as Course['difficulty'])} className="mt-1.5 w-full rounded-xl border border-white/60 bg-white px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-violet-300">
                <option value="beginner">Principiante</option>
                <option value="intermediate">Intermedio</option>
                <option value="advanced">Avanzado</option>
              </select>
            </label>
          </div>
          <label className="block text-xs font-bold text-gray-600">
            Recompensa STEAM
            <input type="number" value={reward} onChange={(event) => setReward(Number(event.target.value))} className="mt-1.5 w-full rounded-xl border border-white/60 bg-white px-3.5 py-2.5 text-sm outline-none focus:ring-2 focus:ring-violet-300" />
          </label>
          <div className="space-y-3 rounded-2xl border border-white/60 bg-white/60 p-3">
            <p className="text-xs font-bold text-gray-600">{locale === 'es' ? 'Banner del curso' : 'Course banner'}</p>
            <div className={`flex h-28 items-center justify-center overflow-hidden rounded-xl bg-gradient-to-br ${bannerColor}`}>
              {bannerUrl ? (
                <img src={bannerUrl} alt={title || 'Banner'} className="h-full w-full object-cover" />
              ) : (
                <span className="text-4xl font-black text-white drop-shadow">{bannerLabel}</span>
              )}
            </div>
            <label className="block text-xs font-bold text-gray-600">
              {locale === 'es' ? 'Texto del banner' : 'Banner text'}
              <input value={bannerLabel} onChange={(event) => setBannerLabel(event.target.value)} maxLength={4} className="mt-1.5 w-full rounded-xl border border-white/60 bg-white px-3.5 py-2.5 text-sm outline-none focus:ring-2 focus:ring-violet-300" />
            </label>
            <label className="block text-xs font-bold text-gray-600">
              {locale === 'es' ? 'Color' : 'Color'}
              <select value={bannerColor} onChange={(event) => setBannerColor(event.target.value)} className="mt-1.5 w-full rounded-xl border border-white/60 bg-white px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-violet-300">
                <option value="from-blue-500 to-cyan-500">Azul</option>
                <option value="from-emerald-500 to-teal-500">Verde</option>
                <option value="from-pink-500 to-rose-500">Rosa</option>
                <option value="from-orange-500 to-amber-500">Naranja</option>
                <option value="from-violet-500 to-indigo-600">Violeta</option>
                <option value="from-slate-700 to-gray-900">Oscuro</option>
              </select>
            </label>
            <input
              type="file"
              accept="image/*"
              onChange={(event) => loadBannerFile(event.target.files?.[0])}
              className="block w-full rounded-xl border border-dashed border-violet-200 bg-violet-50/60 px-3 py-2 text-xs text-gray-600 file:mr-3 file:rounded-lg file:border-0 file:bg-violet-600 file:px-3 file:py-1.5 file:text-xs file:font-bold file:text-white"
            />
            {bannerUrl && (
              <button type="button" onClick={() => setBannerUrl('')} className="text-xs font-bold text-red-500 hover:text-red-700">
                {locale === 'es' ? 'Quitar imagen' : 'Remove image'}
              </button>
            )}
          </div>
        </section>

        <section className="col-span-2 space-y-4">
          {modules.map((module, index) => (
            <div key={module.id} className="rounded-2xl border border-white/60 bg-white/70 p-4 shadow-sm backdrop-blur-sm">
              <div className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-violet-100 text-violet-700">
                    {module.type === 'video' ? <FileVideo className="h-5 w-5" /> : module.type === 'presentation' ? <Presentation className="h-5 w-5" /> : <Gamepad2 className="h-5 w-5" />}
                  </div>
                  <div>
                    <p className="text-xs font-bold uppercase tracking-wide text-gray-400">{index + 1}. {module.type}</p>
                    <input
                      value={locale === 'es' ? module.title.es : module.title.en}
                      onChange={(event) => updateModule(module.id, { title: { en: event.target.value, es: event.target.value } })}
                      className="mt-1 w-full rounded-lg border border-transparent bg-transparent text-sm font-bold text-gray-900 outline-none focus:border-violet-200 focus:bg-white focus:px-2"
                    />
                  </div>
                </div>
                <div className="flex items-center gap-1">
                  <button onClick={() => moveModule(module.id, -1)} className="flex h-8 w-8 items-center justify-center rounded-lg text-gray-500 hover:bg-white"><ChevronUp className="h-4 w-4" /></button>
                  <button onClick={() => moveModule(module.id, 1)} className="flex h-8 w-8 items-center justify-center rounded-lg text-gray-500 hover:bg-white"><ChevronDown className="h-4 w-4" /></button>
                  <button onClick={() => setModules((current) => current.filter((item) => item.id !== module.id))} className="flex h-8 w-8 items-center justify-center rounded-lg text-gray-500 hover:bg-red-50 hover:text-red-500"><Trash2 className="h-4 w-4" /></button>
                </div>
              </div>

              <textarea
                value={module.description.es}
                onChange={(event) => updateModule(module.id, { description: { en: event.target.value, es: event.target.value } })}
                placeholder={locale === 'es' ? 'Descripcion o instrucciones del bloque' : 'Block description or instructions'}
                className="mt-3 h-20 w-full resize-none rounded-xl border border-white/60 bg-white/80 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-violet-300"
              />
              {(module.type === 'video' || module.type === 'presentation') && (
                <input
                  type="file"
                  accept={module.type === 'video' ? 'video/*' : '.pdf,.ppt,.pptx,application/pdf'}
                  onChange={(event) => updateModule(module.id, { fileName: event.target.files?.[0]?.name })}
                  className="mt-3 block w-full rounded-xl border border-dashed border-violet-200 bg-violet-50/60 px-3 py-2 text-xs text-gray-600 file:mr-3 file:rounded-lg file:border-0 file:bg-violet-600 file:px-3 file:py-1.5 file:text-xs file:font-bold file:text-white"
                />
              )}
              <div className="mt-3 flex flex-wrap items-center gap-2 border-t border-white/60 pt-3">
                <span className="text-xs font-semibold text-gray-400">{locale === 'es' ? 'Insertar despues:' : 'Insert after:'}</span>
                {moduleTypes.map((option) => (
                  <button key={option.type} onClick={() => insertModuleAfter(index, option.type)} className="inline-flex items-center gap-1 rounded-lg bg-white px-2.5 py-1.5 text-[11px] font-bold text-gray-600 shadow-sm hover:text-violet-700">
                    <Plus className="h-3 w-3" />
                    {locale === 'es' ? option.labelEs : option.labelEn}
                  </button>
                ))}
              </div>
            </div>
          ))}

          <div className="rounded-2xl border border-amber-200 bg-amber-50/80 p-4">
            <h2 className="flex items-center gap-2 text-sm font-bold text-amber-900"><Gamepad2 className="h-4 w-4" />{locale === 'es' ? 'Juego del curso' : 'Course game'}</h2>
            <div className="mt-3 grid grid-cols-3 gap-3">
              <select value={assignedGameId} onChange={(event) => setAssignedGameId(event.target.value as GameId)} className="rounded-xl border border-amber-100 bg-white px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-amber-300">
                {Object.values(GAME_CONFIGS).map((game) => (
                  <option key={game.id} value={game.id}>
                    {game.emoji} {game.name}
                  </option>
                ))}
              </select>
              <input value={gamePrompt} onChange={(event) => setGamePrompt(event.target.value)} className="rounded-xl border border-amber-100 bg-white px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-amber-300" />
              <input value={gameAnswer} onChange={(event) => setGameAnswer(event.target.value)} className="rounded-xl border border-amber-100 bg-white px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-amber-300" placeholder={locale === 'es' ? 'Respuesta correcta' : 'Correct answer'} />
            </div>
            <p className="mt-2 text-xs font-semibold text-amber-700">
              {GAME_CONFIGS[assignedGameId].description} · +{GAME_CONFIGS[assignedGameId].xpReward} XP
            </p>
          </div>
        </section>
      </div>
    </div>
  );
}
