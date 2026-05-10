import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useI18n } from '@/lib/i18n';
import { useAuth } from '@/lib/auth';
import { GraduationCap, Mail, Lock, Eye, EyeOff, ArrowRight, Globe, Loader2 } from 'lucide-react';

export default function SignIn() {
  const { locale, setLocale } = useI18n();
  const { signIn } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    const result = await signIn(email, password);
    setLoading(false);
    if (result.success) {
      navigate('/dashboard');
    } else {
      setError(result.error || (locale === 'es' ? 'Error al iniciar sesión' : 'Sign in failed'));
    }
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', fontFamily: "'Inter', system-ui, sans-serif" }}>

      {/* ── Left panel — branding ── */}
      <div style={{
        display: 'none',
        width: '50%',
        flexDirection: 'column',
        justifyContent: 'space-between',
        padding: '48px',
        background: 'linear-gradient(145deg, #e8647a 0%, #f4855c 100%)',
        position: 'relative',
        overflow: 'hidden',
      }} className="lg:flex lg:flex-col">

        {/* Subtle top-right circle */}
        <div style={{
          position: 'absolute', top: -80, right: -80,
          width: 260, height: 260, borderRadius: '50%',
          background: 'rgba(255,255,255,0.10)',
        }} />
        {/* Subtle bottom-left circle */}
        <div style={{
          position: 'absolute', bottom: -60, left: -60,
          width: 200, height: 200, borderRadius: '50%',
          background: 'rgba(255,255,255,0.08)',
        }} />

        {/* Logo */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, position: 'relative', zIndex: 1 }}>
          <div style={{
            width: 40, height: 40, borderRadius: 12,
            background: 'rgba(255,255,255,0.22)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <GraduationCap style={{ width: 22, height: 22, color: 'white' }} />
          </div>
          <span style={{ fontSize: 18, fontWeight: 800, color: 'white', letterSpacing: '-0.01em' }}>BESTEAMHN</span>
        </div>

        {/* Headline */}
        <div style={{ position: 'relative', zIndex: 1 }}>
          <p style={{
            display: 'inline-block', padding: '4px 14px', borderRadius: 99,
            background: 'rgba(255,255,255,0.20)', color: 'white',
            fontSize: 11, fontWeight: 700, marginBottom: 20, letterSpacing: '0.04em',
          }}>
            {locale === 'es' ? '✨ PLATAFORMA EDUCATIVA' : '✨ EDUCATION PLATFORM'}
          </p>
          <h1 style={{ fontSize: 38, fontWeight: 800, color: 'white', lineHeight: 1.15, letterSpacing: '-0.02em', marginBottom: 16 }}>
            {locale === 'es'
              ? 'Educación de clase mundial para todos'
              : 'World-class education for everyone'}
          </h1>
          <p style={{ fontSize: 15, color: 'rgba(255,255,255,0.78)', lineHeight: 1.65, maxWidth: 360 }}>
            {locale === 'es'
              ? 'Aprende con IA, gana certificados NFT y transforma tu futuro en Honduras.'
              : 'Learn with AI, earn NFT certificates and transform your future in Honduras.'}
          </p>

          {/* Stat pills */}
          <div style={{ display: 'flex', gap: 12, marginTop: 32 }}>
            {[
              { val: '500+', label: locale === 'es' ? 'Estudiantes' : 'Students' },
              { val: '24',   label: locale === 'es' ? 'Cursos'      : 'Courses'  },
              { val: '120+', label: 'NFTs'                                        },
            ].map((s) => (
              <div key={s.label} style={{
                padding: '12px 18px', borderRadius: 14,
                background: 'rgba(255,255,255,0.18)',
                textAlign: 'center',
              }}>
                <p style={{ fontSize: 20, fontWeight: 800, color: 'white', lineHeight: 1 }}>{s.val}</p>
                <p style={{ fontSize: 10, color: 'rgba(255,255,255,0.65)', marginTop: 4 }}>{s.label}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Footer */}
        <p style={{ fontSize: 12, color: 'rgba(255,255,255,0.45)', position: 'relative', zIndex: 1 }}>
          © 2026 BESTEAMHN · Honduras
        </p>
      </div>

      {/* ── Right panel — form ── */}
      <div style={{
        flex: 1,
        display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
        padding: '40px 24px',
        background: '#fff8f6',
        position: 'relative',
      }}>

        {/* Language toggle */}
        <div style={{ position: 'absolute', top: 20, right: 20 }}>
          <button
            onClick={() => setLocale(locale === 'es' ? 'en' : 'es')}
            style={{
              display: 'flex', alignItems: 'center', gap: 6,
              padding: '7px 14px', borderRadius: 10,
              background: 'white', border: '1px solid #fce7f3',
              fontSize: 12, fontWeight: 600, color: '#6b7280', cursor: 'pointer',
              boxShadow: '0 2px 8px rgba(232,100,122,0.08)',
            }}
          >
            <Globe style={{ width: 13, height: 13, color: '#e8647a' }} />
            {locale === 'es' ? '🇭🇳 ES' : '🇺🇸 EN'}
          </button>
        </div>

        <div style={{ width: '100%', maxWidth: 360 }}>

          {/* Mobile logo */}
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: 32 }} className="lg:hidden">
            <div style={{
              width: 52, height: 52, borderRadius: 16,
              background: 'linear-gradient(135deg, #e8647a, #f4855c)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              boxShadow: '0 8px 24px rgba(232,100,122,0.30)',
            }}>
              <GraduationCap style={{ width: 28, height: 28, color: 'white' }} />
            </div>
            <p style={{ marginTop: 10, fontSize: 15, fontWeight: 800, color: '#1e1b4b' }}>BESTEAMHN AI Tutor</p>
          </div>

          {/* Title */}
          <h2 style={{ fontSize: 26, fontWeight: 800, color: '#1e1b4b', marginBottom: 6 }}>
            {locale === 'es' ? 'Iniciar Sesión' : 'Sign In'}
          </h2>
          <p style={{ fontSize: 13, color: '#9ca3af', marginBottom: 28 }}>
            {locale === 'es' ? 'Ingresa tus credenciales para continuar' : 'Enter your credentials to continue'}
          </p>

          {/* Error */}
          {error && (
            <div style={{
              marginBottom: 20, padding: '12px 16px', borderRadius: 12,
              background: '#fff1f2', border: '1px solid #fecdd3',
              fontSize: 13, color: '#e11d48',
            }}>
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
            {/* Email */}
            <div>
              <label style={{ display: 'block', fontSize: 12, fontWeight: 700, color: '#6b7280', marginBottom: 8, textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                {locale === 'es' ? 'Correo Electrónico' : 'Email'}
              </label>
              <div style={{ position: 'relative' }}>
                <Mail style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', width: 16, height: 16, color: '#e8647a' }} />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  placeholder={locale === 'es' ? 'tu@correo.com' : 'you@email.com'}
                  style={{
                    width: '100%', boxSizing: 'border-box',
                    padding: '11px 14px 11px 42px', borderRadius: 12,
                    border: '1.5px solid #fce7f3', background: 'white',
                    fontSize: 14, color: '#1e1b4b', outline: 'none',
                  }}
                  onFocus={(e) => (e.target.style.borderColor = '#e8647a')}
                  onBlur={(e) => (e.target.style.borderColor = '#fce7f3')}
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label style={{ display: 'block', fontSize: 12, fontWeight: 700, color: '#6b7280', marginBottom: 8, textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                {locale === 'es' ? 'Contraseña' : 'Password'}
              </label>
              <div style={{ position: 'relative' }}>
                <Lock style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', width: 16, height: 16, color: '#e8647a' }} />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  minLength={6}
                  placeholder="••••••••"
                  style={{
                    width: '100%', boxSizing: 'border-box',
                    padding: '11px 42px 11px 42px', borderRadius: 12,
                    border: '1.5px solid #fce7f3', background: 'white',
                    fontSize: 14, color: '#1e1b4b', outline: 'none',
                  }}
                  onFocus={(e) => (e.target.style.borderColor = '#e8647a')}
                  onBlur={(e) => (e.target.style.borderColor = '#fce7f3')}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  style={{
                    position: 'absolute', right: 14, top: '50%', transform: 'translateY(-50%)',
                    background: 'none', border: 'none', cursor: 'pointer', color: '#9ca3af', padding: 0,
                  }}
                >
                  {showPassword ? <EyeOff style={{ width: 16, height: 16 }} /> : <Eye style={{ width: 16, height: 16 }} />}
                </button>
              </div>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              style={{
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
                width: '100%', padding: '13px', borderRadius: 99, border: 'none',
                background: loading ? '#f4a3b3' : 'linear-gradient(135deg, #e8647a, #f4855c)',
                color: 'white', fontSize: 14, fontWeight: 800, cursor: loading ? 'not-allowed' : 'pointer',
                boxShadow: '0 6px 24px rgba(232,100,122,0.35)',
                marginTop: 4,
              }}
            >
              {loading ? (
                <Loader2 style={{ width: 18, height: 18, animation: 'spin 1s linear infinite' }} />
              ) : (
                <>
                  {locale === 'es' ? 'Iniciar Sesión' : 'Sign In'}
                  <ArrowRight style={{ width: 16, height: 16 }} />
                </>
              )}
            </button>
          </form>

          {/* Stripe divider */}
          <div style={{ margin: '28px 0 0', height: 3, borderRadius: 99, background: 'linear-gradient(90deg, #e8647a, #f4855c, #e8647a)' }} />

          <p style={{ marginTop: 20, textAlign: 'center', fontSize: 13, color: '#9ca3af' }}>
            {locale === 'es' ? '¿No tienes cuenta?' : "Don't have an account?"}{' '}
            <Link to="/signup" style={{ fontWeight: 700, color: '#e8647a', textDecoration: 'none' }}>
              {locale === 'es' ? 'Regístrate' : 'Sign Up'}
            </Link>
          </p>

          <div style={{ marginTop: 12, textAlign: 'center' }}>
            <Link to="/" style={{ fontSize: 12, color: '#c4b5c0', textDecoration: 'none' }}>
              {locale === 'es' ? '← Volver al inicio' : '← Back to home'}
            </Link>
          </div>
        </div>
      </div>

      <style>{`@keyframes spin { to { transform: rotate(360deg); } } .lg\\:flex { display: flex !important; } .lg\\:hidden { display: none !important; } @media(max-width:1023px){ .lg\\:flex { display: none !important; } .lg\\:hidden { display: flex !important; } }`}</style>
    </div>
  );
}
