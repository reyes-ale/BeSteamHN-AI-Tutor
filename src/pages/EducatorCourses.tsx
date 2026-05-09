import React, { useEffect, useMemo, useState } from 'react';
import { Link, Navigate } from 'react-router-dom';
import { useI18n } from '@/lib/i18n';
import { useAuth } from '@/lib/auth';
import { canManageCourse, deleteSharedCourse, getAllCourses, getAllCoursesAsync } from '@/lib/courseProgress';
import type { Course } from '@/lib/mockData';
import { BarChart3, BookOpen, Coins, Eye, Pencil, Plus, Trash2, Users } from 'lucide-react';
import { addNotification } from '@/lib/notifications';

export default function EducatorCourses() {
  const { locale, t } = useI18n();
  const { user } = useAuth();
  const [courses, setCourses] = useState<Course[]>(() => getAllCourses());

  const canUseDashboard = user?.role === 'educator' || user?.role === 'admin';

  useEffect(() => {
    let mounted = true;
    getAllCoursesAsync().then((loadedCourses) => {
      if (mounted) setCourses(loadedCourses);
    });
    return () => {
      mounted = false;
    };
  }, []);

  const managedCourses = useMemo(() => {
    if (!user) return [];
    return courses.filter((course) => canManageCourse(course, user));
  }, [courses, user]);

  if (!canUseDashboard) return <Navigate to="/courses" replace />;

  const stats = [
    {
      label: locale === 'es' ? 'Cursos creados' : 'Created courses',
      value: managedCourses.length,
      icon: BookOpen,
      gradient: 'from-violet-500 to-indigo-600',
    },
    {
      label: locale === 'es' ? 'Lecciones totales' : 'Total lessons',
      value: managedCourses.reduce((total, course) => total + course.lessons, 0),
      icon: BarChart3,
      gradient: 'from-blue-500 to-cyan-500',
    },
    {
      label: locale === 'es' ? 'Estudiantes inscritos' : 'Enrolled students',
      value: managedCourses.reduce((total, course) => total + course.enrolled, 0),
      icon: Users,
      gradient: 'from-emerald-500 to-teal-500',
    },
    {
      label: locale === 'es' ? 'STEAM disponibles' : 'Available STEAM',
      value: managedCourses.reduce((total, course) => total + course.steamReward, 0),
      icon: Coins,
      gradient: 'from-amber-400 to-orange-500',
    },
  ];

  const removeCourse = async (course: Course) => {
    const title = locale === 'es' ? course.title.es : course.title.en;
    const confirmed = window.confirm(locale === 'es' ? `Eliminar "${title}"?` : `Delete "${title}"?`);
    if (!confirmed) return;

    await deleteSharedCourse(course);
    addNotification({
      type: 'course',
      title: locale === 'es' ? 'Curso eliminado' : 'Course deleted',
      description: title,
      href: '/educator/courses',
    });
    setCourses((current) => current.filter((item) => item.id !== course.id));
  };

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            {locale === 'es' ? 'Dashboard de cursos' : 'Course dashboard'}
          </h1>
          <p className="mt-1 text-sm text-gray-500">
            {locale === 'es'
              ? 'Controla los cursos que has creado y entra rapido a sus acciones.'
              : 'Manage the courses you created and jump into key actions quickly.'}
          </p>
        </div>
        <Link
          to="/courses/create"
          className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-violet-500 to-indigo-600 px-5 py-2.5 text-sm font-bold text-white shadow-lg shadow-violet-200/60 transition-all hover:scale-105 hover:opacity-90"
        >
          <Plus className="h-4 w-4" />
          {locale === 'es' ? 'Crear curso' : 'Create course'}
        </Link>
      </div>

      <div className="grid grid-cols-4 gap-4">
        {stats.map((stat) => (
          <div key={stat.label} className="glass-card rounded-2xl p-5">
            <div className={`mb-4 flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br ${stat.gradient} shadow-md`}>
              <stat.icon className="h-5 w-5 text-white" />
            </div>
            <p className="text-3xl font-extrabold text-gray-900">{stat.value}</p>
            <p className="mt-1 text-xs font-medium text-gray-500">{stat.label}</p>
          </div>
        ))}
      </div>

      <div className="glass-card overflow-hidden rounded-2xl">
        <div className="flex items-center justify-between border-b border-white/40 px-5 py-4">
          <h2 className="text-sm font-bold text-gray-900">
            {locale === 'es' ? 'Mis cursos creados' : 'My created courses'}
          </h2>
          <span className="rounded-full bg-violet-100 px-3 py-1 text-xs font-bold text-violet-700">
            {managedCourses.length} {locale === 'es' ? 'cursos' : 'courses'}
          </span>
        </div>

        {managedCourses.length === 0 ? (
          <div className="flex flex-col items-center justify-center px-6 py-16 text-center">
            <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-violet-50">
              <BookOpen className="h-8 w-8 text-violet-300" />
            </div>
            <p className="text-sm font-semibold text-gray-700">
              {locale === 'es' ? 'Todavia no tienes cursos creados.' : 'You have not created any courses yet.'}
            </p>
            <Link to="/courses/create" className="mt-4 rounded-xl bg-violet-600 px-4 py-2 text-xs font-bold text-white hover:bg-violet-700">
              {locale === 'es' ? 'Crear el primero' : 'Create the first one'}
            </Link>
          </div>
        ) : (
          <table className="w-full">
            <thead>
              <tr className="border-b border-white/40 bg-white/30">
                {[locale === 'es' ? 'Curso' : 'Course', locale === 'es' ? 'Categoria' : 'Category', t.courses.lessons, t.courses.students, 'STEAM', locale === 'es' ? 'Acciones' : 'Actions'].map((heading, index) => (
                  <th key={heading} className={`px-5 py-3 text-xs font-bold uppercase tracking-wide text-gray-500 ${index >= 2 ? 'text-center' : 'text-left'} ${index === 5 ? 'text-right' : ''}`}>
                    {heading}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {managedCourses.map((course) => {
                const title = locale === 'es' ? course.title.es : course.title.en;
                return (
                  <tr key={course.id} className="border-b border-white/30 transition-colors hover:bg-white/40">
                    <td className="px-5 py-3.5">
                      <div className="flex items-center gap-3">
                        <div className={`flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden rounded-xl bg-gradient-to-br ${course.color} text-sm font-black text-white shadow-sm`}>
                          {course.bannerUrl ? <img src={course.bannerUrl} alt={title} className="h-full w-full object-cover" /> : course.image}
                        </div>
                        <div className="min-w-0">
                          <p className="truncate text-sm font-semibold text-gray-900">{title}</p>
                          <p className="truncate text-xs text-gray-400">{course.educatorName || user?.name}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-3.5">
                      <span className="rounded-full bg-violet-100 px-2.5 py-0.5 text-[11px] font-semibold capitalize text-violet-700">
                        {course.category}
                      </span>
                    </td>
                    <td className="px-5 py-3.5 text-center text-sm font-semibold text-gray-700">{course.lessons}</td>
                    <td className="px-5 py-3.5 text-center text-sm font-semibold text-gray-700">{course.enrolled}</td>
                    <td className="px-5 py-3.5 text-center">
                      <span className="inline-flex items-center gap-1 rounded-full bg-amber-100 px-2.5 py-1 text-xs font-bold text-amber-700">
                        <Coins className="h-3 w-3" />
                        {course.steamReward}
                      </span>
                    </td>
                    <td className="px-5 py-3.5">
                      <div className="flex justify-end gap-1.5">
                        <Link to={`/courses/${course.id}`} title={locale === 'es' ? 'Ver' : 'View'} className="flex h-8 w-8 items-center justify-center rounded-lg bg-white text-gray-600 shadow-sm hover:text-violet-700">
                          <Eye className="h-4 w-4" />
                        </Link>
                        <Link to={`/courses/${course.id}/edit`} title={locale === 'es' ? 'Editar' : 'Edit'} className="flex h-8 w-8 items-center justify-center rounded-lg bg-white text-gray-600 shadow-sm hover:text-violet-700">
                          <Pencil className="h-4 w-4" />
                        </Link>
                        <button onClick={() => removeCourse(course)} title={locale === 'es' ? 'Eliminar' : 'Delete'} className="flex h-8 w-8 items-center justify-center rounded-lg bg-white text-gray-600 shadow-sm hover:bg-red-50 hover:text-red-600">
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
