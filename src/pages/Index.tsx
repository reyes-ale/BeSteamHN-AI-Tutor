import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useI18n } from '@/lib/i18n';
import { useAuth } from '@/lib/auth';
import { useWallet } from '@solana/wallet-adapter-react';
import {
  LogIn, UserPlus, ArrowRight, BookOpen, GraduationCap, Globe,
  Play, ChevronLeft, ChevronRight, Users, Award, Bot,
} from 'lucide-react';

/* ─── Palette ────────────────────────────────────────────────────────────── */
const C = {
  primary:  '#e8647a',
  orange:   '#f4855c',
  navy:     '#1e1b4b',
  gray:     '#6b7280',
  muted:    '#9ca3af',
  light:    '#fce7f3',
  bg:       '#fff8f6',
  card:     '#ffffff',
  border:   'rgba(232,100,122,0.12)',
} as const;

const shadow = {
  card:     '0 4px 24px rgba(232,100,122,0.08), 0 1px 4px rgba(0,0,0,0.04)',
  cardHover:'0 16px 48px rgba(232,100,122,0.16), 0 4px 12px rgba(0,0,0,0.06)',
  btn:      '0 4px 20px rgba(232,100,122,0.38)',
} as const;

/* ─── Data ───────────────────────────────────────────────────────────────── */
const slides = [
  { emoji: '🤖', bg: 'linear-gradient(135deg,#fce7f3,#fac8e8)', label: 'AI Tutor interaccional', sub: '23 Novas slides', to: '/ai-tutor' },
  { emoji: '🌍', bg: 'linear-gradient(135deg,#dbeafe,#bfdbfe)', label: 'Inspiring STEM workshop in Honduras', sub: '20 Noves slides', to: '/workshops' },
  { emoji: '🧪', bg: 'linear-gradient(135deg,#d1fae5,#a7f3d0)', label: 'Innovative STEM actividades', sub: '78 Home slides', to: '/courses' },
  { emoji: '🦾', bg: 'linear-gradient(135deg,#fef3c7,#fde68a)', label: 'Students en la robotics', sub: '33 Novax slides', to: '/courses' },
];

const workshops = [
  { emoji: '🤖', title: 'Futuriscate AI Tutoring',  sub: 'Democratize AI education community.',    bg: 'linear-gradient(135deg,#fce7f3,#fbcfe8)', to: '/ai-tutor'   },
  { emoji: '🦾', title: 'Robotics in Robotics',     sub: 'Democratize all educacion community.',   bg: 'linear-gradient(135deg,#ede9fe,#ddd6fe)', to: '/workshops'  },
  { emoji: '🌱', title: 'Inspiring STEM workshop',  sub: 'Inspiring STEM workshop in Honduras.',   bg: 'linear-gradient(135deg,#d1fae5,#a7f3d0)', to: '/workshops'  },
  { emoji: '🌐', title: 'Web3 & Blockchain',        sub: 'Learn about NFT and Solana ecosystem.',  bg: 'linear-gradient(135deg,#dbeafe,#bfdbfe)', to: '/nft-gallery' },
];

const certs = [
  { name: 'Alexia Simon',    color: C.primary, id: '#2025-0041', to: '/nft-gallery' },
  { name: 'Alexia Surranno', color: '#7c3aed', id: '#2025-0042', to: '/nft-gallery' },
];

