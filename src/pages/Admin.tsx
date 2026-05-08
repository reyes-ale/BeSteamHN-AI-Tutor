import React, { useState } from 'react';
import { useI18n } from '@/lib/i18n';
import {
  Users,
  BookOpen,
  Coins,
  Bot,
  Plus,
  CheckCircle2,
  X,
  Award,
  BarChart3,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { courses, adminStudents, workshops } from '@/lib/mockData';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

export default function Admin() {
  const { t, locale } = useI18n();
  const [showCreateModal, setShowCreateModal] = useState(false);

  const stats = [
    { label: t.admin.totalStudents, value: '156', icon: Users, color: 'bg-primary/10 text-primary' },
    { label: t.admin.activeCourses, value: `${courses.length}`, icon: BookOpen, color: 'bg-secondary/10 text-secondary' },
    { label: t.admin.tokensDistributed, value: '12,450', icon: Coins, color: 'bg-steam/10 text-steam' },
    { label: t.admin.aiQuestions, value: '2,340', icon: Bot, color: 'bg-info/10 text-info' },
  ];

  const aiAnalytics = [
    { topic: locale === 'es' ? 'Variables' : 'Variables', questions: 45 },
    { topic: locale === 'es' ? 'Bucles' : 'Loops', questions: 38 },
    { topic: locale === 'es' ? 'Funciones' : 'Functions', questions: 32 },
    { topic: locale === 'es' ? 'Arrays' : 'Arrays', questions: 28 },
    { topic: locale === 'es' ? 'Objetos' : 'Objects', questions: 22 },
    { topic: locale === 'es' ? 'Condicionales' : 'Conditionals', questions: 18 },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">{t.admin.title}</h1>
          <p className="mt-1 text-sm text-muted-foreground">{t.admin.description}</p>
        </div>
        <button
          onClick={() => setShowCreateModal(true)}
          className="flex items-center gap-2 rounded-lg bg-gradient-accent px-4 py-2 text-sm font-semibold text-accent-foreground transition-base hover:opacity-90 hover:shadow-glow"
        >
          <Plus className="h-4 w-4" /> {t.admin.createCourse}
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-4 gap-4">
        {stats.map((stat) => (
          <Card key={stat.label} className="border-border bg-card shadow-theme-sm">
            <CardContent className="flex items-center gap-4 p-4">
              <div className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ${stat.color}`}>
                <stat.icon className="h-5 w-5" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">{stat.value}</p>
                <p className="text-xs text-muted-foreground">{stat.label}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Tabs defaultValue="students">
        <TabsList className="bg-muted">
          <TabsTrigger value="students" className="text-sm">{t.admin.manageStudents}</TabsTrigger>
          <TabsTrigger value="courses" className="text-sm">{t.admin.manageCourses}</TabsTrigger>
          <TabsTrigger value="workshops" className="text-sm">{t.admin.manageWorkshops}</TabsTrigger>
          <TabsTrigger value="analytics" className="text-sm">{t.admin.analytics}</TabsTrigger>
        </TabsList>

        {/* Students Tab */}
        <TabsContent value="students" className="mt-4">
          <Card className="border-border bg-card shadow-theme-sm overflow-hidden">
            <CardContent className="p-0">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-border bg-muted/50">
                    <th className="px-5 py-3 text-left text-xs font-semibold text-muted-foreground">
                      {locale === 'es' ? 'Nombre' : 'Name'}
                    </th>
                    <th className="px-5 py-3 text-left text-xs font-semibold text-muted-foreground">
                      {locale === 'es' ? 'Wallet' : 'Wallet'}
                    </th>
                    <th className="px-5 py-3 text-center text-xs font-semibold text-muted-foreground">
                      {t.common.enrolled}
                    </th>
                    <th className="px-5 py-3 text-center text-xs font-semibold text-muted-foreground">
                      {t.common.completed}
                    </th>
                    <th className="px-5 py-3 text-right text-xs font-semibold text-muted-foreground">
                      STEAM
                    </th>
                    <th className="px-5 py-3 text-right text-xs font-semibold text-muted-foreground">
                      {locale === 'es' ? 'Acciones' : 'Actions'}
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {adminStudents.map((student) => (
                    <tr key={student.id} className="border-b border-border/50 transition-base hover:bg-muted/30">
                      <td className="px-5 py-3">
                        <div className="flex items-center gap-3">
                          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-xs font-bold text-primary">
                            {student.name.split(' ').map((n) => n[0]).join('')}
                          </div>
                          <span className="text-sm font-medium text-foreground">{student.name}</span>
                        </div>
                      </td>
                      <td className="px-5 py-3 font-mono text-xs text-muted-foreground">{student.wallet}</td>
                      <td className="px-5 py-3 text-center text-sm text-foreground">{student.coursesEnrolled}</td>
                      <td className="px-5 py-3 text-center text-sm text-foreground">{student.completed}</td>
                      <td className="px-5 py-3 text-right">
                        <span className="inline-flex items-center gap-1 text-sm font-bold text-steam">
                          <Coins className="h-3 w-3" /> {student.steam}
                        </span>
                      </td>
                      <td className="px-5 py-3 text-right">
                        <button className="inline-flex items-center gap-1 rounded-lg bg-success/10 px-3 py-1.5 text-[11px] font-medium text-success transition-base hover:bg-success/20">
                          <CheckCircle2 className="h-3 w-3" /> {t.admin.markCompleted}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Courses Tab */}
        <TabsContent value="courses" className="mt-4">
          <Card className="border-border bg-card shadow-theme-sm overflow-hidden">
            <CardContent className="p-0">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-border bg-muted/50">
                    <th className="px-5 py-3 text-left text-xs font-semibold text-muted-foreground">{t.admin.courseTitle}</th>
                    <th className="px-5 py-3 text-left text-xs font-semibold text-muted-foreground">{t.admin.courseCategory}</th>
                    <th className="px-5 py-3 text-center text-xs font-semibold text-muted-foreground">{t.admin.courseDifficulty}</th>
                    <th className="px-5 py-3 text-center text-xs font-semibold text-muted-foreground">{t.admin.courseLessons}</th>
                    <th className="px-5 py-3 text-right text-xs font-semibold text-muted-foreground">{t.admin.courseReward}</th>
                    <th className="px-5 py-3 text-right text-xs font-semibold text-muted-foreground">{t.courses.students}</th>
                  </tr>
                </thead>
                <tbody>
                  {courses.map((course) => (
                    <tr key={course.id} className="border-b border-border/50 transition-base hover:bg-muted/30">
                      <td className="px-5 py-3">
                        <div className="flex items-center gap-3">
                          <span className="text-lg">{course.image}</span>
                          <span className="text-sm font-medium text-foreground">
                            {locale === 'es' ? course.title.es : course.title.en}
                          </span>
                        </div>
                      </td>
                      <td className="px-5 py-3 text-xs text-muted-foreground capitalize">{course.category}</td>
                      <td className="px-5 py-3 text-center">
                        <span className={`inline-block rounded-full px-2 py-0.5 text-[10px] font-semibold ${
                          course.difficulty === 'beginner' ? 'bg-success/10 text-success' :
                          course.difficulty === 'intermediate' ? 'bg-warning/10 text-warning' :
                          'bg-destructive/10 text-destructive'
                        }`}>
                          {t.courses[course.difficulty as keyof typeof t.courses] || course.difficulty}
                        </span>
                      </td>
                      <td className="px-5 py-3 text-center text-sm text-foreground">{course.lessons}</td>
                      <td className="px-5 py-3 text-right">
                        <span className="inline-flex items-center gap-1 text-sm font-bold text-steam">
                          <Coins className="h-3 w-3" /> {course.steamReward}
                        </span>
                      </td>
                      <td className="px-5 py-3 text-right text-sm text-muted-foreground">{course.enrolled}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Workshops Tab */}
        <TabsContent value="workshops" className="mt-4">
          <Card className="border-border bg-card shadow-theme-sm overflow-hidden">
            <CardContent className="p-0">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-border bg-muted/50">
                    <th className="px-5 py-3 text-left text-xs font-semibold text-muted-foreground">{locale === 'es' ? 'Taller' : 'Workshop'}</th>
                    <th className="px-5 py-3 text-left text-xs font-semibold text-muted-foreground">{t.workshops.date}</th>
                    <th className="px-5 py-3 text-left text-xs font-semibold text-muted-foreground">{t.workshops.instructor}</th>
                    <th className="px-5 py-3 text-left text-xs font-semibold text-muted-foreground">{t.workshops.location}</th>
                    <th className="px-5 py-3 text-right text-xs font-semibold text-muted-foreground">{t.workshops.capacity}</th>
                  </tr>
                </thead>
                <tbody>
                  {workshops.map((ws) => (
                    <tr key={ws.id} className="border-b border-border/50 transition-base hover:bg-muted/30">
                      <td className="px-5 py-3 text-sm font-medium text-foreground">
                        {locale === 'es' ? ws.title.es : ws.title.en}
                      </td>
                      <td className="px-5 py-3 text-xs text-muted-foreground">{ws.date} · {ws.time}</td>
                      <td className="px-5 py-3 text-xs text-muted-foreground">{ws.instructor}</td>
                      <td className="px-5 py-3 text-xs text-muted-foreground">{ws.location}</td>
                      <td className="px-5 py-3 text-right text-sm text-foreground">{ws.reserved}/{ws.capacity}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Analytics Tab */}
        <TabsContent value="analytics" className="mt-4">
          <div className="grid grid-cols-2 gap-6">
            <Card className="border-border bg-card shadow-theme-sm">
              <CardHeader className="pb-2">
                <CardTitle className="flex items-center gap-2 text-sm font-semibold text-foreground">
                  <Bot className="h-4 w-4 text-secondary" />
                  {locale === 'es' ? 'Preguntas Más Frecuentes al Tutor IA' : 'Most Asked AI Tutor Topics'}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={250}>
                  <BarChart data={aiAnalytics} layout="vertical">
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(214 20% 90%)" />
                    <XAxis type="number" tick={{ fontSize: 11, fill: 'hsl(215 16% 47%)' }} />
                    <YAxis dataKey="topic" type="category" tick={{ fontSize: 11, fill: 'hsl(215 16% 47%)' }} width={80} />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: 'hsl(0 0% 100%)',
                        border: '1px solid hsl(214 20% 90%)',
                        borderRadius: '8px',
                        fontSize: '12px',
                      }}
                    />
                    <Bar dataKey="questions" fill="hsl(170 65% 50%)" radius={[0, 4, 4, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card className="border-border bg-card shadow-theme-sm">
              <CardHeader className="pb-2">
                <CardTitle className="flex items-center gap-2 text-sm font-semibold text-foreground">
                  <BarChart3 className="h-4 w-4 text-primary" />
                  {locale === 'es' ? 'Resumen de Plataforma' : 'Platform Summary'}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {[
                  { label: locale === 'es' ? 'Tasa de Completación' : 'Completion Rate', value: '68%', bar: 68, color: 'bg-success' },
                  { label: locale === 'es' ? 'Uso del Tutor IA' : 'AI Tutor Usage', value: '85%', bar: 85, color: 'bg-secondary' },
                  { label: locale === 'es' ? 'Retención Semanal' : 'Weekly Retention', value: '72%', bar: 72, color: 'bg-info' },
                  { label: locale === 'es' ? 'Satisfacción' : 'Satisfaction', value: '94%', bar: 94, color: 'bg-steam' },
                ].map((item) => (
                  <div key={item.label}>
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="text-xs font-medium text-muted-foreground">{item.label}</span>
                      <span className="text-xs font-bold text-foreground">{item.value}</span>
                    </div>
                    <div className="h-2 w-full rounded-full bg-muted overflow-hidden">
                      <div className={`h-full rounded-full ${item.color} transition-base`} style={{ width: `${item.bar}%` }} />
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>

      {/* Create Course Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-foreground/20 backdrop-blur-sm">
          <div className="w-full max-w-lg rounded-2xl border border-border bg-card p-6 shadow-theme-xl animate-fade-in-up">
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-lg font-bold text-foreground">{t.admin.createCourse}</h2>
              <button
                onClick={() => setShowCreateModal(false)}
                className="flex h-8 w-8 items-center justify-center rounded-lg text-muted-foreground hover:bg-muted hover:text-foreground transition-base"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-muted-foreground mb-1">{t.admin.courseTitle}</label>
                <input className="w-full rounded-lg border border-input bg-background px-3 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-secondary/50" placeholder={t.admin.courseTitle} />
              </div>
              <div>
                <label className="block text-xs font-medium text-muted-foreground mb-1">{t.admin.courseDescription}</label>
                <textarea className="w-full rounded-lg border border-input bg-background px-3 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-secondary/50 h-20 resize-none" placeholder={t.admin.courseDescription} />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-muted-foreground mb-1">{t.admin.courseCategory}</label>
                  <select className="w-full rounded-lg border border-input bg-background px-3 py-2.5 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-secondary/50">
                    <option>{t.courses.programming}</option>
                    <option>{t.courses.softSkills}</option>
                    <option>{t.courses.design}</option>
                    <option>{t.courses.robotics}</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-medium text-muted-foreground mb-1">{t.admin.courseDifficulty}</label>
                  <select className="w-full rounded-lg border border-input bg-background px-3 py-2.5 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-secondary/50">
                    <option>{t.courses.beginner}</option>
                    <option>{t.courses.intermediate}</option>
                    <option>{t.courses.advanced}</option>
                  </select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-muted-foreground mb-1">{t.admin.courseLessons}</label>
                  <input type="number" className="w-full rounded-lg border border-input bg-background px-3 py-2.5 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-secondary/50" placeholder="12" />
                </div>
                <div>
                  <label className="block text-xs font-medium text-muted-foreground mb-1">{t.admin.courseReward} (STEAM)</label>
                  <input type="number" className="w-full rounded-lg border border-input bg-background px-3 py-2.5 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-secondary/50" placeholder="50" />
                </div>
              </div>
              <div className="flex justify-end gap-3 pt-2">
                <button
                  onClick={() => setShowCreateModal(false)}
                  className="rounded-lg border border-border px-4 py-2 text-sm font-medium text-muted-foreground transition-base hover:bg-muted hover:text-foreground"
                >
                  {t.common.cancel}
                </button>
                <button
                  onClick={() => setShowCreateModal(false)}
                  className="rounded-lg bg-gradient-accent px-4 py-2 text-sm font-semibold text-accent-foreground transition-base hover:opacity-90 hover:shadow-glow"
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
