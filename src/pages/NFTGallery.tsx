import React from 'react';
import { useI18n } from '@/lib/i18n';
import { Award, ExternalLink, ShieldCheck, CalendarDays, GraduationCap } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { nftCertificates } from '@/lib/mockData';

export default function NFTGallery() {
  const { t, locale } = useI18n();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">{t.nfts.myGallery}</h1>
        <p className="mt-1 text-sm text-muted-foreground">{t.nfts.galleryDesc}</p>
      </div>

      {nftCertificates.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <Award className="h-16 w-16 text-muted-foreground/20 mb-4" />
          <p className="text-sm text-muted-foreground">{t.nfts.noCertificates}</p>
        </div>
      ) : (
        <div className="grid grid-cols-3 gap-6">
          {nftCertificates.map((cert) => (
            <Card
              key={cert.id}
              className="group overflow-hidden border-border bg-card shadow-theme-sm transition-base hover:shadow-theme-xl hover:border-secondary/30"
            >
              {/* Certificate Cover */}
              <div className={`relative flex h-52 flex-col items-center justify-center bg-gradient-to-br ${cert.color}`}>
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_40%,rgba(255,255,255,0.15),transparent_60%)]" />
                <span className="text-6xl mb-2">{cert.image}</span>
                <div className="rounded-full bg-card/20 backdrop-blur-sm px-4 py-1.5">
                  <p className="text-sm font-bold text-accent-foreground">
                    {locale === 'es' ? cert.courseName.es : cert.courseName.en}
                  </p>
                </div>
                <div className="absolute top-3 right-3 flex h-8 w-8 items-center justify-center rounded-full bg-card/20 backdrop-blur-sm">
                  <ShieldCheck className="h-4 w-4 text-accent-foreground" />
                </div>
              </div>

              <CardContent className="p-5 space-y-4">
                <div className="text-center">
                  <p className="text-xs font-semibold uppercase tracking-wider text-secondary">
                    {t.nfts.globalCredential}
                  </p>
                </div>

                <div className="space-y-2.5">
                  <div className="flex items-center justify-between text-sm">
                    <span className="flex items-center gap-1.5 text-muted-foreground">
                      <GraduationCap className="h-3.5 w-3.5" />
                      {locale === 'es' ? 'Estudiante' : 'Student'}
                    </span>
                    <span className="font-medium text-foreground">{cert.studentName}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="flex items-center gap-1.5 text-muted-foreground">
                      <CalendarDays className="h-3.5 w-3.5" />
                      {t.nfts.completionDate}
                    </span>
                    <span className="font-medium text-foreground">{cert.completionDate}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="flex items-center gap-1.5 text-muted-foreground">
                      <Award className="h-3.5 w-3.5" />
                      {t.nfts.grade}
                    </span>
                    <span className="font-bold text-success">{cert.grade}</span>
                  </div>
                </div>

                <div className="rounded-lg bg-muted p-3">
                  <p className="text-[10px] font-medium text-muted-foreground mb-1">{t.nfts.mintAddress}</p>
                  <p className="font-mono text-xs text-foreground">{cert.mintAddress}</p>
                </div>

                <button className="flex w-full items-center justify-center gap-2 rounded-lg border border-border bg-card py-2 text-xs font-medium text-muted-foreground transition-base hover:bg-muted hover:text-foreground">
                  <ExternalLink className="h-3 w-3" />
                  {t.nfts.verifyOnChain}
                </button>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