export default function Index() {
  const { locale, setLocale } = useI18n();
  const { t } = useI18n();
  const { isAuthenticated } = useAuth();
  useWallet();

  const [slideIdx, setSlideIdx]   = useState(0);
  const [workshopIdx, setWorkshopIdx] = useState(0);

  const prevSlide    = () => setSlideIdx(i => (i - 1 + slides.length) % slides.length);
  const nextSlide    = () => setSlideIdx(i => (i + 1) % slides.length);
  const prevWorkshop = () => setWorkshopIdx(i => (i - 1 + workshops.length) % workshops.length);
  const nextWorkshop = () => setWorkshopIdx(i => (i + 1) % workshops.length);

  const ArrowBtn = ({ onClick, side }: { onClick: () => void; side: 'left' | 'right' }) => (
    <button onClick={onClick} style={{
      width: 34, height: 34, borderRadius: '50%', border: `1px solid ${C.border}`,
      background: C.card, boxShadow: shadow.card, cursor: 'pointer', flexShrink: 0,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
    }}>
      {side === 'left'
        ? <ChevronLeft  style={{ width: 15, height: 15, color: C.primary }} />
        : <ChevronRight style={{ width: 15, height: 15, color: C.primary }} />
      }
    </button>
  );

  return (
    <div style={{
      minHeight: '100vh', background: C.bg,
      fontFamily: "'Inter',system-ui,sans-serif", color: C.navy, overflowX: 'hidden',
    }}>

      {/* ══════════════════════════════════════════════════════════════
          NAVBAR
      ══════════════════════════════════════════════════════════════ */}
      <nav style={{
        position: 'fixed', top: 0, left: 0, right: 0, zIndex: 100, height: 64,
        background: 'rgba(255,248,246,0.92)',
        backdropFilter: 'blur(20px)', WebkitBackdropFilter: 'blur(20px)',
        borderBottom: `1px solid ${C.border}`,
        boxShadow: '0 2px 20px rgba(232,100,122,0.06)',
      }}>
        <div style={{
          maxWidth: 1200, margin: '0 auto', height: '100%', padding: '0 40px',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        }}>
          {/* Logo */}
          <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: 10, textDecoration: 'none' }}>
            <div style={{
              width: 36, height: 36, borderRadius: 10,
              background: 'linear-gradient(135deg,#e8647a,#f4855c)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              boxShadow: '0 4px 14px rgba(232,100,122,0.32)',
            }}>
              <GraduationCap style={{ width: 18, height: 18, color: 'white' }} />
            </div>
            <div>
              <p style={{ fontSize: 13, fontWeight: 800, color: C.navy, lineHeight: 1, letterSpacing: '-0.01em' }}>BESTEAMHN</p>
              <p style={{ fontSize: 9, color: C.muted, marginTop: 2, lineHeight: 1 }}>AI Tutor</p>
            </div>
          </Link>

          {/* Nav links */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 28 }}>
            {[
              { label: locale === 'es' ? 'Inicio'    : 'Home',            to: '/'           },
              { label: locale === 'es' ? 'Cursos'    : 'Courses',         to: '/courses'    },
              { label: 'Workshops',                                        to: '/workshops'  },
              { label: locale === 'es' ? 'Comunidad' : 'Community',       to: '/leaderboard'},
              { label: 'NFT Certificates',                                 to: '/nft-gallery'},
              { label: locale === 'es' ? 'Acerca'    : 'About',           to: '/'           },
            ].map(item => (
              <Link key={item.label} to={item.to} style={{
                fontSize: 13, fontWeight: 500, color: '#475569', textDecoration: 'none',
              }}>
                {item.label}
              </Link>
            ))}
          </div>

          {/* Right actions */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <button
              onClick={() => setLocale(locale === 'es' ? 'en' : 'es')}
              style={{
                display: 'flex', alignItems: 'center', gap: 5,
                padding: '6px 12px', borderRadius: 10,
                background: C.light, border: 'none', cursor: 'pointer',
                fontSize: 12, fontWeight: 500, color: '#475569',
              }}
            >
              <Globe style={{ width: 13, height: 13, color: C.primary }} />
              {locale === 'es' ? '🇭🇳 ES' : '🇺🇸 EN'}
            </button>

            {isAuthenticated ? (
              <Link to="/dashboard" style={{
                display: 'flex', alignItems: 'center', gap: 6,
                padding: '8px 20px', borderRadius: 99,
                background: 'linear-gradient(135deg,#e8647a,#f4855c)',
                color: 'white', fontSize: 13, fontWeight: 700, textDecoration: 'none',
                boxShadow: shadow.btn,
              }}>
                {t.nav.dashboard} <ArrowRight style={{ width: 13, height: 13 }} />
              </Link>
            ) : (
              <>
                <Link to="/signin" style={{
                  display: 'flex', alignItems: 'center', gap: 6,
                  padding: '8px 18px', borderRadius: 99, background: C.card,
                  color: C.primary, fontSize: 13, fontWeight: 600, textDecoration: 'none',
                  border: `1.5px solid rgba(232,100,122,0.24)`,
                  boxShadow: '0 2px 8px rgba(232,100,122,0.08)',
                }}>
                  <LogIn style={{ width: 13, height: 13 }} />
                  {locale === 'es' ? 'Login' : 'Login'}
                </Link>
                <Link to="/signup" style={{
                  display: 'flex', alignItems: 'center', gap: 6,
                  padding: '8px 20px', borderRadius: 99,
                  background: 'linear-gradient(135deg,#e8647a,#f4855c)',
                  color: 'white', fontSize: 13, fontWeight: 700, textDecoration: 'none',
                  boxShadow: shadow.btn,
                }}>
                  {locale === 'es' ? 'Comenzar' : 'Get Started'}
                </Link>
              </>
            )}
          </div>
        </div>
      </nav>

      {/* ══════════════════════════════════════════════════════════════
          COURSE SLIDER
      ══════════════════════════════════════════════════════════════ */}
      <section style={{ paddingTop: 80 }}>
        <div style={{ maxWidth: 1200, margin: '0 auto', padding: '20px 40px 0', display: 'flex', alignItems: 'center', gap: 12 }}>
          <ArrowBtn onClick={prevSlide} side="left" />

          <div style={{ flex: 1, overflow: 'hidden' }}>
            <div style={{
              display: 'flex', gap: 14,
              transform: `translateX(calc(${-slideIdx} * (224px + 14px)))`,
              transition: 'transform 0.4s cubic-bezier(0.4,0,0.2,1)',
            }}>
              {slides.map((s, i) => (
                <Link key={i} to={s.to} style={{ textDecoration: 'none' }}>
                  <div style={{
                    minWidth: 210, height: 140, borderRadius: 20, flexShrink: 0,
                    background: s.bg, padding: 16, position: 'relative',
                    boxShadow: shadow.card, overflow: 'hidden', cursor: 'pointer',
                    transition: 'transform 0.22s, box-shadow 0.22s',
                  }}
                    onMouseEnter={e => {
                      (e.currentTarget as HTMLDivElement).style.transform = 'translateY(-3px)';
                      (e.currentTarget as HTMLDivElement).style.boxShadow = shadow.cardHover;
                    }}
                    onMouseLeave={e => {
                      (e.currentTarget as HTMLDivElement).style.transform = 'translateY(0)';
                      (e.currentTarget as HTMLDivElement).style.boxShadow = shadow.card;
                    }}
                  >
                    <div style={{ fontSize: 34, marginBottom: 6 }}>{s.emoji}</div>
                    <p style={{ fontSize: 11, fontWeight: 700, color: C.navy, lineHeight: 1.35 }}>{s.label}</p>
                    <p style={{ fontSize: 9, color: C.gray, marginTop: 4 }}>{s.sub}</p>
                    <div style={{
                      position: 'absolute', bottom: 12, right: 12,
                      width: 28, height: 28, borderRadius: '50%',
                      background: 'rgba(255,255,255,0.80)', backdropFilter: 'blur(8px)',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                    }}>
                      <Play style={{ width: 10, height: 10, color: C.navy, fill: C.navy }} />
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>

          <ArrowBtn onClick={nextSlide} side="right" />
        </div>

        {/* Dots */}
        <div style={{ display: 'flex', justifyContent: 'center', gap: 6, marginTop: 10 }}>
          {slides.map((_, i) => (
            <button key={i} onClick={() => setSlideIdx(i)} style={{
              width: i === slideIdx ? 22 : 7, height: 7, borderRadius: 99,
              border: 'none', cursor: 'pointer', padding: 0,
              background: i === slideIdx ? C.primary : 'rgba(232,100,122,0.22)',
              transition: 'all 0.3s',
            }} />
          ))}
        </div>
      </section>

      {/* Stripe divider */}
      <div style={{
        margin: '32px 0 0', height: 14,
        backgroundImage: `repeating-linear-gradient(90deg, ${C.primary} 0px, ${C.primary} 24px, ${C.orange} 24px, ${C.orange} 48px)`,
      }} />

      {/* ══════════════════════════════════════════════════════════════
          HERO
      ══════════════════════════════════════════════════════════════ */}
      <section style={{ background: 'white' }}>
        <div style={{
          maxWidth: 1200, margin: '0 auto', padding: '64px 40px',
          display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 60, alignItems: 'center',
        }}>

          {/* Left */}
          <div>
            <div style={{ marginBottom: 16 }}>
              <span style={{
                display: 'inline-flex', alignItems: 'center', gap: 5,
                padding: '5px 14px', borderRadius: 99,
                background: C.light, color: C.primary, fontSize: 11, fontWeight: 700,
              }}>✨ {locale === 'es' ? 'Plataforma Educativa' : 'Education Platform'}</span>
            </div>

            <h1 style={{ fontSize: 52, fontWeight: 800, lineHeight: 1.08, letterSpacing: '-0.03em', color: C.navy, marginBottom: 18 }}>
              {locale === 'es'
                ? <>Aprende, crea y<br /><span style={{ color: C.primary }}>transforma</span> tu futuro</>
                : <>Learn, create &<br /><span style={{ color: C.primary }}>transform</span> your future</>}
            </h1>

            <p style={{ fontSize: 15, color: C.gray, lineHeight: 1.7, maxWidth: 400, marginBottom: 32 }}>
              {locale === 'es'
                ? 'Democratizando la educación STEM y Web3 para jóvenes en Honduras.'
                : 'Democratizing STEM and Web3 education for youth across Honduras.'}
            </p>

            {/* CTAs */}
            <div style={{ display: 'flex', gap: 12, marginBottom: 44 }}>
              <Link to="/courses" style={{
                display: 'inline-flex', alignItems: 'center', gap: 8,
                padding: '13px 26px', borderRadius: 99,
                background: C.card, color: C.primary, fontSize: 14, fontWeight: 700, textDecoration: 'none',
                border: `1.5px solid rgba(232,100,122,0.24)`,
                boxShadow: '0 4px 16px rgba(232,100,122,0.10)',
              }}>
                <BookOpen style={{ width: 15, height: 15 }} />
                {locale === 'es' ? 'Explorar Cursos' : 'Explore Courses'}
              </Link>
              {isAuthenticated ? (
                <Link to="/dashboard" style={{
                  display: 'inline-flex', alignItems: 'center', gap: 8,
                  padding: '13px 26px', borderRadius: 99,
                  background: 'linear-gradient(135deg,#e8647a,#f4855c)',
                  color: 'white', fontSize: 14, fontWeight: 700, textDecoration: 'none',
                  boxShadow: shadow.btn,
                }}>
                  {t.nav.dashboard} <ArrowRight style={{ width: 15, height: 15 }} />
                </Link>
              ) : (
                <Link to="/signup" style={{
                  display: 'inline-flex', alignItems: 'center', gap: 8,
                  padding: '13px 26px', borderRadius: 99,
                  background: 'linear-gradient(135deg,#e8647a,#f4855c)',
                  color: 'white', fontSize: 14, fontWeight: 700, textDecoration: 'none',
                  boxShadow: shadow.btn,
                }}>
                  <UserPlus style={{ width: 15, height: 15 }} />
                  {locale === 'es' ? 'Comenzar Gratis' : 'Get Started Free'}
                </Link>
              )}
            </div>

            {/* Stats */}
            <div style={{ display: 'flex', gap: 28 }}>
              {[
                { icon: <Users style={{ width: 14, height: 14 }} />, val: '500+', label: locale === 'es' ? 'Estudiantes' : 'Students', to: '/leaderboard' },
                { icon: <BookOpen style={{ width: 14, height: 14 }} />, val: '24', label: locale === 'es' ? 'Cursos' : 'Courses', to: '/courses' },
                { icon: <Award style={{ width: 14, height: 14 }} />, val: '120+', label: 'NFT Certs', to: '/nft-gallery' },
              ].map(s => (
                <Link key={s.label} to={s.to} style={{ display: 'flex', alignItems: 'center', gap: 8, textDecoration: 'none' }}>
                  <div style={{
                    width: 32, height: 32, borderRadius: 9,
                    background: C.light, display: 'flex', alignItems: 'center', justifyContent: 'center', color: C.primary,
                  }}>{s.icon}</div>
                  <div>
                    <p style={{ fontSize: 16, fontWeight: 800, color: C.navy, lineHeight: 1 }}>{s.val}</p>
                    <p style={{ fontSize: 10, color: C.muted, marginTop: 2 }}>{s.label}</p>
                  </div>
                </Link>
              ))}
            </div>
          </div>

          {/* Right — illustration with navigating cards */}
          <div style={{ position: 'relative', height: 500, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            {/* Central card */}
            <div style={{
              width: 250, borderRadius: 28, background: C.card,
              boxShadow: '0 24px 64px rgba(232,100,122,0.14)',
              padding: '24px 22px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 14,
              position: 'relative', zIndex: 2,
            }}>
              <div style={{
                width: 88, height: 88, borderRadius: '50%',
                background: 'linear-gradient(135deg,#fce7f3,#fbcfe8)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 44, boxShadow: '0 8px 24px rgba(232,100,122,0.20)',
              }}>👩‍🎓</div>

              <div style={{ width: '100%', background: '#fff5f8', borderRadius: 14, padding: '10px 13px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
                  <div style={{
                    width: 28, height: 28, borderRadius: 8,
                    background: 'linear-gradient(135deg,#e8647a,#f4855c)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14,
                  }}>🐍</div>
                  <div>
                    <p style={{ fontSize: 10, fontWeight: 700, color: C.navy }}>Python Básico</p>
                    <p style={{ fontSize: 9, color: C.muted }}>12 {locale === 'es' ? 'lecciones' : 'lessons'}</p>
                  </div>
                </div>
                <div style={{ height: 5, background: '#fce7f3', borderRadius: 99, overflow: 'hidden' }}>
                  <div style={{ width: '65%', height: '100%', background: 'linear-gradient(90deg,#e8647a,#f4855c)', borderRadius: 99 }} />
                </div>
                <p style={{ fontSize: 9, color: C.muted, marginTop: 4 }}>65% {locale === 'es' ? 'completado' : 'complete'}</p>
              </div>

              <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', justifyContent: 'center' }}>
                <Link to="/leaderboard" style={{
                  display: 'inline-flex', alignItems: 'center', gap: 4, padding: '4px 10px',
                  borderRadius: 99, background: C.light, color: C.primary, fontSize: 10, fontWeight: 700, textDecoration: 'none',
                }}>🏆 350 STEAM</Link>
                <Link to="/nft-gallery" style={{
                  display: 'inline-flex', alignItems: 'center', gap: 4, padding: '4px 10px',
                  borderRadius: 99, background: '#f0fdf4', color: '#14b8a6', fontSize: 10, fontWeight: 700, textDecoration: 'none',
                }}>✅ NFT Cert.</Link>
              </div>
            </div>

            {/* Floating: AI Tutor → /ai-tutor */}
            <Link to="/ai-tutor" style={{ textDecoration: 'none', position: 'absolute', top: 52, left: 0, zIndex: 3, animation: 'floatY 4s ease-in-out infinite' }}>
              <div style={{
                background: C.card, borderRadius: 18, padding: '11px 14px',
                boxShadow: shadow.card, display: 'flex', alignItems: 'center', gap: 10,
              }}>
                <div style={{
                  width: 32, height: 32, borderRadius: 10,
                  background: 'linear-gradient(135deg,#fce7f3,#f9a8d4)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16,
                }}><Bot style={{ width: 16, height: 16, color: C.primary }} /></div>
                <div>
                  <p style={{ fontSize: 11, fontWeight: 700, color: C.navy }}>AI Tutor</p>
                  <p style={{ fontSize: 9, color: '#14b8a6', fontWeight: 600 }}>● {locale === 'es' ? 'En línea' : 'Online'}</p>
                </div>
              </div>
            </Link>

            {/* Floating: NFT badge → /nft-gallery */}
            <Link to="/nft-gallery" style={{ textDecoration: 'none', position: 'absolute', top: 90, right: -4, zIndex: 3, animation: 'floatY 3.8s ease-in-out infinite 1s' }}>
              <div style={{
                background: 'linear-gradient(135deg,#e8647a,#f4855c)',
                borderRadius: 18, padding: '12px 16px',
                boxShadow: shadow.btn,
              }}>
                <p style={{ fontSize: 11, fontWeight: 800, color: 'white', marginBottom: 2 }}>NFT Cert.</p>
                <p style={{ fontSize: 9, color: 'rgba(255,255,255,0.72)' }}>Solana ◎</p>
              </div>
            </Link>

            {/* Floating: Progress → /dashboard */}
            <Link to="/dashboard" style={{ textDecoration: 'none', position: 'absolute', bottom: 56, right: 4, zIndex: 3, animation: 'floatY 4.2s ease-in-out infinite 1.5s' }}>
              <div style={{ background: C.card, borderRadius: 18, padding: '11px 14px', boxShadow: shadow.card }}>
                <p style={{ fontSize: 10, fontWeight: 700, color: C.navy, marginBottom: 7 }}>{locale === 'es' ? 'Progreso' : 'Progress'}</p>
                <div style={{ height: 4, width: 82, background: C.light, borderRadius: 99, overflow: 'hidden' }}>
                  <div style={{ width: '72%', height: '100%', background: 'linear-gradient(90deg,#e8647a,#f4855c)', borderRadius: 99 }} />
                </div>
                <p style={{ fontSize: 9, color: C.muted, marginTop: 5 }}>72% {locale === 'es' ? 'completado' : 'complete'}</p>
              </div>
            </Link>

            {/* Floating: Courses count → /courses */}
            <Link to="/courses" style={{ textDecoration: 'none', position: 'absolute', bottom: 90, left: 4, zIndex: 3, animation: 'floatY 4.5s ease-in-out infinite 0.5s' }}>
              <div style={{ background: C.card, borderRadius: 18, padding: '11px 14px', boxShadow: shadow.card }}>
                <p style={{ fontSize: 10, fontWeight: 700, color: C.navy, marginBottom: 6 }}>
                  {locale === 'es' ? 'Explorar Cursos' : 'Explore Courses'}
                </p>
                <div style={{ display: 'flex', gap: 4 }}>
                  {['#fce7f3','#dbeafe','#d1fae5','#fef3c7'].map((color, i) => (
                    <div key={i} style={{ width: 20, height: 20, borderRadius: 6, background: color, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 11 }}>
                      {['🐍','🤖','🌐','🎨'][i]}
                    </div>
                  ))}
                </div>
              </div>
            </Link>
          </div>
        </div>
      </section>

      {/* Stripe divider */}
      <div style={{
        height: 14,
        backgroundImage: `repeating-linear-gradient(90deg, ${C.orange} 0px, ${C.orange} 24px, ${C.primary} 24px, ${C.primary} 48px)`,
      }} />

      {/* ══════════════════════════════════════════════════════════════
          WORKSHOP HIGHLIGHTS
      ══════════════════════════════════════════════════════════════ */}
      <section style={{ background: '#fdf4f6', padding: '64px 0' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 40px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 28 }}>
            <h2 style={{ fontSize: 28, fontWeight: 800, color: C.navy }}>Workshop Highlights</h2>
            <div style={{ display: 'flex', gap: 8 }}>
              <ArrowBtn onClick={prevWorkshop} side="left" />
              <ArrowBtn onClick={nextWorkshop} side="right" />
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 16 }}>
            {workshops.map((w, i) => (
              <Link key={i} to={w.to} style={{ textDecoration: 'none' }}>
                <div style={{
                  background: C.card, borderRadius: 20, overflow: 'hidden',
                  boxShadow: shadow.card, transition: 'transform 0.22s, box-shadow 0.22s',
                  opacity: i === workshopIdx ? 1 : 0.88,
                }}
                  onMouseEnter={e => {
                    (e.currentTarget as HTMLDivElement).style.transform = 'translateY(-4px)';
                    (e.currentTarget as HTMLDivElement).style.boxShadow = shadow.cardHover;
                  }}
                  onMouseLeave={e => {
                    (e.currentTarget as HTMLDivElement).style.transform = 'translateY(0)';
                    (e.currentTarget as HTMLDivElement).style.boxShadow = shadow.card;
                  }}
                >
                  <div style={{ height: 130, background: w.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative' }}>
                    <span style={{ fontSize: 48 }}>{w.emoji}</span>
                    <div style={{
                      position: 'absolute', bottom: 10, right: 10,
                      width: 32, height: 32, borderRadius: '50%',
                      background: 'rgba(255,255,255,0.90)', backdropFilter: 'blur(8px)',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      boxShadow: '0 2px 8px rgba(0,0,0,0.12)',
                    }}>
                      <Play style={{ width: 12, height: 12, color: C.primary, fill: C.primary }} />
                    </div>
                  </div>
                  <div style={{ padding: '14px 16px 16px' }}>
                    <p style={{ fontSize: 13, fontWeight: 700, color: C.navy, marginBottom: 4 }}>{w.title}</p>
                    <p style={{ fontSize: 11, color: C.gray, lineHeight: 1.5 }}>{w.sub}</p>
                  </div>
                </div>
              </Link>
            ))}
          </div>

          {/* Dots */}
          <div style={{ display: 'flex', justifyContent: 'center', gap: 6, marginTop: 22 }}>
            {workshops.map((_, i) => (
              <button key={i} onClick={() => setWorkshopIdx(i)} style={{
                width: i === workshopIdx ? 22 : 7, height: 7, borderRadius: 99,
                border: 'none', cursor: 'pointer', padding: 0,
                background: i === workshopIdx ? C.primary : 'rgba(232,100,122,0.22)',
                transition: 'all 0.3s',
              }} />
            ))}
          </div>
        </div>
      </section>

      {/* Stripe divider */}
      <div style={{
        height: 14,
        backgroundImage: `repeating-linear-gradient(90deg, ${C.primary} 0px, ${C.primary} 24px, ${C.orange} 24px, ${C.orange} 48px)`,
      }} />

      {/* ══════════════════════════════════════════════════════════════
          FEATURED COURSES
      ══════════════════════════════════════════════════════════════ */}
      <section style={{ background: 'white', padding: '64px 0' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 40px' }}>
          <h2 style={{ fontSize: 28, fontWeight: 800, color: C.navy, marginBottom: 28 }}>
            {locale === 'es' ? 'Cursos Destacados' : 'Featured Courses'}
          </h2>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
            <Link to="/courses" style={{ textDecoration: 'none' }}>
              <div style={{
                background: C.card, borderRadius: 20, padding: 22,
                boxShadow: shadow.card, display: 'flex', alignItems: 'center', gap: 16,
                border: `1px solid ${C.border}`,
                transition: 'transform 0.22s, box-shadow 0.22s',
              }}
                onMouseEnter={e => {
                  (e.currentTarget as HTMLDivElement).style.transform = 'translateY(-3px)';
                  (e.currentTarget as HTMLDivElement).style.boxShadow = shadow.cardHover;
                }}
                onMouseLeave={e => {
                  (e.currentTarget as HTMLDivElement).style.transform = 'translateY(0)';
                  (e.currentTarget as HTMLDivElement).style.boxShadow = shadow.card;
                }}
              >
                <div style={{ width: 70, height: 70, borderRadius: 16, background: C.light, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 34, flexShrink: 0 }}>🎓</div>
                <div>
                  <span style={{ display: 'inline-block', padding: '3px 10px', borderRadius: 99, background: C.light, color: C.primary, fontSize: 10, fontWeight: 700 }}>
                    {locale === 'es' ? 'Cursos' : 'Courses'}
                  </span>
                  <p style={{ fontSize: 15, fontWeight: 700, color: C.navy, margin: '6px 0 4px' }}>
                    {locale === 'es' ? 'Aprendizaje Guiado' : 'Learning Courses'}
                  </p>
                  <p style={{ fontSize: 12, color: C.gray }}>{locale === 'es' ? 'Explora todos los cursos' : 'Check the collected education'}</p>
                </div>
              </div>
            </Link>

            <Link to="/ai-tutor" style={{ textDecoration: 'none' }}>
              <div style={{
                background: 'linear-gradient(135deg,#e8647a,#f4855c)',
                borderRadius: 20, padding: 22,
                boxShadow: shadow.btn, display: 'flex', alignItems: 'center', gap: 16,
                transition: 'transform 0.22s',
              }}
                onMouseEnter={e => (e.currentTarget as HTMLDivElement).style.transform = 'translateY(-3px)'}
                onMouseLeave={e => (e.currentTarget as HTMLDivElement).style.transform = 'translateY(0)'}
              >
                <div style={{ width: 70, height: 70, borderRadius: 16, background: 'rgba(255,255,255,0.22)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 34, flexShrink: 0 }}>🤖</div>
                <div>
                  <span style={{ display: 'inline-block', padding: '3px 10px', borderRadius: 99, background: 'rgba(255,255,255,0.22)', color: 'white', fontSize: 10, fontWeight: 700 }}>AI</span>
                  <p style={{ fontSize: 15, fontWeight: 700, color: 'white', margin: '6px 0 4px' }}>AI Tutor Session</p>
                  <p style={{ fontSize: 12, color: 'rgba(255,255,255,0.78)' }}>{locale === 'es' ? 'Aprende con IA personalizada' : 'Personalized learning with AI'}</p>
                </div>
              </div>
            </Link>
          </div>
        </div>
      </section>

      {/* Stripe divider */}
      <div style={{
        height: 14,
        backgroundImage: `repeating-linear-gradient(90deg, ${C.orange} 0px, ${C.orange} 24px, ${C.primary} 24px, ${C.primary} 48px)`,
      }} />

      {/* ══════════════════════════════════════════════════════════════
          NFT CERTIFICATES
      ══════════════════════════════════════════════════════════════ */}
      <section style={{ background: '#fdf4f6', padding: '64px 0' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 40px' }}>
          <h2 style={{ fontSize: 28, fontWeight: 800, color: C.navy, marginBottom: 28 }}>NFT Certificates</h2>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2,1fr)', gap: 16 }}>
            {certs.map((cert, i) => (
              <Link key={i} to={cert.to} style={{ textDecoration: 'none' }}>
                <div style={{
                  background: C.card, borderRadius: 20, padding: 22,
                  boxShadow: shadow.card, border: `1px solid ${C.border}`,
                  transition: 'transform 0.22s, box-shadow 0.22s',
                }}
                  onMouseEnter={e => {
                    (e.currentTarget as HTMLDivElement).style.transform = 'translateY(-3px)';
                    (e.currentTarget as HTMLDivElement).style.boxShadow = shadow.cardHover;
                  }}
                  onMouseLeave={e => {
                    (e.currentTarget as HTMLDivElement).style.transform = 'translateY(0)';
                    (e.currentTarget as HTMLDivElement).style.boxShadow = shadow.card;
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <div style={{
                        width: 28, height: 28, borderRadius: 8,
                        background: 'linear-gradient(135deg,#e8647a,#f4855c)',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                      }}>
                        <GraduationCap style={{ width: 14, height: 14, color: 'white' }} />
                      </div>
                      <p style={{ fontSize: 10, fontWeight: 800, color: C.navy }}>BESTEAMHN</p>
                    </div>
                    <span style={{ display: 'inline-flex', padding: '3px 8px', borderRadius: 99, background: `${cert.color}18`, color: cert.color, fontSize: 9, fontWeight: 700 }}>
                      NFT Certificate
                    </span>
                  </div>

                  <div style={{
                    background: `${cert.color}0a`, borderRadius: 14, padding: 16, marginBottom: 14,
                    border: `1px solid ${cert.color}22`,
                  }}>
                    <p style={{ fontSize: 9, color: C.muted, marginBottom: 4 }}>
                      {locale === 'es' ? 'Este certificado es otorgado a' : 'This certificate is awarded to'}
                    </p>
                    <p style={{ fontSize: 18, fontWeight: 800, color: C.navy, marginBottom: 2 }}>{cert.name}</p>
                    <p style={{ fontSize: 9, color: C.muted }}>{cert.id}</p>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                      <span style={{ fontSize: 14, color: '#14b8a6' }}>◎</span>
                      <p style={{ fontSize: 9, color: C.muted }}>Solana Devnet</p>
                    </div>
                    <Award style={{ width: 18, height: 18, color: cert.color }} />
                  </div>
                </div>
              </Link>
            ))}
          </div>

          <div style={{ textAlign: 'center', marginTop: 36 }}>
            <Link to="/nft-gallery" style={{
              display: 'inline-flex', alignItems: 'center', gap: 8,
              padding: '13px 30px', borderRadius: 99,
              background: 'linear-gradient(135deg,#e8647a,#f4855c)',
              color: 'white', fontSize: 14, fontWeight: 800, textDecoration: 'none',
              boxShadow: shadow.btn,
            }}>
              <Award style={{ width: 15, height: 15 }} />
              {locale === 'es' ? 'Ver todos los certificados' : 'View All Certificates'}
              <ArrowRight style={{ width: 15, height: 15 }} />
            </Link>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════════
          FOOTER
      ══════════════════════════════════════════════════════════════ */}
      <footer style={{
        background: 'white', borderTop: `1px solid ${C.border}`,
        padding: '28px 40px',
      }}>
        <div style={{
          maxWidth: 1200, margin: '0 auto',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        }}>
          <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: 10, textDecoration: 'none' }}>
            <div style={{
              width: 28, height: 28, borderRadius: 8,
              background: 'linear-gradient(135deg,#e8647a,#f4855c)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              <GraduationCap style={{ width: 15, height: 15, color: 'white' }} />
            </div>
            <span style={{ fontSize: 13, fontWeight: 700, color: C.navy }}>BESTEAMHN AI Tutor</span>
          </Link>
          <p style={{ fontSize: 12, color: C.muted }}>
            {locale === 'es' ? '© 2026 BESTEAMHN. Una ONG educativa en Honduras.' : '© 2026 BESTEAMHN. An educational NGO in Honduras.'}
          </p>
        </div>
      </footer>

      <style>{`
        @keyframes floatY {
          0%, 100% { transform: translateY(0px); }
          50%       { transform: translateY(-8px); }
        }
      `}</style>
    </div>
  );
}
