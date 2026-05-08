import React, { useState } from 'react';
import { useI18n } from '@/lib/i18n';
import {
  Calendar,
  Clock,
  MapPin,
  User,
  Users,
  CheckCircle2,
  AlertCircle,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { workshops as initialWorkshops } from '@/lib/mockData';

export default function Workshops() {
  const { t, locale } = useI18n();
  const [workshopList, setWorkshopList] = useState(initialWorkshops);

  const toggleReservation = (id: string) => {
    setWorkshopList((prev) =>
      prev.map((w) =>
        w.id === id
          ? {
              ...w,
              isReserved: !w.isReserved,
              reserved: w.isReserved ? w.reserved - 1 : w.reserved + 1,
            }
          : w
      )
    );
  };

  const myReservations = workshopList.filter((w) => w.isReserved);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">{t.workshops.title}</h1>
        <p className="mt-1 text-sm text-muted-foreground">{t.workshops.description}</p>
      </div>

      <Tabs defaultValue="upcoming">
        <TabsList className="bg-muted">
          <TabsTrigger value="upcoming" className="text-sm">{t.workshops.upcoming}</TabsTrigger>
          <TabsTrigger value="mine" className="text-sm">
            {t.workshops.myReservations} ({myReservations.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="upcoming" className="mt-4">
          <div className="grid grid-cols-2 gap-5">
            {workshopList.map((ws) => {
              const isFull = ws.reserved >= ws.capacity && !ws.isReserved;
              const spotsLeft = ws.capacity - ws.reserved;
              return (
                <Card
                  key={ws.id}
                  className={`border-border bg-card shadow-theme-sm transition-base hover:shadow-theme-md ${
                    ws.isReserved ? 'ring-2 ring-secondary/30' : ''
                  }`}
                >
                  <CardContent className="p-5 space-y-4">
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className="text-base font-bold text-foreground">
                          {locale === 'es' ? ws.title.es : ws.title.en}
                        </h3>
                        <p className="mt-1 text-xs text-muted-foreground leading-relaxed">
                          {locale === 'es' ? ws.description.es : ws.description.en}
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
                            className={`h-full rounded-full transition-base ${
                              isFull ? 'bg-destructive' : 'bg-secondary'
                            }`}
                            style={{ width: `${(ws.reserved / ws.capacity) * 100}%` }}
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

                    <button
                      onClick={() => toggleReservation(ws.id)}
                      disabled={isFull}
                      className={`w-full rounded-lg py-2 text-xs font-semibold transition-base ${
                        ws.isReserved
                          ? 'border border-destructive/20 bg-destructive/5 text-destructive hover:bg-destructive/10'
                          : isFull
                          ? 'cursor-not-allowed bg-muted text-muted-foreground'
                          : 'bg-gradient-accent text-accent-foreground hover:opacity-90 hover:shadow-glow'
                      }`}
                    >
                      {ws.isReserved ? t.workshops.cancelReservation : t.workshops.reserve}
                    </button>
                  </CardContent>
                </Card>
              );
            })}
          </div>
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
                          {locale === 'es' ? ws.title.es : ws.title.en}
                        </h3>
                        <p className="text-xs text-muted-foreground">
                          {ws.date} · {ws.time} · {ws.location}
                        </p>
                      </div>
                    </div>
                    <button
                      onClick={() => toggleReservation(ws.id)}
                      className="rounded-lg border border-destructive/20 bg-destructive/5 px-3 py-1.5 text-xs font-medium text-destructive transition-base hover:bg-destructive/10"
                    >
                      {t.workshops.cancelReservation}
                    </button>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
