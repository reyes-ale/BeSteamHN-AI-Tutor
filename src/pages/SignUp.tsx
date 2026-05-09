import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useI18n } from '@/lib/i18n';
import { useAuth } from '@/lib/auth';
import { GraduationCap, Mail, Lock, User, Eye, EyeOff, ArrowRight, Globe, Loader2, Sparkles, BookOpen } from 'lucide-react';

const AVATARS = ['🧑‍💻', '👩‍🎓', '🧑‍🚀', '👩‍🔬', '🧑‍🎨', '👩‍💼', '🧑‍🏫', '👩‍🏫'];

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
  const [selectedAvatar, setSelectedAvatar] = useState(0);
  const [role, setRole] = useState<'student' | 'educator'>('student');

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
    const result = await signUp(name, email, password, role);
    setLoading(false);

    if (result.success) {
      navigate('/dashboard');
    } else {
      setError(result.error || (locale === 'es' ? 'Error al registrarse' : 'Sign up failed'));
    }
  };

  return (
    <div className="flex min-h-screen bg-gradient-app">
      {/* Background blobs */}
      <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
        <div className="absolute -top-32 -left-32 h-96 w-96 rounded-full bg-violet-300/25 blur-3xl" />
        <div className="absolute bottom-0 -right-32 h-96 w-96 rounded-full bg-pink-300/25 blur-3xl" />
      </div>

      {/* Left Panel — Branding + Avatar preview */}
      <div className="hidden lg:flex lg:w-[45%] flex-col justify-between p-12 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-violet-500 via-indigo-500 to-indigo-600 rounded-r-[3rem]" />
        {/* Decorative circles */}
        <div className="absolute top-0 right-0 h-64 w-64 rounded-full bg-white/5 -translate-y-1/3 translate-x-1/3" />
        <div className="absolute bottom-0 left-0 h-48 w-48 rounded-full bg-white/5 translate-y-1/3 -translate-x-1/3" />

        <div className="relative z-10">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/20 backdrop-blur-sm">
              <GraduationCap className="h-6 w-6 text-white" />
            </div>
            <span className="text-xl font-bold text-white tracking-tight">BESTEAMHN</span>
          </div>
        </div>

        <div className="relative z-10 max-w-sm">
          {/* Avatar display */}
          <div className="mb-8 flex items-center justify-center">
            <div className="flex h-24 w-24 items-center justify-center rounded-full bg-white/20 backdrop-blur-sm text-5xl shadow-2xl ring-4 ring-white/30">
              {AVATARS[selectedAvatar]}
            </div>
          </div>

          <h1 className="text-3xl font-extrabold leading-tight text-white">
            {locale === 'es' ? 'Comienza tu viaje de aprendizaje hoy' : 'Start your learning journey today'}
          </h1>
          <p className="mt-4 text-sm leading-relaxed text-white/70">
            {t.common.mission}
          </p>
          <div className="mt-8 grid grid-cols-3 gap-4">
            {[
              { value: '500+', label: locale === 'es' ? 'Estudiantes' : 'Students' },
              { value: '8', label: locale === 'es' ? 'Cursos' : 'Courses' },
              { value: '150+', label: 'NFTs' },
            ].map((stat) => (
              <div key={stat.label} className="rounded-2xl bg-white/10 backdrop-blur-sm p-4 text-center border border-white/20">
                <p className="text-xl font-bold text-white">{stat.value}</p>
                <p className="text-[10px] text-white/60 mt-0.5">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="relative z-10 flex items-center gap-4 text-white/40 text-sm">
          <span>© 2026 BESTEAMHN</span>
          <span>·</span>
          <span>Honduras</span>
        </div>
      </div>

      {/* Right Panel — Form */}
      <div className="flex flex-1 flex-col items-center justify-center px-6 py-10">
        {/* Language toggle */}
        <div className="absolute top-6 right-6">
          <button
            onClick={() => setLocale(locale === 'es' ? 'en' : 'es')}
            className="flex items-center gap-1.5 rounded-xl border border-white/50 bg-white/60 px-3 py-1.5 text-sm font-medium text-gray-700 backdrop-blur-sm transition-base hover:bg-white/80"
          >
            <Globe className="h-4 w-4 text-violet-400" />
            {locale === 'es' ? '🇭🇳 ES' : '🇺🇸 EN'}
          </button>
        </div>

        <div className="w-full max-w-sm">
          {/* Mobile logo */}
          <div className="mb-8 flex flex-col items-center lg:hidden">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-violet-500 to-indigo-600 shadow-lg shadow-violet-200">
              <GraduationCap className="h-7 w-7 text-white" />
            </div>
            <h2 className="mt-3 text-lg font-bold text-gray-900">BESTEAMHN AI Tutor</h2>
          </div>

          {/* Card header */}
          <div className="mb-6">
            <div className="inline-flex items-center gap-1.5 rounded-full bg-violet-100 px-3 py-1 mb-3">
              <Sparkles className="h-3 w-3 text-violet-600" />
              <span className="text-[11px] font-semibold text-violet-700 uppercase tracking-wide">
                {locale === 'es' ? 'Únete Gratis' : 'Join Free'}
              </span>
            </div>
            <h2 className="text-2xl font-bold text-gray-900">
              {locale === 'es' ? 'Crear Cuenta' : 'Create Account'}
            </h2>
            <p className="mt-1 text-sm text-gray-500">
              {locale === 'es' ? 'Únete a la comunidad BESTEAMHN' : 'Join the BESTEAMHN community'}
            </p>
          </div>

          {/* Avatar Selector */}
          <div className="mb-6">
            <p className="text-xs font-semibold text-gray-500 mb-2 uppercase tracking-wide">
              {locale === 'es' ? 'Elige tu Avatar' : 'Choose Your Avatar'}
            </p>
            <div className="grid grid-cols-8 gap-1.5">
              {AVATARS.map((av, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => setSelectedAvatar(i)}
                  className={`flex h-10 w-10 items-center justify-center rounded-xl text-xl transition-all duration-200 ${
                    selectedAvatar === i
                      ? 'bg-gradient-to-br from-violet-500 to-indigo-600 scale-110 shadow-md shadow-violet-200'
                      : 'bg-gray-100 hover:bg-violet-50 hover:scale-105'
                  }`}
                >
                  {av}
                </button>
              ))}
            </div>
          </div>

          {/* Role Selector */}
          <div className="mb-6">
            <p className="text-xs font-semibold text-gray-500 mb-2 uppercase tracking-wide">
              {locale === 'es' ? 'Soy...' : 'I am a...'}
            </p>
            <div className="grid grid-cols-2 gap-3">
              {([
                { value: 'student', icon: GraduationCap, label: locale === 'es' ? 'Estudiante' : 'Student', desc: locale === 'es' ? 'Aprendo y gano STEAM' : 'I learn and earn STEAM' },
                { value: 'educator', icon: BookOpen, label: locale === 'es' ? 'Educador' : 'Educator', desc: locale === 'es' ? 'Enseño y creo cursos' : 'I teach and create courses' },
              ] as const).map((opt) => (
                <button
                  key={opt.value}
                  type="button"
                  onClick={() => setRole(opt.value)}
                  className={`flex flex-col items-center gap-1.5 rounded-2xl border-2 px-3 py-4 text-center transition-all duration-200 ${
                    role === opt.value
                      ? 'border-violet-400 bg-violet-50 shadow-sm shadow-violet-100'
                      : 'border-white/60 bg-white/50 hover:border-violet-200 hover:bg-violet-50/50'
                  }`}
                >
                  <div className={`flex h-9 w-9 items-center justify-center rounded-xl ${role === opt.value ? 'bg-gradient-to-br from-violet-500 to-indigo-600' : 'bg-gray-100'}`}>
                    <opt.icon className={`h-4 w-4 ${role === opt.value ? 'text-white' : 'text-gray-400'}`} />
                  </div>
                  <p className={`text-xs font-bold ${role === opt.value ? 'text-violet-700' : 'text-gray-600'}`}>{opt.label}</p>
                  <p className="text-[10px] text-gray-400 leading-tight">{opt.desc}</p>
                </button>
              ))}
            </div>
          </div>

          {error && (
            <div className="mb-4 rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-600">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1.5">
                {locale === 'es' ? 'Nombre Completo' : 'Full Name'}
              </label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  minLength={2}
                  placeholder={locale === 'es' ? 'María García' : 'Jane Smith'}
                  className="w-full rounded-xl border border-white/60 bg-white/70 pl-10 pr-4 py-2.5 text-sm text-gray-800 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-violet-300 backdrop-blur-sm transition-base"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1.5">
                {locale === 'es' ? 'Correo Electrónico' : 'Email'}
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  placeholder={locale === 'es' ? 'tu@correo.com' : 'you@email.com'}
                  className="w-full rounded-xl border border-white/60 bg-white/70 pl-10 pr-4 py-2.5 text-sm text-gray-800 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-violet-300 backdrop-blur-sm transition-base"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1.5">
                {locale === 'es' ? 'Contraseña' : 'Password'}
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  minLength={6}
                  placeholder="••••••••"
                  className="w-full rounded-xl border border-white/60 bg-white/70 pl-10 pr-10 py-2.5 text-sm text-gray-800 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-violet-300 backdrop-blur-sm transition-base"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-700"
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1.5">
                {locale === 'es' ? 'Confirmar Contraseña' : 'Confirm Password'}
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                  minLength={6}
                  placeholder="••••••••"
                  className="w-full rounded-xl border border-white/60 bg-white/70 pl-10 pr-4 py-2.5 text-sm text-gray-800 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-violet-300 backdrop-blur-sm transition-base"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="flex w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-violet-500 to-indigo-600 py-3 text-sm font-bold text-white shadow-lg shadow-violet-200/60 transition-base hover:opacity-90 hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed mt-2"
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

          <p className="mt-5 text-center text-sm text-gray-500">
            {locale === 'es' ? '¿Ya tienes cuenta?' : 'Already have an account?'}{' '}
            <Link to="/signin" className="font-semibold text-violet-600 hover:underline">
              {locale === 'es' ? 'Inicia Sesión' : 'Sign In'}
            </Link>
          </p>

          <div className="mt-3 text-center">
            <Link to="/" className="text-xs text-gray-400 hover:text-gray-700 transition-base">
              {locale === 'es' ? '← Volver al inicio' : '← Back to home'}
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
