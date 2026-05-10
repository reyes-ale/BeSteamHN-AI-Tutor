import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useI18n } from '@/lib/i18n';
import { useAuth } from '@/lib/auth';
import { GraduationCap, Mail, Lock, User, Eye, EyeOff, ArrowRight, Globe, Loader2, BookOpen } from 'lucide-react';

const AVATARS = ['🧑‍💻', '👩‍🎓', '🧑‍🚀', '👩‍🔬', '🧑‍🎨', '👩‍💼', '🧑‍🏫', '👩‍🏫'];

const C = {
  primary: '#e8647a',
  orange:  '#f4855c',
  light:   '#fce7f3',
  bg:      '#fff8f6',
  navy:    '#1e1b4b',
  gray:    '#6b7280',
  muted:   '#9ca3af',
  border:  '#fce7f3',
};

const inputStyle = (focused: boolean): React.CSSProperties => ({
  width: '100%', boxSizing: 'border-box' as const,
  padding: '11px 14px 11px 42px', borderRadius: 12,
  border: `1.5px solid ${focused ? C.primary : C.border}`, background: 'white',
  fontSize: 14, color: C.navy, outline: 'none',
  transition: 'border-color 0.18s',
});

export default function SignUp() {
  const { locale, setLocale } = useI18n();
  const { signUp } = useAuth();
  const navigate = useNavigate();

  const [name,            setName]            = useState('');
  const [email,           setEmail]           = useState('');
  const [password,        setPassword]        = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword,    setShowPassword]    = useState(false);
  const [error,           setError]           = useState('');
  const [loading,         setLoading]         = useState(false);
  const [selectedAvatar,  setSelectedAvatar]  = useState(0);
  const [role,            setRole]            = useState<'student' | 'educator'>('student');
  const [focused,         setFocused]         = useState<string | null>(null);

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

  const labelStyle: React.CSSProperties = {
    display: 'block', fontSize: 11, fontWeight: 700, color: C.gray,
    marginBottom: 7, textTransform: 'uppercase', letterSpacing: '0.04em',
  };

  const iconStyle: React.CSSProperties = {
    position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)',
    width: 16, height: 16, color: C.primary,
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', fontFamily: "'Inter', system-ui, sans-serif" }}>

      {/* ── Left panel ── */}
      <div style={{
        width: '42%', flexDirection: 'column', justifyContent: 'space-between',
        padding: '48px', position: 'relative', overflow: 'hidden',
        background: 'linear-gradient(145deg, #e8647a 0%, #f4855c 100%)',
      }} className="hidden lg:flex">
        <div style={{ position: 'absolute', top: -80, right: -80, width: 240, height: 240, borderRadius: '50%', background: 'rgba(255,255,255,0.10)' }} />
        <div style={{ position: 'absolute', bottom: -60, left: -60, width: 180, height: 180, borderRadius: '50%', background: 'rgba(255,255,255,0.08)' }} />

        {/* Logo */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, position: 'relative', zIndex: 1 }}>
          <div style={{ width: 40, height: 40, borderRadius: 12, background: 'rgba(255,255,255,0.22)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <GraduationCap style={{ width: 22, height: 22, color: 'white' }} />
          </div>
          <span style={{ fontSize: 18, fontWeight: 800, color: 'white', letterSpacing: '-0.01em' }}>BESTEAMHN</span>
        </div>

        {/* Content */}
        <div style={{ position: 'relative', zIndex: 1 }}>
          {/* Avatar preview */}
          <div style={{
            width: 80, height: 80, borderRadius: '50%',
            background: 'rgba(255,255,255,0.22)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 40, marginBottom: 28,
            boxShadow: '0 8px 32px rgba(0,0,0,0.10)',
          }}>
            {AVATARS[selectedAvatar]}
          </div>

          <h1 style={{ fontSize: 34, fontWeight: 800, color: 'white', lineHeight: 1.15, letterSpacing: '-0.02em', marginBottom: 14 }}>
            {locale === 'es' ? 'Comienza tu viaje de aprendizaje hoy' : 'Start your learning journey today'}
          </h1>
          <p style={{ fontSize: 14, color: 'rgba(255,255,255,0.72)', lineHeight: 1.65, maxWidth: 320 }}>
            {locale === 'es'
              ? 'Aprende con IA, gana certificados NFT y transforma tu futuro.'
              : 'Learn with AI, earn NFT certificates and transform your future.'}
          </p>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 10, marginTop: 28 }}>
            {[
              { val: '500+', label: locale === 'es' ? 'Estudiantes' : 'Students' },
              { val: '24',   label: locale === 'es' ? 'Cursos'      : 'Courses'  },
              { val: '120+', label: 'NFTs' },
            ].map((s) => (
              <div key={s.label} style={{ padding: '12px', borderRadius: 12, background: 'rgba(255,255,255,0.16)', textAlign: 'center' }}>
                <p style={{ fontSize: 18, fontWeight: 800, color: 'white', lineHeight: 1 }}>{s.val}</p>
                <p style={{ fontSize: 9, color: 'rgba(255,255,255,0.60)', marginTop: 4 }}>{s.label}</p>
              </div>
            ))}
          </div>
        </div>

        <p style={{ fontSize: 11, color: 'rgba(255,255,255,0.40)', position: 'relative', zIndex: 1 }}>© 2026 BESTEAMHN · Honduras</p>
      </div>

      {/* ── Right panel — form ── */}
      <div style={{
        flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center',
        justifyContent: 'center', padding: '40px 24px', background: C.bg, position: 'relative', overflowY: 'auto',
      }}>
        {/* Language toggle */}
        <div style={{ position: 'absolute', top: 20, right: 20 }}>
          <button
            onClick={() => setLocale(locale === 'es' ? 'en' : 'es')}
            style={{
              display: 'flex', alignItems: 'center', gap: 6,
              padding: '7px 14px', borderRadius: 10,
              background: 'white', border: `1px solid ${C.border}`,
              fontSize: 12, fontWeight: 600, color: C.gray, cursor: 'pointer',
              boxShadow: '0 2px 8px rgba(232,100,122,0.08)',
            }}
          >
            <Globe style={{ width: 13, height: 13, color: C.primary }} />
            {locale === 'es' ? '🇭🇳 ES' : '🇺🇸 EN'}
          </button>
        </div>

        <div style={{ width: '100%', maxWidth: 380, paddingTop: 20, paddingBottom: 20 }}>

          {/* Mobile logo */}
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: 28 }} className="lg:hidden">
            <div style={{
              width: 52, height: 52, borderRadius: 16,
              background: 'linear-gradient(135deg, #e8647a, #f4855c)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              boxShadow: '0 8px 24px rgba(232,100,122,0.30)',
            }}>
              <GraduationCap style={{ width: 28, height: 28, color: 'white' }} />
            </div>
            <p style={{ marginTop: 10, fontSize: 15, fontWeight: 800, color: C.navy }}>BESTEAMHN AI Tutor</p>
          </div>

          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '4px 12px', borderRadius: 99, background: C.light, marginBottom: 14 }}>
            <span style={{ fontSize: 11, fontWeight: 700, color: C.primary, letterSpacing: '0.04em' }}>
              {locale === 'es' ? '✨ ÚNETE GRATIS' : '✨ JOIN FREE'}
            </span>
          </div>
          <h2 style={{ fontSize: 26, fontWeight: 800, color: C.navy, marginBottom: 6 }}>
            {locale === 'es' ? 'Crear Cuenta' : 'Create Account'}
          </h2>
          <p style={{ fontSize: 13, color: C.muted, marginBottom: 26 }}>
            {locale === 'es' ? 'Únete a la comunidad BESTEAMHN' : 'Join the BESTEAMHN community'}
          </p>

          {/* Avatar picker */}
          <div style={{ marginBottom: 22 }}>
            <p style={labelStyle}>{locale === 'es' ? 'Elige tu Avatar' : 'Choose Your Avatar'}</p>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(8,1fr)', gap: 6 }}>
              {AVATARS.map((av, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => setSelectedAvatar(i)}
                  style={{
                    width: 40, height: 40, borderRadius: 10, fontSize: 18, cursor: 'pointer',
                    border: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center',
                    background: selectedAvatar === i ? 'linear-gradient(135deg, #e8647a, #f4855c)' : '#fce7f3',
                    transform: selectedAvatar === i ? 'scale(1.12)' : 'scale(1)',
                    boxShadow: selectedAvatar === i ? '0 4px 14px rgba(232,100,122,0.35)' : 'none',
                    transition: 'all 0.18s',
                  }}
                >
                  {av}
                </button>
              ))}
            </div>
          </div>

          {/* Role picker */}
          <div style={{ marginBottom: 22 }}>
            <p style={labelStyle}>{locale === 'es' ? 'Soy...' : 'I am a...'}</p>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
              {([
                { value: 'student' as const,  Icon: GraduationCap, label: locale === 'es' ? 'Estudiante' : 'Student',  desc: locale === 'es' ? 'Aprendo y gano STEAM' : 'I learn and earn STEAM' },
                { value: 'educator' as const, Icon: BookOpen,      label: locale === 'es' ? 'Educador'   : 'Educator', desc: locale === 'es' ? 'Enseño y creo cursos' : 'I teach and create courses' },
              ]).map((opt) => (
                <button
                  key={opt.value}
                  type="button"
                  onClick={() => setRole(opt.value)}
                  style={{
                    display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6,
                    padding: '16px 12px', borderRadius: 14, cursor: 'pointer',
                    border: `2px solid ${role === opt.value ? C.primary : C.border}`,
                    background: role === opt.value ? C.light : 'white',
                    transition: 'all 0.18s',
                  }}
                >
                  <div style={{
                    width: 36, height: 36, borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center',
                    background: role === opt.value ? 'linear-gradient(135deg, #e8647a, #f4855c)' : '#f3f4f6',
                  }}>
                    <opt.Icon style={{ width: 16, height: 16, color: role === opt.value ? 'white' : '#9ca3af' }} />
                  </div>
                  <p style={{ fontSize: 12, fontWeight: 700, color: role === opt.value ? C.primary : C.gray }}>{opt.label}</p>
                  <p style={{ fontSize: 10, color: C.muted, textAlign: 'center', lineHeight: 1.4 }}>{opt.desc}</p>
                </button>
              ))}
            </div>
          </div>

          {/* Error */}
          {error && (
            <div style={{ marginBottom: 18, padding: '12px 16px', borderRadius: 12, background: '#fff1f2', border: '1px solid #fecdd3', fontSize: 13, color: '#e11d48' }}>
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            {/* Name */}
            <div>
              <label style={labelStyle}>{locale === 'es' ? 'Nombre Completo' : 'Full Name'}</label>
              <div style={{ position: 'relative' }}>
                <User style={iconStyle} />
                <input
                  type="text" value={name} onChange={(e) => setName(e.target.value)}
                  required minLength={2}
                  placeholder={locale === 'es' ? 'María García' : 'Jane Smith'}
                  style={inputStyle(focused === 'name')}
                  onFocus={() => setFocused('name')} onBlur={() => setFocused(null)}
                />
              </div>
            </div>

            {/* Email */}
            <div>
              <label style={labelStyle}>{locale === 'es' ? 'Correo Electrónico' : 'Email'}</label>
              <div style={{ position: 'relative' }}>
                <Mail style={iconStyle} />
                <input
                  type="email" value={email} onChange={(e) => setEmail(e.target.value)}
                  required placeholder={locale === 'es' ? 'tu@correo.com' : 'you@email.com'}
                  style={inputStyle(focused === 'email')}
                  onFocus={() => setFocused('email')} onBlur={() => setFocused(null)}
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label style={labelStyle}>{locale === 'es' ? 'Contraseña' : 'Password'}</label>
              <div style={{ position: 'relative' }}>
                <Lock style={iconStyle} />
                <input
                  type={showPassword ? 'text' : 'password'} value={password}
                  onChange={(e) => setPassword(e.target.value)} required minLength={6}
                  placeholder="••••••••"
                  style={{ ...inputStyle(focused === 'pw'), paddingRight: 42 }}
                  onFocus={() => setFocused('pw')} onBlur={() => setFocused(null)}
                />
                <button type="button" onClick={() => setShowPassword(!showPassword)}
                  style={{ position: 'absolute', right: 14, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: C.muted, padding: 0 }}>
                  {showPassword ? <EyeOff style={{ width: 16, height: 16 }} /> : <Eye style={{ width: 16, height: 16 }} />}
                </button>
              </div>
            </div>

            {/* Confirm password */}
            <div>
              <label style={labelStyle}>{locale === 'es' ? 'Confirmar Contraseña' : 'Confirm Password'}</label>
              <div style={{ position: 'relative' }}>
                <Lock style={iconStyle} />
                <input
                  type={showPassword ? 'text' : 'password'} value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)} required minLength={6}
                  placeholder="••••••••"
                  style={inputStyle(focused === 'cpw')}
                  onFocus={() => setFocused('cpw')} onBlur={() => setFocused(null)}
                />
              </div>
            </div>

            {/* Submit */}
            <button
              type="submit" disabled={loading}
              style={{
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
                width: '100%', padding: '13px', borderRadius: 99, border: 'none',
                background: loading ? '#f4a3b3' : 'linear-gradient(135deg, #e8647a, #f4855c)',
                color: 'white', fontSize: 14, fontWeight: 800, cursor: loading ? 'not-allowed' : 'pointer',
                boxShadow: '0 6px 24px rgba(232,100,122,0.35)', marginTop: 4,
              }}
            >
              {loading
                ? <Loader2 style={{ width: 18, height: 18, animation: 'spin 1s linear infinite' }} />
                : <>{locale === 'es' ? 'Crear Cuenta' : 'Create Account'} <ArrowRight style={{ width: 16, height: 16 }} /></>
              }
            </button>
          </form>

          <div style={{ margin: '24px 0 0', height: 3, borderRadius: 99, background: 'linear-gradient(90deg, #e8647a, #f4855c, #e8647a)' }} />

          <p style={{ marginTop: 18, textAlign: 'center', fontSize: 13, color: C.muted }}>
            {locale === 'es' ? '¿Ya tienes cuenta?' : 'Already have an account?'}{' '}
            <Link to="/signin" style={{ fontWeight: 700, color: C.primary, textDecoration: 'none' }}>
              {locale === 'es' ? 'Inicia Sesión' : 'Sign In'}
            </Link>
          </p>
          <div style={{ marginTop: 10, textAlign: 'center' }}>
            <Link to="/" style={{ fontSize: 12, color: '#c4b5c0', textDecoration: 'none' }}>
              {locale === 'es' ? '← Volver al inicio' : '← Back to home'}
            </Link>
          </div>
        </div>
      </div>

      <style>{`@keyframes spin { to { transform: rotate(360deg); } } .hidden { display: none !important; } @media(min-width:1024px){ .hidden { display: flex !important; } .lg\\:hidden { display: none !important; } }`}</style>
    </div>
  );
}
