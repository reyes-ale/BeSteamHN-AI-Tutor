import React, { useState } from 'react';
import { useI18n } from '@/lib/i18n';
import { Users, BookOpen, Coins, Bot, Plus, CheckCircle2, X, Award, BarChart3, TrendingUp } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { courses, adminStudents, workshops } from '@/lib/mockData';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const AVATAR_COLORS = [
  'from-violet-400 to-indigo-500',
  'from-pink-400 to-rose-500',
  'from-emerald-400 to-teal-500',
  'from-amber-400 to-orange-500',
  'from-blue-400 to-cyan-500',
];

export default function Admin() {
  const { t, locale } = useI18n();
  const [showCreateModal, setShowCreateModal] = useState(false);

  const stats = [
    { label: t.admin.totalStudents,      value: '156',    icon: Users,    gradient: 'from-violet-400 to-indigo-500',  shadow: 'shadow-violet-100' },
    { label: t.admin.activeCourses,      value: `${courses.length}`, icon: BookOpen, gradient: 'from-blue-400 to-cyan-500',    shadow: 'shadow-blue-100'   },
    { label: t.admin.tokensDistributed,  value: '12,450', icon: Coins,    gradient: 'from-amber-400 to-orange-500',   shadow: 'shadow-amber-100'  },
    { label: t.admin.aiQuestions,        value: '2,340',  icon: Bot,      gradient: 'from-pink-400 to-rose-500',      shadow: 'shadow-pink-100'   },
  ];

  const aiAnalytics = [
    { topic: locale === 'es' ? 'Variables' : 'Variables',       questions: 45 },
    { topic: locale === 'es' ? 'Bucles' : 'Loops',              questions: 38 },
    { topic: locale === 'es' ? 'Funciones' : 'Functions',       questions: 32 },
    { topic: locale === 'es' ? 'Arrays' : 'Arrays',             questions: 28 },
    { topic: locale === 'es' ? 'Objetos' : 'Objects',           questions: 22 },
    { topic: locale === 'es' ? 'Condicionales' : 'Conditionals', questions: 18 },
  ];

  const platformMetrics = [
    { label: locale === 'es' ? 'Tasa de Completación' : 'Completion Rate', value: '68%', bar: 68, gradient: 'from-emerald-400 to-teal-500' },
    { label: locale === 'es' ? 'Uso del Tutor IA' : 'AI Tutor Usage',      value: '85%', bar: 85, gradient: 'from-violet-400 to-indigo-500' },
    { label: locale === 'es' ? 'Retención Semanal' : 'Weekly Retention',   value: '72%', bar: 72, gradient: 'from-blue-400 to-cyan-500'    },
    { label: locale === 'es' ? 'Satisfacción' : 'Satisfaction',            value: '94%', bar: 94, gradient: 'from-amber-400 to-orange-500' },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">{t.admin.title}</h1>
          <p className="mt-1 text-sm text-gray-500">{t.admin.description}</p>
        </div>
        <button
          onClick={() => setShowCreateModal(true)}
          className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-violet-500 to-indigo-600 px-5 py-2.5 text-sm font-bold text-white shadow-lg shadow-violet-200/60 transition-all hover:opacity-90 hover:scale-105"
        >
          <Plus className="h-4 w-4" /> {t.admin.createCourse}
        </button>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-4 gap-4">
        {stats.map((stat) => (
          <div
            key={stat.label}
            className="glass-card rounded-2xl p-5 transition-all duration-300 hover:scale-[1.03] hover:shadow-xl group"
          >
            <div className={`inline-flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br ${stat.gradient} shadow-md ${stat.shadow} mb-4 transition-transform duration-300 group-hover:scale-110`}>
              <stat.icon className="h-5 w-5 text-white" />
            </div>
            <p className="text-3xl font-extrabold text-gray-900">{stat.value}</p>
            <p className="mt-1 text-xs font-medium text-gray-500">{stat.label}</p>
          </div>
        ))}
      </div>

      {/* Tabs */}
      <Tabs defaultValue="students">
        <TabsList className="bg-white/60 backdrop-blur-sm border border-white/50 rounded-2xl p-1.5 shadow-sm">
          {[
            { value: 'students',  label: t.admin.manageStudents  },
            { value: 'courses',   label: t.admin.manageCourses   },
            { value: 'workshops', label: t.admin.manageWorkshops },
            { value: 'analytics', label: t.admin.analytics       },
          ].map((tab) => (
            <TabsTrigger
              key={tab.value}
              value={tab.value}
              className="rounded-xl text-sm font-semibold data-[state=active]:bg-gradient-to-r data-[state=active]:from-violet-500 data-[state=active]:to-indigo-600 data-[state=active]:text-white data-[state=active]:shadow-md data-[state=inactive]:text-gray-500"
            >
              {tab.label}
            </TabsTrigger>
          ))}
        </TabsList>

        {/* Students Tab */}
        <TabsContent value="students" className="mt-4">
          <div className="glass-card rounded-2xl overflow-hidden">
            <table className="w-full">
              <thead>
                <tr className="border-b border-white/40 bg-white/30">
                  {[locale === 'es' ? 'Nombre' : 'Name', 'Wallet', t.common.enrolled, t.common.completed, 'STEAM', locale === 'es' ? 'Acciones' : 'Actions'].map((h, i) => (
                    <th key={i} className={`px-5 py-3 text-xs font-bold text-gray-500 uppercase tracking-wide ${i >= 2 ? 'text-center' : 'text-left'} ${i >= 5 ? 'text-right' : ''}`}>
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {adminStudents.map((student, idx) => (
                  <tr key={student.id} className="border-b border-white/30 transition-colors hover:bg-white/40">
                    <td className="px-5 py-3.5">
                      <div className="flex items-center gap-3">
                        <div className={`flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br ${AVATAR_COLORS[idx % AVATAR_COLORS.length]} text-xs font-bold text-white shadow-sm`}>
                          {student.name.split(' ').map((n) => n[0]).join('')}
                        </div>
                        <span className="text-sm font-semibold text-gray-800">{student.name}</span>
                      </div>
                    </td>
                    <td className="px-5 py-3.5 font-mono text-xs text-gray-400">{student.wallet}</td>
                    <td className="px-5 py-3.5 text-center">
                      <span className="inline-flex items-center justify-center h-6 w-6 rounded-full bg-blue-100 text-xs font-bold text-blue-700">{student.coursesEnrolled}</span>
                    </td>
                    <td className="px-5 py-3.5 text-center">
                      <span className="inline-flex items-center justify-center h-6 w-6 rounded-full bg-emerald-100 text-xs font-bold text-emerald-700">{student.completed}</span>
                    </td>
                    <td className="px-5 py-3.5 text-center">
                      <span className="inline-flex items-center gap-1 rounded-full bg-amber-100 px-2.5 py-1 text-xs font-bold text-amber-700">
                        <Coins className="h-3 w-3" /> {student.steam}
                      </span>
                    </td>
                    <td className="px-5 py-3.5 text-right">
                      <button className="inline-flex items-center gap-1.5 rounded-xl bg-emerald-100 px-3 py-1.5 text-[11px] font-bold text-emerald-700 transition-all hover:bg-emerald-200 hover:scale-105">
                        <CheckCircle2 className="h-3 w-3" /> {t.admin.markCompleted}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </TabsContent>

        {/* Courses Tab */}
        <TabsContent value="courses" className="mt-4">
          <div className="glass-card rounded-2xl overflow-hidden">
            <table className="w-full">
              <thead>
                <tr className="border-b border-white/40 bg-white/30">
                  {[t.admin.courseTitle, t.admin.courseCategory, t.admin.courseDifficulty, t.admin.courseLessons, t.admin.courseReward, t.courses.students].map((h, i) => (
                    <th key={i} className={`px-5 py-3 text-xs font-bold text-gray-500 uppercase tracking-wide ${i >= 2 ? 'text-center' : 'text-left'} ${i >= 4 ? 'text-right' : ''}`}>
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {courses.map((course) => (
                  <tr key={course.id} className="border-b border-white/30 transition-colors hover:bg-white/40">
                    <td className="px-5 py-3.5">
                      <div className="flex items-center gap-3">
                        <div className={`flex h-8 w-8 items-center justify-center rounded-xl bg-gradient-to-br ${course.color} text-base shadow-sm`}>
                          {course.image}
                        </div>
                        <span className="text-sm font-semibold text-gray-800">
                          {locale === 'es' ? course.title.es : course.title.en}
                        </span>
                      </div>
                    </td>
                    <td className="px-5 py-3.5">
                      <span className="rounded-full bg-violet-100 px-2.5 py-0.5 text-[11px] font-semibold text-violet-700 capitalize">{course.category}</span>
                    </td>
                    <td className="px-5 py-3.5 text-center">
                      <span className={`inline-block rounded-full px-2.5 py-0.5 text-[10px] font-bold ${
                        course.difficulty === 'beginner' ? 'bg-emerald-100 text-emerald-700' :
                        course.difficulty === 'intermediate' ? 'bg-amber-100 text-amber-700' :
                        'bg-rose-100 text-rose-700'
                      }`}>
                        {t.courses[course.difficulty as keyof typeof t.courses] || course.difficulty}
                      </span>
                    </td>
                    <td className="px-5 py-3.5 text-center text-sm font-semibold text-gray-700">{course.lessons}</td>
                    <td className="px-5 py-3.5 text-right">
                      <span className="inline-flex items-center gap-1 rounded-full bg-amber-100 px-2.5 py-0.5 text-xs font-bold text-amber-700">
                        <Coins className="h-3 w-3" /> {course.steamReward}
                      </span>
                    </td>
                    <td className="px-5 py-3.5 text-right text-sm text-gray-500">{course.enrolled}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </TabsContent>

        {/* Workshops Tab */}
        <TabsContent value="workshops" className="mt-4">
          <div className="glass-card rounded-2xl overflow-hidden">
            <table className="w-full">
              <thead>
                <tr className="border-b border-white/40 bg-white/30">
                  {[locale === 'es' ? 'Taller' : 'Workshop', t.workshops.date, t.workshops.instructor, t.workshops.location, t.workshops.capacity].map((h, i) => (
                    <th key={i} className={`px-5 py-3 text-xs font-bold text-gray-500 uppercase tracking-wide ${i === 4 ? 'text-right' : 'text-left'}`}>
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {workshops.map((ws) => {
                  const fill = Math.round((ws.reserved / ws.capacity) * 100);
                  return (
                    <tr key={ws.id} className="border-b border-white/30 transition-colors hover:bg-white/40">
                      <td className="px-5 py-3.5 text-sm font-semibold text-gray-800">
                        {locale === 'es' ? ws.title.es : ws.title.en}
                      </td>
                      <td className="px-5 py-3.5 text-xs text-gray-500">{ws.date} · {ws.time}</td>
                      <td className="px-5 py-3.5 text-xs text-gray-500">{ws.instructor}</td>
                      <td className="px-5 py-3.5 text-xs text-gray-500">{ws.location}</td>
                      <td className="px-5 py-3.5 text-right">
                        <div className="flex flex-col items-end gap-1">
                          <span className="text-xs font-semibold text-gray-700">{ws.reserved}/{ws.capacity}</span>
                          <div className="h-1.5 w-16 rounded-full bg-gray-100 overflow-hidden">
                            <div
                              className={`h-full rounded-full ${fill >= 90 ? 'bg-rose-400' : fill >= 60 ? 'bg-amber-400' : 'bg-emerald-400'}`}
                              style={{ width: `${fill}%` }}
                            />
                          </div>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </TabsContent>

        {/* Analytics Tab */}
        <TabsContent value="analytics" className="mt-4">
          <div className="grid grid-cols-2 gap-5">
            {/* AI Topics Chart */}
            <div className="glass-card rounded-2xl overflow-hidden">
              <div className="flex items-center gap-2 px-5 py-4 border-b border-white/40">
                <Bot className="h-4 w-4 text-violet-500" />
                <h3 className="text-sm font-bold text-gray-900">
                  {locale === 'es' ? 'Preguntas Frecuentes al Tutor IA' : 'Most Asked AI Tutor Topics'}
                </h3>
              </div>
              <div className="p-4">
                <ResponsiveContainer width="100%" height={240}>
                  <BarChart data={aiAnalytics} layout="vertical">
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,0,0,0.05)" />
                    <XAxis type="number" tick={{ fontSize: 11, fill: '#9ca3af' }} axisLine={false} tickLine={false} />
                    <YAxis dataKey="topic" type="category" tick={{ fontSize: 11, fill: '#9ca3af' }} width={80} axisLine={false} tickLine={false} />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: 'rgba(255,255,255,0.9)',
                        border: '1px solid rgba(255,255,255,0.5)',
                        borderRadius: '12px',
                        fontSize: '12px',
                        boxShadow: '0 4px 24px rgba(120,80,200,0.12)',
                      }}
                    />
                    <Bar dataKey="questions" fill="url(#barGrad)" radius={[0, 6, 6, 0]}>
                      <defs>
                        <linearGradient id="barGrad" x1="0" y1="0" x2="1" y2="0">
                          <stop offset="0%" stopColor="#8b5cf6" />
                          <stop offset="100%" stopColor="#6366f1" />
                        </linearGradient>
                      </defs>
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Platform Summary */}
            <div className="glass-card rounded-2xl overflow-hidden">
              <div className="flex items-center gap-2 px-5 py-4 border-b border-white/40">
                <BarChart3 className="h-4 w-4 text-indigo-500" />
                <h3 className="text-sm font-bold text-gray-900">
                  {locale === 'es' ? 'Resumen de Plataforma' : 'Platform Summary'}
                </h3>
              </div>
              <div className="p-5 space-y-5">
                {platformMetrics.map((item) => (
                  <div key={item.label}>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs font-semibold text-gray-600">{item.label}</span>
                      <span className="text-sm font-bold text-gray-900">{item.value}</span>
                    </div>
                    <div className="h-2.5 w-full rounded-full bg-gray-100 overflow-hidden">
                      <div
                        className={`h-full rounded-full bg-gradient-to-r ${item.gradient} transition-all duration-700`}
                        style={{ width: `${item.bar}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </TabsContent>
      </Tabs>

      {/* Create Course Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-900/30 backdrop-blur-sm">
          <div className="w-full max-w-lg glass-strong rounded-3xl p-6 shadow-2xl animate-fade-in-up border border-white/50">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-lg font-bold text-gray-900">{t.admin.createCourse}</h2>
                <p className="text-xs text-gray-500 mt-0.5">{locale === 'es' ? 'Completa la información del nuevo curso' : 'Fill in the new course information'}</p>
              </div>
              <button
                onClick={() => setShowCreateModal(false)}
                className="flex h-8 w-8 items-center justify-center rounded-xl border border-white/50 bg-white/60 text-gray-500 hover:bg-red-50 hover:text-red-500 transition-all"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-gray-600 mb-1.5">{t.admin.courseTitle}</label>
                <input className="w-full rounded-xl border border-white/60 bg-white/70 px-3.5 py-2.5 text-sm text-gray-800 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-violet-300 backdrop-blur-sm" placeholder={t.admin.courseTitle} />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-600 mb-1.5">{t.admin.courseDescription}</label>
                <textarea className="w-full rounded-xl border border-white/60 bg-white/70 px-3.5 py-2.5 text-sm text-gray-800 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-violet-300 backdrop-blur-sm h-20 resize-none" placeholder={t.admin.courseDescription} />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-gray-600 mb-1.5">{t.admin.courseCategory}</label>
                  <select className="w-full rounded-xl border border-white/60 bg-white/70 px-3.5 py-2.5 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-violet-300 backdrop-blur-sm">
                    <option>{t.courses.programming}</option>
                    <option>{t.courses.softSkills}</option>
                    <option>{t.courses.design}</option>
                    <option>{t.courses.robotics}</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-600 mb-1.5">{t.admin.courseDifficulty}</label>
                  <select className="w-full rounded-xl border border-white/60 bg-white/70 px-3.5 py-2.5 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-violet-300 backdrop-blur-sm">
                    <option>{t.courses.beginner}</option>
                    <option>{t.courses.intermediate}</option>
                    <option>{t.courses.advanced}</option>
                  </select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-gray-600 mb-1.5">{t.admin.courseLessons}</label>
                  <input type="number" className="w-full rounded-xl border border-white/60 bg-white/70 px-3.5 py-2.5 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-violet-300 backdrop-blur-sm" placeholder="12" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-600 mb-1.5">{t.admin.courseReward} (STEAM)</label>
                  <input type="number" className="w-full rounded-xl border border-white/60 bg-white/70 px-3.5 py-2.5 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-violet-300 backdrop-blur-sm" placeholder="50" />
                </div>
              </div>
              <div className="flex justify-end gap-3 pt-2">
                <button
                  onClick={() => setShowCreateModal(false)}
                  className="rounded-xl border border-white/50 bg-white/60 px-5 py-2.5 text-sm font-semibold text-gray-600 transition-all hover:bg-white/80"
                >
                  {t.common.cancel}
                </button>
                <button
                  onClick={() => setShowCreateModal(false)}
                  className="rounded-xl bg-gradient-to-r from-violet-500 to-indigo-600 px-5 py-2.5 text-sm font-bold text-white shadow-lg shadow-violet-200/60 transition-all hover:opacity-90 hover:scale-105"
                >
                  {t.common.create}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
