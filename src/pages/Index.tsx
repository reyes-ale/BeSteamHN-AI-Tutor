import React from 'react';
import { Link } from 'react-router-dom';
import { useI18n } from '@/lib/i18n';
import { useWallet } from '@solana/wallet-adapter-react';
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';
import {
  GraduationCap,
  Bot,
  Award,
  Coins,
  Globe,
  Users,
  ArrowRight,
  ShieldCheck,
  BookOpen,
  Rocket,
} from 'lucide-react';

export default function Index() {
  const { t, locale, setLocale } = useI18n();
  const { connected } = useWallet();

  const features = [
    {
      icon: Bot,
      title: locale === 'es' ? 'Tutor IA Personalizado' : 'Personalized AI Tutor',
      desc: locale === 'es'
        ? 'Aprende con un tutor IA bilingüe que se adapta a tu ritmo'
        : 'Learn with a bilingual AI tutor that adapts to your pace',
    },
    {
      icon: Award,
      title: locale === 'es' ? 'Certificados NFT' : 'NFT Certificates',
      desc: locale === 'es'
        ? 'Obtén credenciales verificables en la blockchain de Solana'
        : 'Earn verifiable credentials on the Solana blockchain',
    },
    {
      icon: Coins,
      title: locale === 'es' ? 'Tokens STEAM' : 'STEAM Tokens',
      desc: locale === 'es'
        ? 'Gana tokens por completar lecciones y cursos'
        : 'Earn tokens for completing lessons and courses',
    },
    {
      icon: Globe,
      title: locale === 'es' ? 'Escala Global' : 'Global Scale',
      desc: locale === 'es'
        ? 'Comenzamos en Honduras, escalamos al mundo'
        : 'Starting in Honduras, scaling to the world',
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Nav */}
      <nav className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between border-b border-border bg-card/80 px-8 py-3 backdrop-blur-md">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-accent">
            <GraduationCap className="h-5 w-5 text-accent-foreground" />
          </div>
          <span className="text-lg font-bold text-foreground">BESTEAMHN</span>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => setLocale(locale === 'es' ? 'en' : 'es')}
            className="flex items-center gap-1.5 rounded-lg border border-border px-3 py-1.5 text-sm font-medium text-foreground transition-base hover:bg-muted"
          >
            <Globe className="h-4 w-4 text-muted-foreground" />
            {locale === 'es' ? '🇭🇳 ES' : '🇺🇸 EN'}
          </button>
          {connected ? (
            <Link
              to="/dashboard"
              className="flex items-center gap-2 rounded-lg bg-gradient-accent px-4 py-2 text-sm font-semibold text-accent-foreground transition-base hover:opacity-90"
            >
              {t.nav.dashboard} <ArrowRight className="h-4 w-4" />
            </Link>
          ) : (
            <WalletMultiButton />
          )}
        </div>
      </nav>

      {/* Hero */}
      <section className="relative flex min-h-screen items-center justify-center overflow-hidden pt-16">
        <div className="absolute inset-0 bg-gradient-hero" />
        <div className="absolute inset-0">
          <div className="absolute left-1/4 top-1/4 h-72 w-72 rounded-full bg-secondary/10 blur-3xl" />
          <div className="absolute right-1/4 bottom-1/4 h-96 w-96 rounded-full bg-secondary/5 blur-3xl" />
        </div>
        <div className="relative z-10 max-w-3xl text-center px-6">
          <div className="mb-6 inline-flex items-center gap-2 rounded-full bg-primary-foreground/10 px-4 py-2 backdrop-blur-sm">
            <ShieldCheck className="h-4 w-4 text-secondary" />
            <span className="text-xs font-medium text-primary-foreground/80">
              {locale === 'es' ? 'Impulsado por Solana' : 'Powered by Solana'}
            </span>
          </div>
          <h1 className="text-5xl font-extrabold leading-tight text-primary-foreground">
            {locale === 'es'
              ? 'Educación de Clase Mundial para Todos'
              : 'World-Class Education for All'}
          </h1>
          <p className="mx-auto mt-5 max-w-xl text-base leading-relaxed text-primary-foreground/70">
            {t.common.mission}
          </p>
          <div className="mt-8 flex items-center justify-center gap-4">
            {connected ? (
              <Link
                to="/dashboard"
                className="flex items-center gap-2 rounded-xl bg-secondary px-6 py-3 text-sm font-bold text-secondary-foreground shadow-glow transition-base hover:opacity-90"
              >
                <Rocket className="h-4 w-4" />
                {locale === 'es' ? 'Ir al Panel' : 'Go to Dashboard'}
              </Link>
            ) : (
              <WalletMultiButton />
            )}
            <Link
              to="/courses"
              className="flex items-center gap-2 rounded-xl border border-primary-foreground/20 px-6 py-3 text-sm font-semibold text-primary-foreground transition-base hover:bg-primary-foreground/10"
            >
              <BookOpen className="h-4 w-4" />
              {locale === 'es' ? 'Ver Cursos' : 'Browse Courses'}
            </Link>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-20 px-8">
        <div className="mx-auto max-w-5xl">
          <h2 className="text-center text-3xl font-bold text-foreground">
            {locale === 'es' ? '¿Por qué BESTEAMHN?' : 'Why BESTEAMHN?'}
          </h2>
          <p className="mx-auto mt-3 max-w-xl text-center text-sm text-muted-foreground">
            {locale === 'es'
              ? 'Combinamos inteligencia artificial con blockchain para crear el futuro de la educación'
              : 'We combine AI with blockchain to create the future of education'}
          </p>
          <div className="mt-12 grid grid-cols-4 gap-6">
            {features.map((feat) => (
              <div
                key={feat.title}
                className="group rounded-2xl border border-border bg-card p-6 shadow-theme-sm transition-base hover:shadow-theme-lg hover:border-secondary/30"
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-secondary/10 transition-base group-hover:bg-gradient-accent">
                  <feat.icon className="h-6 w-6 text-secondary transition-base group-hover:text-accent-foreground" />
                </div>
                <h3 className="mt-4 text-base font-bold text-foreground">{feat.title}</h3>
                <p className="mt-2 text-sm text-muted-foreground leading-relaxed">{feat.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="bg-gradient-hero py-16">
        <div className="mx-auto flex max-w-4xl items-center justify-around">
          {[
            { value: '500+', label: locale === 'es' ? 'Estudiantes' : 'Students', icon: Users },
            { value: '8', label: locale === 'es' ? 'Cursos' : 'Courses', icon: BookOpen },
            { value: '12,450', label: 'STEAM', icon: Coins },
            { value: '150+', label: locale === 'es' ? 'Certificados NFT' : 'NFT Certificates', icon: Award },
          ].map((stat) => (
            <div key={stat.label} className="text-center">
              <stat.icon className="mx-auto h-6 w-6 text-secondary mb-2" />
              <p className="text-3xl font-extrabold text-primary-foreground">{stat.value}</p>
              <p className="mt-1 text-sm text-primary-foreground/60">{stat.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border bg-card py-8 px-8">
        <div className="mx-auto flex max-w-5xl items-center justify-between">
          <div className="flex items-center gap-2">
            <GraduationCap className="h-5 w-5 text-secondary" />
            <span className="text-sm font-bold text-foreground">BESTEAMHN AI Tutor</span>
          </div>
          <p className="text-xs text-muted-foreground">
            {locale === 'es'
              ? '2026 BESTEAMHN. Una ONG educativa en Honduras.'
              : '2026 BESTEAMHN. An educational NGO in Honduras.'}
          </p>
        </div>
      </footer>
    </div>
  );
}
