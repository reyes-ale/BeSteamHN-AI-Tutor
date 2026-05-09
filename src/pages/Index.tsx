import React from 'react';
import { Link } from 'react-router-dom';
import { useI18n } from '@/lib/i18n';
import { useAuth } from '@/lib/auth';
import { useWallet } from '@solana/wallet-adapter-react';
import { LogIn, UserPlus, ArrowRight, BookOpen, GraduationCap, Globe } from 'lucide-react';

/* ─── Design tokens matching Panel 1 reference exactly ──────────────────── */
const C = {
  navy:      '#1a1f3c',
  blue:      '#4f8cff',
  blueDark:  '#6c5fff',
  teal:      '#40c4c0',
  gray:      '#6b7280',
  mutedBlue: '#8b9cb8',
  bgCard:    '#f8faff',
} as const;

const pill = (bg: string, color: string): React.CSSProperties => ({
  display: 'inline-flex', alignItems: 'center', gap: '6px',
  padding: '5px 14px', borderRadius: '99px',
  background: bg, color, fontSize: '10px', fontWeight: 700,
});

export default function Index() {
  const { t, locale, setLocale } = useI18n();
  const { connected } = useWallet();
  const { isAuthenticated } = useAuth();

  return (
    <div
      style={{
        minHeight: '100vh',
        background: 'linear-gradient(140deg, #dfeeff 0%, #e8eeff 35%, #ede4ff 65%, #f5dff5 100%)',
        fontFamily: "'Inter', system-ui, sans-serif",
        position: 'relative',
        overflowX: 'hidden',
      }}
    >

      {/* ═══════════════════════════════════════════════
          FLOATING 3-D SPHERES  (purely decorative)
      ═══════════════════════════════════════════════ */}
      <div style={{ position: 'fixed', inset: 0, pointerEvents: 'none', zIndex: 0, overflow: 'hidden' }}>
        {/* Large coral/pink – upper-right hero */}
        <div style={{
          position: 'absolute', top: '6%', right: '20%',
          width: 200, height: 200, borderRadius: '50%',
          background: 'radial-gradient(circle at 32% 32%, #ffb8e0, #ff6db8)',
          opacity: 0.72, filter: 'blur(1.5px)',
          boxShadow: '12px 12px 32px rgba(255,100,175,0.22)',
        }} />
        {/* Medium teal – far top-right */}
        <div style={{
          position: 'absolute', top: '3%', right: '5%',
          width: 95, height: 95, borderRadius: '50%',
          background: 'radial-gradient(circle at 32% 32%, #8ae8ff, #4fc8df)',
          opacity: 0.85,
          boxShadow: '6px 6px 18px rgba(79,200,223,0.25)',
        }} />
        {/* Blue – left mid */}
        <div style={{
          position: 'absolute', top: '58%', left: '2%',
          width: 72, height: 72, borderRadius: '50%',
          background: 'radial-gradient(circle at 32% 32%, #b0d6ff, #4f8cff)',
          opacity: 0.75,
          boxShadow: '4px 4px 14px rgba(79,140,255,0.22)',
        }} />
        {/* Gold/yellow – hero center */}
        <div style={{
          position: 'absolute', top: '68%', right: '42%',
          width: 48, height: 48, borderRadius: '50%',
          background: 'radial-gradient(circle at 32% 32%, #fff2b0, #ffd055)',
          opacity: 0.92,
        }} />
        {/* Tiny magenta/pink – right mid */}
        <div style={{
          position: 'absolute', top: '38%', right: '4%',
          width: 36, height: 36, borderRadius: '50%',
          background: 'radial-gradient(circle at 32% 32%, #ffd0f0, #ff8fd0)',
          opacity: 0.88,
        }} />
        {/* Pink ambient blob – right */}
        <div style={{
          position: 'absolute', top: 0, right: 0,
          width: '48%', height: '75%',
          background: 'radial-gradient(ellipse at 85% 15%, rgba(255,155,215,0.38) 0%, transparent 68%)',
        }} />
        {/* Blue ambient blob – bottom-left */}
        <div style={{
          position: 'absolute', bottom: 0, left: 0,
          width: '38%', height: '45%',
          background: 'radial-gradient(ellipse at 8% 92%, rgba(79,140,255,0.10) 0%, transparent 62%)',
        }} />
      </div>

      {/* ═══════════════════════════════════════════════
          NAVBAR
      ═══════════════════════════════════════════════ */}
      <nav style={{
        position: 'fixed', top: 0, left: 0, right: 0, zIndex: 50,
        height: '64px',
        background: 'rgba(255,255,255,0.88)',
        backdropFilter: 'blur(18px)',
        WebkitBackdropFilter: 'blur(18px)',
        borderBottom: '1px solid rgba(200,218,255,0.38)',
        boxShadow: '0 2px 24px rgba(79,140,255,0.07)',
      }}>
        <div style={{
          maxWidth: '1280px', margin: '0 auto',
          height: '100%', padding: '0 40px',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        }}>
          {/* Logo */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{
              width: 36, height: 36, borderRadius: '10px', flexShrink: 0,
              background: 'linear-gradient(135deg, #4f8cff 0%, #6c5fff 100%)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              boxShadow: '0 4px 14px rgba(79,140,255,0.38)',
            }}>
              <GraduationCap style={{ width: 18, height: 18, color: 'white' }} />
            </div>
            <div>
              <p style={{ fontSize: '13px', fontWeight: 800, color: C.navy, lineHeight: 1, letterSpacing: '-0.01em' }}>BESTEAMHN</p>
              <p style={{ fontSize: '9px', color: C.mutedBlue, marginTop: '2px', lineHeight: 1 }}>AI Tutor</p>
            </div>
          </div>

          {/* Center nav */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '32px' }}>
            {([
              { label: locale === 'es' ? 'Inicio' : 'Home',    to: '/'        },
              { label: locale === 'es' ? 'Cursos' : 'Courses', to: '/courses' },
              { label: locale === 'es' ? 'Contacto': 'Contacts', to: '#'     },
              { label: 'Blog',                                  to: '#'        },
            ] as const).map((item) => (
              <Link
                key={item.label}
                to={item.to}
                style={{ fontSize: '14px', fontWeight: 500, color: '#3d4f70', textDecoration: 'none' }}
              >
                {item.label}
              </Link>
            ))}
          </div>

          {/* Right actions */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <button
              onClick={() => setLocale(locale === 'es' ? 'en' : 'es')}
              style={{
                display: 'flex', alignItems: 'center', gap: '6px',
                padding: '7px 13px', borderRadius: '12px',
                background: 'rgba(79,140,255,0.07)',
                border: 'none', cursor: 'pointer',
                fontSize: '12px', fontWeight: 500, color: '#3d4f70',
              }}
            >
              <Globe style={{ width: 14, height: 14, color: C.blue }} />
              {locale === 'es' ? '🇭🇳 ES' : '🇺🇸 EN'}
            </button>

            {isAuthenticated ? (
              <Link to="/dashboard" style={{
                display: 'flex', alignItems: 'center', gap: '6px',
                padding: '8px 20px', borderRadius: '24px',
                background: `linear-gradient(135deg, ${C.blue} 0%, ${C.blueDark} 100%)`,
                color: 'white', fontSize: '13px', fontWeight: 700, textDecoration: 'none',
                boxShadow: '0 4px 16px rgba(79,140,255,0.38)',
              }}>
                {t.nav.dashboard} <ArrowRight style={{ width: 14, height: 14 }} />
              </Link>
            ) : (
              <>
                <Link to="/signin" style={{
                  display: 'flex', alignItems: 'center', gap: '6px',
                  padding: '8px 18px', borderRadius: '24px',
                  background: 'white', color: C.blue,
                  fontSize: '13px', fontWeight: 600, textDecoration: 'none',
                  border: `1.5px solid #c8d8ff`,
                  boxShadow: '0 2px 10px rgba(79,140,255,0.09)',
                }}>
                  <LogIn style={{ width: 14, height: 14 }} />
                  {locale === 'es' ? 'Ingresar' : 'Log In'}
                </Link>
                <Link to="/signup" style={{
                  display: 'flex', alignItems: 'center', gap: '6px',
                  padding: '8px 18px', borderRadius: '24px',
                  background: `linear-gradient(135deg, ${C.blue} 0%, ${C.blueDark} 100%)`,
                  color: 'white', fontSize: '13px', fontWeight: 700, textDecoration: 'none',
                  boxShadow: '0 4px 16px rgba(79,140,255,0.38)',
                }}>
                  <UserPlus style={{ width: 14, height: 14 }} />
                  {locale === 'es' ? 'Registrarse' : 'Register'}
                </Link>
              </>
            )}
          </div>
        </div>
      </nav>

      {/* ═══════════════════════════════════════════════
          HERO  (full-viewport, two-column)
      ═══════════════════════════════════════════════ */}
      <section style={{
        position: 'relative', zIndex: 1,
        minHeight: '100vh',
        paddingTop: '64px',
        display: 'flex', alignItems: 'center',
      }}>
        <div style={{
          maxWidth: '1280px', margin: '0 auto', width: '100%',
          padding: '32px 40px 48px',
          display: 'grid',
          gridTemplateColumns: '1.1fr 0.9fr',
          gap: '48px',
          alignItems: 'center',
        }}>

          {/* ── Left column: Headline + CTA + Workshop card ── */}
          <div>
            {/* Headline */}
            <h1 style={{
              fontSize: '52px', fontWeight: 800,
              color: C.navy, lineHeight: 1.1,
              letterSpacing: '-0.025em',
              marginBottom: '18px',
            }}>
              {locale === 'es' ? (
                <>Aprende, crea y<br />transforma tu futuro</>
              ) : (
                <>Learn, create &<br />transform your future</>
              )}
            </h1>

            {/* Sub-heading */}
            <p style={{
              fontSize: '15px', color: C.gray,
              lineHeight: 1.65, maxWidth: '400px',
              marginBottom: '30px',
            }}>
              {locale === 'es'
                ? 'Plataforma educativa para jóvenes y estudiantes en Honduras. Aprende con IA, gana certificados NFT y tokens STEAM.'
                : 'Educational platform ease for teenagers and young students in Honduras.'}
            </p>

            {/* CTA buttons */}
            <div style={{ display: 'flex', gap: '12px', marginBottom: '40px' }}>
              <Link to="/courses" style={{
                display: 'inline-flex', alignItems: 'center', gap: '8px',
                padding: '13px 26px', borderRadius: '24px',
                background: `linear-gradient(135deg, ${C.teal} 0%, #26a69a 100%)`,
                color: 'white', fontSize: '14px', fontWeight: 700, textDecoration: 'none',
                boxShadow: '0 6px 24px rgba(64,196,192,0.42)',
              }}>
                <BookOpen style={{ width: 16, height: 16 }} />
                {locale === 'es' ? 'Explorar Cursos' : 'Explore Courses'}
              </Link>

              {isAuthenticated ? (
                <Link to="/dashboard" style={{
                  display: 'inline-flex', alignItems: 'center', gap: '8px',
                  padding: '13px 26px', borderRadius: '24px',
                  background: `linear-gradient(135deg, ${C.blue} 0%, ${C.blueDark} 100%)`,
                  color: 'white', fontSize: '14px', fontWeight: 700, textDecoration: 'none',
                  boxShadow: '0 6px 24px rgba(79,140,255,0.42)',
                }}>
                  <ArrowRight style={{ width: 16, height: 16 }} />
                  {t.nav.dashboard}
                </Link>
              ) : (
                <Link to="/signup" style={{
                  display: 'inline-flex', alignItems: 'center', gap: '8px',
                  padding: '13px 26px', borderRadius: '24px',
                  background: `linear-gradient(135deg, ${C.blue} 0%, ${C.blueDark} 100%)`,
                  color: 'white', fontSize: '14px', fontWeight: 700, textDecoration: 'none',
                  boxShadow: '0 6px 24px rgba(79,140,255,0.42)',
                }}>
                  <UserPlus style={{ width: 16, height: 16 }} />
                  {locale === 'es' ? 'Registrarse Gratis' : 'Sign Up Free'}
                </Link>
              )}
            </div>

            {/* Workshop Highlights card */}
            <div style={{
              background: 'white',
              borderRadius: '24px',
              padding: '20px 22px',
              boxShadow: '0 8px 40px rgba(79,140,255,0.10)',
              maxWidth: '460px',
            }}>
              <p style={{ fontSize: '13px', fontWeight: 700, color: C.navy, marginBottom: '14px' }}>
                Workshop Highlights
              </p>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                {[
                  {
                    emoji: '👩‍💻',
                    name: 'Asana Ramble',
                    date: 'Jun 15, 2026',
                    desc: locale === 'es'
                      ? 'Aprende fundamentos de programación con proyectos prácticos y ejercicios reales.'
                      : 'Learn programming fundamentals through hands-on projects and real exercises.',
                    avatarBg: 'linear-gradient(135deg, #ffe0f0, #ffc8e4)',
                  },
                  {
                    emoji: '👨‍🔬',
                    name: 'Jason Ramble',
                    date: 'Jun 22, 2026',
                    desc: locale === 'es'
                      ? 'Construye tu primer robot usando Arduino y componentes electrónicos básicos.'
                      : 'Build your first robot using Arduino and basic electronic components.',
                    avatarBg: 'linear-gradient(135deg, #e0eeff, #c8d8ff)',
                  },
                ].map((w) => (
                  <div key={w.name} style={{
                    background: '#f8faff',
                    borderRadius: '16px',
                    padding: '14px',
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
                      <div style={{
                        width: 36, height: 36, borderRadius: '50%', flexShrink: 0,
                        background: w.avatarBg,
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        fontSize: '18px',
                      }}>
                        {w.emoji}
                      </div>
                      <div>
                        <p style={{ fontSize: '11px', fontWeight: 700, color: C.navy }}>{w.name}</p>
                        <p style={{ fontSize: '9px', color: C.mutedBlue, marginTop: '1px' }}>{w.date}</p>
                      </div>
                    </div>
                    <p style={{ fontSize: '10px', color: C.gray, lineHeight: 1.55 }}>{w.desc}</p>
                  </div>
                ))}
              </div>

              {/* Carousel dots */}
              <div style={{ display: 'flex', justifyContent: 'center', gap: '6px', marginTop: '14px' }}>
                {[true, false, false].map((active, i) => (
                  <div key={i} style={{
                    width: active ? '18px' : '6px', height: '6px',
                    borderRadius: '99px',
                    background: active ? C.blue : '#c8d8ff',
                    transition: 'width 0.3s',
                  }} />
                ))}
              </div>
            </div>
          </div>

          {/* ── Right column: Illustration area ── */}
          <div style={{ position: 'relative', height: '520px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>

            {/* Main white card (represents the student + course UI) */}
            <div style={{
              width: '265px',
              borderRadius: '28px',
              background: 'white',
              boxShadow: '0 24px 70px rgba(79,140,255,0.16)',
              padding: '24px',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '14px',
              zIndex: 2,
              position: 'relative',
            }}>
              {/* Avatar */}
              <div style={{
                width: 88, height: 88, borderRadius: '50%',
                background: 'linear-gradient(135deg, #ffe0f0, #ffbcdc)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: '44px',
                boxShadow: '0 8px 24px rgba(255,150,210,0.28)',
              }}>
                👩‍🎓
              </div>

              {/* Course progress mini-card */}
              <div style={{
                width: '100%',
                background: '#f0f7ff',
                borderRadius: '14px',
                padding: '10px 13px',
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                  <div style={{
                    width: 28, height: 28, borderRadius: '8px', flexShrink: 0,
                    background: 'linear-gradient(135deg, #4f8cff, #6c5fff)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: '14px',
                  }}>
                    🐍
                  </div>
                  <div>
                    <p style={{ fontSize: '10px', fontWeight: 700, color: C.navy }}>Python Básico</p>
                    <p style={{ fontSize: '9px', color: C.mutedBlue }}>12 {locale === 'es' ? 'lecciones' : 'lessons'}</p>
                  </div>
                </div>
                {/* Progress bar */}
                <div style={{ height: '5px', background: '#ddeeff', borderRadius: '99px', overflow: 'hidden' }}>
                  <div style={{ width: '65%', height: '100%', background: 'linear-gradient(90deg, #4f8cff, #6c5fff)', borderRadius: '99px' }} />
                </div>
                <p style={{ fontSize: '9px', color: C.mutedBlue, marginTop: '4px' }}>65% {locale === 'es' ? 'completado' : 'complete'}</p>
              </div>

              {/* Reward pills */}
              <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', justifyContent: 'center' }}>
                <span style={pill('linear-gradient(135deg, #fff0f5, #ffe0ef)', '#e879a0')}>🏆 350 STEAM</span>
                <span style={pill('linear-gradient(135deg, #f0fff8, #e0fff4)', '#22c991')}>✅ NFT Cert.</span>
              </div>
            </div>

            {/* ── Floating micro-cards ── */}

            {/* AI Tutor – top left */}
            <div style={{
              position: 'absolute', top: '48px', left: '4px', zIndex: 3,
              background: 'white', borderRadius: '18px', padding: '11px 15px',
              boxShadow: '0 8px 30px rgba(79,140,255,0.14)',
              display: 'flex', alignItems: 'center', gap: '10px',
              animation: 'floatCard 4s ease-in-out infinite',
            }}>
              <div style={{
                width: 32, height: 32, borderRadius: '10px', flexShrink: 0,
                background: 'linear-gradient(135deg, #ffd4ee, #ff9fd5)',
                display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '16px',
              }}>
                🤖
              </div>
              <div>
                <p style={{ fontSize: '11px', fontWeight: 700, color: C.navy }}>AI Tutor</p>
                <p style={{ fontSize: '9px', color: '#22c991', fontWeight: 600 }}>● {locale === 'es' ? 'En línea' : 'Online'}</p>
              </div>
            </div>

            {/* Students – bottom left */}
            <div style={{
              position: 'absolute', bottom: '88px', left: '8px', zIndex: 3,
              background: 'white', borderRadius: '18px', padding: '11px 15px',
              boxShadow: '0 8px 30px rgba(79,140,255,0.14)',
              animation: 'floatCard 4.5s ease-in-out infinite 0.5s',
            }}>
              <p style={{ fontSize: '10px', fontWeight: 700, color: C.navy, marginBottom: '7px' }}>500+ {locale === 'es' ? 'Estudiantes' : 'Students'}</p>
              <div style={{ display: 'flex' }}>
                {['#ff9fd5', '#4f8cff', '#40c4c0', '#ffd060'].map((color, i) => (
                  <div key={i} style={{
                    width: 22, height: 22, borderRadius: '50%',
                    background: `radial-gradient(circle at 35% 35%, ${color}bb, ${color})`,
                    border: '2px solid white',
                    marginLeft: i > 0 ? '-7px' : 0,
                  }} />
                ))}
                <div style={{
                  width: 22, height: 22, borderRadius: '50%',
                  background: 'rgba(79,140,255,0.12)',
                  border: '2px solid white', marginLeft: '-7px',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: '8px', fontWeight: 800, color: C.blue,
                }}>+</div>
              </div>
            </div>

            {/* NFT badge – top right */}
            <div style={{
              position: 'absolute', top: '88px', right: '0', zIndex: 3,
              background: 'linear-gradient(135deg, #4f8cff 0%, #6c5fff 100%)',
              borderRadius: '18px', padding: '12px 16px',
              boxShadow: '0 8px 28px rgba(79,140,255,0.38)',
              animation: 'floatCard 3.8s ease-in-out infinite 1s',
            }}>
              <p style={{ fontSize: '11px', fontWeight: 800, color: 'white', marginBottom: '2px' }}>NFT Cert.</p>
              <p style={{ fontSize: '9px', color: 'rgba(255,255,255,0.7)' }}>Solana ◎</p>
            </div>

            {/* Progress – bottom right */}
            <div style={{
              position: 'absolute', bottom: '56px', right: '4px', zIndex: 3,
              background: 'white', borderRadius: '18px', padding: '11px 14px',
              boxShadow: '0 8px 30px rgba(79,140,255,0.14)',
              animation: 'floatCard 4.2s ease-in-out infinite 1.5s',
            }}>
              <p style={{ fontSize: '10px', fontWeight: 700, color: C.navy, marginBottom: '7px' }}>{locale === 'es' ? 'Progreso' : 'Progress'}</p>
              <div style={{ height: '4px', width: '82px', background: '#e0eeff', borderRadius: '99px', overflow: 'hidden' }}>
                <div style={{ width: '72%', height: '100%', background: 'linear-gradient(90deg, #40c4c0, #26a69a)', borderRadius: '99px' }} />
              </div>
              <p style={{ fontSize: '9px', color: C.mutedBlue, marginTop: '5px' }}>72% {locale === 'es' ? 'completado' : 'complete'}</p>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════
          FOOTER
      ═══════════════════════════════════════════════ */}
      <footer style={{
        position: 'relative', zIndex: 1,
        background: 'rgba(255,255,255,0.72)',
        backdropFilter: 'blur(14px)',
        WebkitBackdropFilter: 'blur(14px)',
        borderTop: '1px solid rgba(200,218,255,0.35)',
        padding: '28px 40px',
      }}>
        <div style={{
          maxWidth: '1280px', margin: '0 auto',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{
              width: 28, height: 28, borderRadius: '8px',
              background: 'linear-gradient(135deg, #4f8cff, #6c5fff)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              <GraduationCap style={{ width: 16, height: 16, color: 'white' }} />
            </div>
            <span style={{ fontSize: '13px', fontWeight: 700, color: C.navy }}>BESTEAMHN AI Tutor</span>
          </div>
          <p style={{ fontSize: '12px', color: C.mutedBlue }}>
            {locale === 'es' ? '© 2026 BESTEAMHN. Una ONG educativa en Honduras.' : '© 2026 BESTEAMHN. An educational NGO in Honduras.'}
          </p>
        </div>
      </footer>

      {/* Keyframes for floating card animations */}
      <style>{`
        @keyframes floatCard {
          0%, 100% { transform: translateY(0px); }
          50%       { transform: translateY(-8px); }
        }
      `}</style>
    </div>
  );
}
