import React, { useEffect, useState } from 'react';
import { useI18n } from '@/lib/i18n';
import { useAuth } from '@/lib/auth';
import {
  Calendar,
  Clock,
  MapPin,
  User,
  Users,
  CheckCircle2,
  AlertCircle,
  Plus,
  X,
  Loader2,
  Trash2,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { supabase } from '@/lib/supabase';
import { workshops as mockWorkshops } from '@/lib/mockData';
import { addNotification } from '@/lib/notifications';

interface DisplayWorkshop {
  id: string;
  title_en: string;
  title_es: string;
  description_en: string;
  description_es: string;
  date: string;
  time: string;
  instructor: string;
  location: string;
  capacity: number;
  reserved: number;
  isReserved: boolean;
  created_by?: string | null;
  isMock?: boolean;
}

const emptyForm = {
  title_en: '',
  title_es: '',
  description_en: '',
  description_es: '',
  date: '',
  time: '',
  instructor: '',
  location: '',
  capacity: 30,
};

export default function Workshops() {
  const { t, locale } = useI18n();
  const { user } = useAuth();
  const [workshops, setWorkshops] = useState<DisplayWorkshop[]>([]);
  const [loading, setLoading] = useState(true);
  const [toggling, setToggling] = useState<string | null>(null);
  const [usesMock, setUsesMock] = useState(false);
  const [showCreate, setShowCreate] = useState(false);
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [registrantsCache, setRegistrantsCache] = useState<Record<string, { user_id: string; name: string }[]>>({});
  const [loadingRegistrants, setLoadingRegistrants] = useState<string | null>(null);

  const canManage = user?.role === 'educator' || user?.role === 'admin';

  useEffect(() => { fetchWorkshops(); }, [user?.id]);

  async function fetchWorkshops() {
    setLoading(true);
    try {
      const { data: ws, error } = await supabase
        .from('workshops')
        .select('*')
        .order('date', { ascending: true });

      if (error) throw error;

      // Fetch all registrations (SELECT ALL policy) to compute counts
      const { data: regs } = await supabase
        .from('workshop_registrations')
        .select('workshop_id, user_id')
        .in('workshop_id', ws.map(w => w.id));

      const allRegs = regs ?? [];
      const countMap: Record<string, number> = {};
      const mySet = new Set<string>();
      allRegs.forEach(r => {
        countMap[r.workshop_id] = (countMap[r.workshop_id] ?? 0) + 1;
        if (r.user_id === user?.id) mySet.add(r.workshop_id);
      });

      setWorkshops(ws.map(w => ({
        ...w,
        reserved: countMap[w.id] ?? 0,
        isReserved: mySet.has(w.id),
      })));
      setUsesMock(false);
    } catch {
      // Fall back to mock data when table doesn't exist or is empty
      setWorkshops(mockWorkshops.map(w => ({
        id: w.id,
        title_en: w.title.en,
        title_es: w.title.es,
        description_en: w.description.en,
        description_es: w.description.es,
        date: w.date,
        time: w.time,
        instructor: w.instructor,
        location: w.location,
        capacity: w.capacity,
        reserved: w.reserved,
        isReserved: w.isReserved,
        isMock: true,
      })));
      setUsesMock(true);
    }
    setLoading(false);
  }

  const fetchRegistrants = async (workshopId: string) => {
    if (registrantsCache[workshopId]) {
      // Toggle collapse if already loaded
      setExpandedId(prev => prev === workshopId ? null : workshopId);
      return;
    }
    setLoadingRegistrants(workshopId);
    setExpandedId(workshopId);

    // Step 1: get user_ids for this workshop
    const { data: regs } = await supabase
      .from('workshop_registrations')
      .select('user_id')
      .eq('workshop_id', workshopId);

    const userIds = (regs ?? []).map(r => r.user_id);

    if (userIds.length === 0) {
      setRegistrantsCache(prev => ({ ...prev, [workshopId]: [] }));
      setLoadingRegistrants(null);
      return;
    }

    // Step 2: get names from profiles
    const { data: profiles } = await supabase
      .from('profiles')
      .select('id, name')
      .in('id', userIds);

    const list = (profiles ?? []).map(p => ({ user_id: p.id, name: p.name ?? p.id }));
    setRegistrantsCache(prev => ({ ...prev, [workshopId]: list }));
    setLoadingRegistrants(null);
  };

  const toggleReservation = async (ws: DisplayWorkshop) => {
    if (!user) return;

    // Mock mode — in-memory only
    if (ws.isMock) {
      setWorkshops(prev => prev.map(w =>
        w.id === ws.id
          ? { ...w, isReserved: !w.isReserved, reserved: w.isReserved ? w.reserved - 1 : w.reserved + 1 }
          : w
      ));
      return;
    }

    setToggling(ws.id);
    const title = locale === 'es' ? ws.title_es : ws.title_en;

    if (ws.isReserved) {
      const { error } = await supabase
        .from('workshop_registrations')
        .delete()
        .eq('workshop_id', ws.id)
        .eq('user_id', user.id);
      if (!error) {
        setWorkshops(prev => prev.map(w =>
          w.id === ws.id ? { ...w, isReserved: false, reserved: w.reserved - 1 } : w
        ));
        // Invalidate registrants cache so the educator's list refreshes
        setRegistrantsCache(prev => { const next = { ...prev }; delete next[ws.id]; return next; });
        addNotification({
          type: 'course',
          title: locale === 'es' ? 'Reservación cancelada' : 'Reservation cancelled',
          description: title,
          href: '/workshops',
        });
      }
    } else {
      const { error } = await supabase
        .from('workshop_registrations')
        .insert({ workshop_id: ws.id, user_id: user.id });
      if (!error) {
        setWorkshops(prev => prev.map(w =>
          w.id === ws.id ? { ...w, isReserved: true, reserved: w.reserved + 1 } : w
        ));
        setRegistrantsCache(prev => { const next = { ...prev }; delete next[ws.id]; return next; });
        addNotification({
          type: 'reward',
          title: locale === 'es' ? 'Taller reservado' : 'Workshop reserved',
          description: title,
          href: '/workshops',
        });
      } else {
        console.warn('reserve error:', error.message);
      }
    }

    setToggling(null);
  };

  const createWorkshop = async () => {
    if (!user || !canManage) return;
    setSaving(true);

    const { data, error } = await supabase
      .from('workshops')
      .insert({ ...form, created_by: user.id })
      .select()
      .single();

    if (!error && data) {
      setWorkshops(prev => [...prev, { ...data, reserved: 0, isReserved: false }]);
      setUsesMock(false);
      setShowCreate(false);
      setForm(emptyForm);
    } else {
      console.warn('create workshop error:', error?.message);
    }

    setSaving(false);
  };

  const deleteWorkshop = async (ws: DisplayWorkshop) => {
    if (!user || !canManage) return;
    const title = locale === 'es' ? ws.title_es : ws.title_en;
    const confirmed = window.confirm(
      locale === 'es' ? `¿Eliminar "${title}"? Se cancelarán todas las reservaciones.` : `Delete "${title}"? All reservations will be cancelled.`
    );
    if (!confirmed) return;
    const { error } = await supabase.from('workshops').delete().eq('id', ws.id);
    if (!error) {
      setWorkshops(prev => prev.filter(w => w.id !== ws.id));
      setRegistrantsCache(prev => { const next = { ...prev }; delete next[ws.id]; return next; });
      if (expandedId === ws.id) setExpandedId(null);
      addNotification({
        type: 'course',
        title: locale === 'es' ? 'Taller eliminado' : 'Workshop deleted',
        description: title,
        href: '/workshops',
      });
    } else {
      console.warn('delete error:', error.message);
    }
  };

  const myReservations = workshops.filter(w => w.isReserved);
  const myWorkshops = workshops.filter(w => w.created_by === user?.id);

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">{t.workshops.title}</h1>
          <p className="mt-1 text-sm text-muted-foreground">{t.workshops.description}</p>
          {usesMock && (
            <p className="mt-1 text-xs text-amber-500">
              {locale === 'es' ? 'Mostrando datos de ejemplo — ejecuta el SQL en Supabase para activar.' : 'Showing sample data — run the SQL in Supabase to activate.'}
            </p>
          )}
        </div>
        {canManage && !usesMock && (
          <button
            onClick={() => setShowCreate(true)}
            className="flex items-center gap-2 rounded-lg bg-gradient-accent px-4 py-2 text-sm font-semibold text-accent-foreground shadow-theme-sm transition-base hover:opacity-90"
          >
            <Plus className="h-4 w-4" />
            {locale === 'es' ? 'Crear taller' : 'Create workshop'}
          </button>
        )}
      </div>

      {loading ? (
        <div className="flex h-48 items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-violet-400" />
        </div>
      ) : (
        <Tabs defaultValue="upcoming">
          <TabsList className="bg-muted">
            <TabsTrigger value="upcoming" className="text-sm">{t.workshops.upcoming}</TabsTrigger>
            <TabsTrigger value="mine" className="text-sm">
              {t.workshops.myReservations} ({myReservations.length})
            </TabsTrigger>
            {canManage && !usesMock && (
              <TabsTrigger value="created" className="text-sm">
                {locale === 'es' ? 'Mis talleres' : 'My workshops'} ({myWorkshops.length})
              </TabsTrigger>
            )}
          </TabsList>

          <TabsContent value="upcoming" className="mt-4">
            {workshops.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-16 text-center">
                <Calendar className="h-12 w-12 text-muted-foreground/20 mb-3" />
                <p className="text-sm text-muted-foreground">
                  {locale === 'es' ? 'No hay talleres próximos.' : 'No upcoming workshops.'}
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-5">
                {workshops.map((ws) => {
                  const isOwner = !ws.isMock && ws.created_by === user?.id;
                  const isFull = ws.reserved >= ws.capacity && !ws.isReserved;
                  const spotsLeft = ws.capacity - ws.reserved;
                  const isToggling = toggling === ws.id;
                  return (
                    <Card
                      key={ws.id}
                      className={`border-border bg-card shadow-theme-sm transition-base hover:shadow-theme-md ${
                        ws.isReserved ? 'ring-2 ring-secondary/30' : ''
                      }`}
                    >
                      <CardContent className="p-5 space-y-4">
                        <div className="flex items-start justify-between gap-3">
                          <div>
                            <h3 className="text-base font-bold text-foreground">
                              {locale === 'es' ? ws.title_es : ws.title_en}
                            </h3>
                            <p className="mt-1 text-xs text-muted-foreground leading-relaxed">
                              {locale === 'es' ? ws.description_es : ws.description_en}
                            </p>
                          </div>
                          {ws.isReserved && (
                            <span className="shrink-0 flex items-center gap-1 rounded-full bg-success/10 px-2.5 py-1 text-[10px] font-semibold text-success">
                              <CheckCircle2 className="h-3 w-3" />
                              {t.workshops.reserved}
                            </span>
                          )}
                        </div>

                        <div className="grid grid-cols-2 gap-2 text-xs text-muted-foreground">
                          <span className="flex items-center gap-1.5">
                            <Calendar className="h-3.5 w-3.5" /> {ws.date}
                          </span>
                          <span className="flex items-center gap-1.5">
                            <Clock className="h-3.5 w-3.5" /> {ws.time}
                          </span>
                          <span className="flex items-center gap-1.5">
                            <User className="h-3.5 w-3.5" /> {ws.instructor}
                          </span>
                          <span className="flex items-center gap-1.5">
                            <MapPin className="h-3.5 w-3.5" /> {ws.location}
                          </span>
                        </div>

                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <Users className="h-3.5 w-3.5 text-muted-foreground" />
                            <div className="h-2 w-32 rounded-full bg-muted overflow-hidden">
                              <div
                                className={`h-full rounded-full transition-base ${isFull ? 'bg-destructive' : 'bg-secondary'}`}
                                style={{ width: `${Math.min((ws.reserved / ws.capacity) * 100, 100)}%` }}
                              />
                            </div>
                            <span className="text-[10px] text-muted-foreground">
                              {ws.reserved}/{ws.capacity}
                            </span>
                          </div>
                          {isFull ? (
                            <span className="flex items-center gap-1 text-[11px] font-medium text-destructive">
                              <AlertCircle className="h-3 w-3" /> {t.workshops.full}
                            </span>
                          ) : (
                            <span className="text-[11px] text-muted-foreground">
                              {spotsLeft} {t.workshops.spotsLeft}
                            </span>
                          )}
                        </div>

                        {isOwner ? (
                          <div className="w-full rounded-lg py-2 text-xs font-semibold text-center bg-muted text-muted-foreground cursor-default">
                            {locale === 'es' ? 'Tu taller' : 'Your workshop'}
                          </div>
                        ) : (
                          <button
                            onClick={() => toggleReservation(ws)}
                            disabled={isFull || isToggling}
                            className={`w-full rounded-lg py-2 text-xs font-semibold transition-base flex items-center justify-center gap-1.5 ${
                              ws.isReserved
                                ? 'border border-destructive/20 bg-destructive/5 text-destructive hover:bg-destructive/10'
                                : isFull
                                ? 'cursor-not-allowed bg-muted text-muted-foreground'
                                : 'bg-gradient-accent text-accent-foreground hover:opacity-90 hover:shadow-glow'
                            }`}
                          >
                            {isToggling && <Loader2 className="h-3 w-3 animate-spin" />}
                            {ws.isReserved ? t.workshops.cancelReservation : t.workshops.reserve}
                          </button>
                        )}
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            )}
          </TabsContent>

          <TabsContent value="mine" className="mt-4">
            {myReservations.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-16 text-center">
                <Calendar className="h-12 w-12 text-muted-foreground/20 mb-3" />
                <p className="text-sm text-muted-foreground">
                  {locale === 'es' ? 'No tienes reservaciones aún.' : 'No reservations yet.'}
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {myReservations.map((ws) => (
                  <Card key={ws.id} className="border-border bg-card shadow-theme-sm">
                    <CardContent className="flex items-center justify-between p-4">
                      <div className="flex items-center gap-4">
                        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-secondary/10">
                          <Calendar className="h-5 w-5 text-secondary" />
                        </div>
                        <div>
                          <h3 className="text-sm font-bold text-foreground">
                            {locale === 'es' ? ws.title_es : ws.title_en}
                          </h3>
                          <p className="text-xs text-muted-foreground">
                            {ws.date} · {ws.time} · {ws.location}
                          </p>
                        </div>
                      </div>
                      <button
                        onClick={() => toggleReservation(ws)}
                        disabled={toggling === ws.id}
                        className="flex items-center gap-1.5 rounded-lg border border-destructive/20 bg-destructive/5 px-3 py-1.5 text-xs font-medium text-destructive transition-base hover:bg-destructive/10 disabled:opacity-60"
                      >
                        {toggling === ws.id && <Loader2 className="h-3 w-3 animate-spin" />}
                        {t.workshops.cancelReservation}
                      </button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>
          {canManage && !usesMock && (
            <TabsContent value="created" className="mt-4">
              {myWorkshops.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-16 text-center">
                  <Calendar className="h-12 w-12 text-muted-foreground/20 mb-3" />
                  <p className="text-sm text-muted-foreground">
                    {locale === 'es' ? 'No has creado talleres aún.' : "You haven't created any workshops yet."}
                  </p>
                  <button
                    onClick={() => setShowCreate(true)}
                    className="mt-4 flex items-center gap-2 rounded-lg bg-gradient-accent px-4 py-2 text-sm font-semibold text-accent-foreground shadow-theme-sm transition-base hover:opacity-90"
                  >
                    <Plus className="h-4 w-4" />
                    {locale === 'es' ? 'Crear taller' : 'Create workshop'}
                  </button>
                </div>
              ) : (
                <div className="space-y-3">
                  {myWorkshops.map((ws) => {
                    const isExpanded = expandedId === ws.id;
                    const isLoadingRegs = loadingRegistrants === ws.id;
                    const registrants = registrantsCache[ws.id];
                    return (
                      <Card key={ws.id} className="border-border bg-card shadow-theme-sm">
                        <CardContent className="p-4 space-y-3">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-4">
                              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-violet-100 shrink-0">
                                <Calendar className="h-5 w-5 text-violet-600" />
                              </div>
                              <div>
                                <h3 className="text-sm font-bold text-foreground">
                                  {locale === 'es' ? ws.title_es : ws.title_en}
                                </h3>
                                <p className="text-xs text-muted-foreground">
                                  {ws.date} · {ws.time} · {ws.location}
                                </p>
                              </div>
                            </div>
                            <div className="flex items-center gap-2 shrink-0">
                              <button
                                onClick={() => fetchRegistrants(ws.id)}
                                className="flex items-center gap-1.5 rounded-lg border border-violet-200 bg-violet-50 px-3 py-1.5 text-xs font-medium text-violet-700 transition-base hover:bg-violet-100"
                              >
                                {isLoadingRegs
                                  ? <Loader2 className="h-3 w-3 animate-spin" />
                                  : isExpanded
                                  ? <ChevronUp className="h-3 w-3" />
                                  : <ChevronDown className="h-3 w-3" />}
                                <Users className="h-3 w-3" />
                                {ws.reserved}/{ws.capacity}
                              </button>
                              <button
                                onClick={() => deleteWorkshop(ws)}
                                className="flex items-center gap-1.5 rounded-lg border border-destructive/20 bg-destructive/5 px-3 py-1.5 text-xs font-medium text-destructive transition-base hover:bg-destructive/10"
                              >
                                <Trash2 className="h-3 w-3" />
                                {locale === 'es' ? 'Eliminar' : 'Delete'}
                              </button>
                            </div>
                          </div>

                          {/* Registrants list */}
                          {isExpanded && (
                            <div className="rounded-xl bg-muted px-4 py-3 space-y-2">
                              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                                {locale === 'es' ? 'Inscritos' : 'Registered students'}
                              </p>
                              {isLoadingRegs ? (
                                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                                  <Loader2 className="h-3 w-3 animate-spin" /> {locale === 'es' ? 'Cargando…' : 'Loading…'}
                                </div>
                              ) : registrants && registrants.length > 0 ? (
                                <ul className="space-y-1.5">
                                  {registrants.map(r => (
                                    <li key={r.user_id} className="flex items-center gap-2 text-xs text-foreground">
                                      <div className="flex h-6 w-6 items-center justify-center rounded-full bg-secondary/20 text-secondary text-[10px] font-bold shrink-0">
                                        {r.name.charAt(0).toUpperCase()}
                                      </div>
                                      {r.name}
                                    </li>
                                  ))}
                                </ul>
                              ) : (
                                <p className="text-xs text-muted-foreground">
                                  {locale === 'es' ? 'Nadie inscrito aún.' : 'No one registered yet.'}
                                </p>
                              )}
                            </div>
                          )}
                        </CardContent>
                      </Card>
                    );
                  })}
                </div>
              )}
            </TabsContent>
          )}
        </Tabs>
      )}

      {/* Create workshop modal — educators / admins only */}
      {showCreate && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
          <div className="relative w-full max-w-lg rounded-3xl bg-white p-8 shadow-2xl max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => { setShowCreate(false); setForm(emptyForm); }}
              className="absolute top-4 right-4 flex h-8 w-8 items-center justify-center rounded-full hover:bg-gray-100 text-gray-400"
            >
              <X className="h-4 w-4" />
            </button>

            <h2 className="text-xl font-extrabold text-gray-900 mb-6">
              {locale === 'es' ? 'Crear taller' : 'Create workshop'}
            </h2>

            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-gray-600 mb-1 block">Título (ES)</label>
                  <input
                    value={form.title_es}
                    onChange={e => setForm(f => ({ ...f, title_es: e.target.value }))}
                    placeholder="Taller de Python"
                    className="w-full rounded-xl border border-gray-200 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-violet-300"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-gray-600 mb-1 block">Title (EN)</label>
                  <input
                    value={form.title_en}
                    onChange={e => setForm(f => ({ ...f, title_en: e.target.value }))}
                    placeholder="Python Workshop"
                    className="w-full rounded-xl border border-gray-200 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-violet-300"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-gray-600 mb-1 block">Descripción (ES)</label>
                  <textarea
                    value={form.description_es}
                    onChange={e => setForm(f => ({ ...f, description_es: e.target.value }))}
                    rows={2}
                    className="w-full rounded-xl border border-gray-200 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-violet-300 resize-none"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-gray-600 mb-1 block">Description (EN)</label>
                  <textarea
                    value={form.description_en}
                    onChange={e => setForm(f => ({ ...f, description_en: e.target.value }))}
                    rows={2}
                    className="w-full rounded-xl border border-gray-200 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-violet-300 resize-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-gray-600 mb-1 block">
                    {locale === 'es' ? 'Fecha' : 'Date'}
                  </label>
                  <input
                    type="date"
                    value={form.date}
                    onChange={e => setForm(f => ({ ...f, date: e.target.value }))}
                    className="w-full rounded-xl border border-gray-200 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-violet-300"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-gray-600 mb-1 block">
                    {locale === 'es' ? 'Hora' : 'Time'}
                  </label>
                  <input
                    type="time"
                    value={form.time}
                    onChange={e => setForm(f => ({ ...f, time: e.target.value }))}
                    className="w-full rounded-xl border border-gray-200 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-violet-300"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-gray-600 mb-1 block">
                    {locale === 'es' ? 'Instructor' : 'Instructor'}
                  </label>
                  <input
                    value={form.instructor}
                    onChange={e => setForm(f => ({ ...f, instructor: e.target.value }))}
                    placeholder={user?.name ?? ''}
                    className="w-full rounded-xl border border-gray-200 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-violet-300"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-gray-600 mb-1 block">
                    {locale === 'es' ? 'Lugar' : 'Location'}
                  </label>
                  <input
                    value={form.location}
                    onChange={e => setForm(f => ({ ...f, location: e.target.value }))}
                    placeholder="Tegucigalpa Hub"
                    className="w-full rounded-xl border border-gray-200 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-violet-300"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-gray-600 mb-1 block">
                  {locale === 'es' ? 'Capacidad máxima' : 'Max capacity'}
                </label>
                <input
                  type="number"
                  min={1}
                  value={form.capacity}
                  onChange={e => setForm(f => ({ ...f, capacity: Math.max(1, parseInt(e.target.value) || 1) }))}
                  className="w-full rounded-xl border border-gray-200 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-violet-300"
                />
              </div>
            </div>

            <div className="mt-6 flex gap-3">
              <button
                onClick={() => { setShowCreate(false); setForm(emptyForm); }}
                className="flex-1 rounded-xl border border-gray-200 py-2.5 text-sm font-semibold text-gray-600 hover:bg-gray-50 transition-all"
              >
                {locale === 'es' ? 'Cancelar' : 'Cancel'}
              </button>
              <button
                onClick={createWorkshop}
                disabled={saving || !form.title_es || !form.date || !form.instructor}
                className="flex-1 flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-violet-500 to-indigo-600 py-2.5 text-sm font-bold text-white shadow-md shadow-violet-200/60 hover:opacity-90 transition-all disabled:opacity-60"
              >
                {saving && <Loader2 className="h-4 w-4 animate-spin" />}
                {locale === 'es' ? 'Crear taller' : 'Create workshop'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
