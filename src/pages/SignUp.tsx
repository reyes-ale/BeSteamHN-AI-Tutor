import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useI18n } from '@/lib/i18n';
import { useAuth } from '@/lib/auth';
import { GraduationCap, Mail, Lock, User, Eye, EyeOff, ArrowRight, Globe, Loader2 } from 'lucide-react';

export default function SignUp() {
  const { t, locale, setLocale } = useI18n();
  const { signUp } = useAuth();
  const navigate = useNavigate();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (password !== confirmPassword) {
      setError(locale === 'es' ? 'Las contraseñas no coinciden' : 'Passwords do not match');
      return;
    }

    if (password.length < 6) {
      setError(locale === 'es' ? 'La contraseña debe tener al menos 6 caracteres' : 'Password must be at least 6 characters');
      return;
    }

    setLoading(true);
    const result = await signUp(name, email, password);
    setLoading(false);

    if (result.success) {
      navigate('/dashboard');
    } else {
      setError(result.error || (locale === 'es' ? 'Error al registrarse' : 'Sign up failed'));
    }
  };

  return (
    <div className="flex min-h-screen">
      {/* Left Panel - Branding */}
      <div className="hidden lg:flex lg:w-1/2 flex-col justify-between bg-gradient-hero p-12">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-secondary">
            <GraduationCap className="h-6 w-6 text-secondary-foreground" />
          </div>
          <span className="text-xl font-bold text-primary-foreground">BESTEAMHN</span>
        </div>

        <div className="max-w-md">
          <h1 className="text-4xl font-extrabold leading-tight text-primary-foreground">
            {locale === 'es'
              ? 'Comienza tu viaje de aprendizaje hoy'
              : 'Start your learning journey today'}
          </h1>
          <p className="mt-4 text-base leading-relaxed text-primary-foreground/60">
            {t.common.mission}
          </p>
          <div className="mt-8 grid grid-cols-3 gap-4">
            {[
              { value: '500+', label: locale === 'es' ? 'Estudiantes' : 'Students' },
              { value: '8', label: locale === 'es' ? 'Cursos' : 'Courses' },
              { value: '150+', label: 'NFTs' },
            ].map((stat) => (
              <div key={stat.label} className="rounded-xl bg-primary-foreground/5 p-3 text-center backdrop-blur-sm">
                <p className="text-xl font-bold text-primary-foreground">{stat.value}</p>
                <p className="text-[10px] text-primary-foreground/50">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="flex items-center gap-6 text-primary-foreground/40">
          <span className="text-sm">2026 BESTEAMHN</span>
          <span className="text-sm">Honduras</span>
        </div>
      </div>

      {/* Right Panel - Form */}
      <div className="flex flex-1 flex-col items-center justify-center bg-background px-6">
        {/* Language toggle */}
        <div className="absolute top-6 right-6">
          <button
            onClick={() => setLocale(locale === 'es' ? 'en' : 'es')}
            className="flex items-center gap-1.5 rounded-lg border border-border px-3 py-1.5 text-sm font-medium text-foreground transition-base hover:bg-muted"
          >
            <Globe className="h-4 w-4 text-muted-foreground" />
            {locale === 'es' ? '🇭🇳 ES' : '🇺🇸 EN'}
          </button>
        </div>

        <div className="w-full max-w-sm">
          {/* Mobile logo */}
          <div className="mb-8 flex flex-col items-center lg:hidden">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-accent">
              <GraduationCap className="h-7 w-7 text-accent-foreground" />
            </div>
            <h2 className="mt-3 text-lg font-bold text-foreground">BESTEAMHN AI Tutor</h2>
          </div>

          <h2 className="text-2xl font-bold text-foreground">
            {locale === 'es' ? 'Crear Cuenta' : 'Create Account'}
          </h2>
          <p className="mt-1 text-sm text-muted-foreground">
            {locale === 'es'
              ? 'Únete a la comunidad BESTEAMHN'
              : 'Join the BESTEAMHN community'}
          </p>

          {error && (
            <div className="mt-4 rounded-lg border border-destructive/20 bg-destructive/5 px-4 py-3 text-sm text-destructive">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="mt-6 space-y-4">
            <div>
              <label className="block text-xs font-medium text-muted-foreground mb-1.5">
                {locale === 'es' ? 'Nombre Completo' : 'Full Name'}
              </label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  minLength={2}
                  placeholder={locale === 'es' ? 'María García' : 'Jane Smith'}
                  className="w-full rounded-lg border border-input bg-card pl-10 pr-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-secondary/50 transition-base"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-muted-foreground mb-1.5">
                {locale === 'es' ? 'Correo Electrónico' : 'Email'}
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  placeholder={locale === 'es' ? 'tu@correo.com' : 'you@email.com'}
                  className="w-full rounded-lg border border-input bg-card pl-10 pr-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-secondary/50 transition-base"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-muted-foreground mb-1.5">
                {locale === 'es' ? 'Contraseña' : 'Password'}
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  minLength={6}
                  placeholder="••••••••"
                  className="w-full rounded-lg border border-input bg-card pl-10 pr-10 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-secondary/50 transition-base"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-muted-foreground mb-1.5">
                {locale === 'es' ? 'Confirmar Contraseña' : 'Confirm Password'}
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                  minLength={6}
                  placeholder="••••••••"
                  className="w-full rounded-lg border border-input bg-card pl-10 pr-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-secondary/50 transition-base"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="flex w-full items-center justify-center gap-2 rounded-lg bg-gradient-accent py-2.5 text-sm font-bold text-accent-foreground shadow-theme-md transition-base hover:opacity-90 hover:shadow-glow disabled:opacity-50"
            >
              {loading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <>
                  {locale === 'es' ? 'Crear Cuenta' : 'Create Account'}
                  <ArrowRight className="h-4 w-4" />
                </>
              )}
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-muted-foreground">
            {locale === 'es' ? '¿Ya tienes cuenta?' : 'Already have an account?'}{' '}
            <Link to="/signin" className="font-semibold text-secondary hover:underline">
              {locale === 'es' ? 'Inicia Sesión' : 'Sign In'}
            </Link>
          </p>

          <div className="mt-4 text-center">
            <Link to="/" className="text-xs text-muted-foreground hover:text-foreground transition-base">
              {locale === 'es' ? '← Volver al inicio' : '← Back to home'}
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
