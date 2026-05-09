'use client';
// ─────────────────────────────────────────────
//  SkyJump — Endless runner with Canvas + mascot
//  Export: <SkyJump onScore={...} onExit={...} />
// ─────────────────────────────────────────────
import { useEffect, useRef, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MascotBee } from '@/components/ui/GameShared';

interface Props {
  onScore?: (score: number, xp: number) => void;
  onExit?: () => void;
}

const W = 480, H = 220;
const GROUND = H - 40;
const GRAVITY = 0.55;
const JUMP_FORCE = -11;

type GameState = 'intro' | 'playing' | 'gameover';

interface Obstacle { x: number; w: number; h: number; type: 'cactus' | 'bird'; y: number }
interface Coin { x: number; y: number; collected: boolean }
interface Cloud { x: number; y: number; w: number; speed: number }

function drawBee(ctx: CanvasRenderingContext2D, x: number, y: number, size: number, frame: number) {
  ctx.save();
  ctx.translate(x, y);
  // Wing flap
  const wingY = Math.sin(frame * 0.4) * 3;
  // Wings
  ctx.fillStyle = 'rgba(147, 197, 253, 0.8)';
  ctx.beginPath(); ctx.ellipse(-size * 0.5, wingY - size * 0.1, size * 0.4, size * 0.2, -0.3, 0, Math.PI * 2); ctx.fill();
  ctx.beginPath(); ctx.ellipse(size * 0.5, wingY - size * 0.1, size * 0.4, size * 0.2, 0.3, 0, Math.PI * 2); ctx.fill();
  // Body
  ctx.fillStyle = '#fbbf24';
  ctx.beginPath(); ctx.ellipse(0, 0, size * 0.35, size * 0.45, 0, 0, Math.PI * 2); ctx.fill();
  // Stripes
  ctx.fillStyle = 'rgba(0,0,0,0.18)';
  ctx.fillRect(-size * 0.35, -size * 0.08, size * 0.7, size * 0.15);
  ctx.fillRect(-size * 0.35, size * 0.12, size * 0.7, size * 0.15);
  // Head
  ctx.fillStyle = '#fbbf24';
  ctx.beginPath(); ctx.arc(0, -size * 0.45, size * 0.3, 0, Math.PI * 2); ctx.fill();
  // Eyes
  ctx.fillStyle = '#1c1917';
  ctx.beginPath(); ctx.arc(-size * 0.1, -size * 0.48, size * 0.07, 0, Math.PI * 2); ctx.fill();
  ctx.beginPath(); ctx.arc(size * 0.1, -size * 0.48, size * 0.07, 0, Math.PI * 2); ctx.fill();
  // Smile
  ctx.strokeStyle = '#1c1917'; ctx.lineWidth = 1.5; ctx.lineCap = 'round';
  ctx.beginPath(); ctx.arc(0, -size * 0.38, size * 0.1, 0.1, Math.PI - 0.1); ctx.stroke();
  ctx.restore();
}

function drawObstacle(ctx: CanvasRenderingContext2D, obs: Obstacle) {
  if (obs.type === 'cactus') {
    ctx.fillStyle = '#10b981';
    ctx.beginPath();
    ctx.roundRect(obs.x, obs.y - obs.h, obs.w, obs.h, [4, 4, 0, 0]);
    ctx.fill();
    // Cactus arms
    ctx.fillRect(obs.x - 8, obs.y - obs.h * 0.6, 8, 12);
    ctx.fillRect(obs.x + obs.w, obs.y - obs.h * 0.5, 8, 10);
    // Spikes emoji substitute
    ctx.fillStyle = '#065f46';
    ctx.beginPath(); ctx.arc(obs.x + obs.w / 2, obs.y - obs.h - 4, 4, 0, Math.PI * 2); ctx.fill();
  } else {
    // Bird
    ctx.fillStyle = '#f9a8d4';
    ctx.beginPath(); ctx.ellipse(obs.x + obs.w / 2, obs.y, obs.w / 2, 10, 0, 0, Math.PI * 2); ctx.fill();
    // Wings
    ctx.fillStyle = '#ec4899';
    ctx.beginPath(); ctx.ellipse(obs.x + obs.w / 2 - 12, obs.y - 8, 12, 6, -0.4, 0, Math.PI * 2); ctx.fill();
    ctx.beginPath(); ctx.ellipse(obs.x + obs.w / 2 + 12, obs.y - 8, 12, 6, 0.4, 0, Math.PI * 2); ctx.fill();
  }
}

export default function SkyJump({ onScore, onExit }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const stateRef = useRef({
    beeY: GROUND - 30, beeVY: 0, isOnGround: true,
    obstacles: [] as Obstacle[], coins: [] as Coin[], clouds: [] as Cloud[],
    score: 0, frame: 0, speed: 3, nextObs: 120, nextCoin: 60,
    stars: 0,
  });
  const gameStateRef = useRef<GameState>('intro');
  const rafRef = useRef<number>(0);
  const [uiState, setUiState] = useState<GameState>('intro');
  const [displayScore, setDisplayScore] = useState(0);
  const [displayStars, setDisplayStars] = useState(0);
  const [highScore, setHighScore] = useState(() => {
    if (typeof window !== 'undefined') return parseInt(localStorage.getItem('skyJumpHigh') || '0');
    return 0;
  });

  const jump = useCallback(() => {
    const s = stateRef.current;
    if (s.isOnGround && gameStateRef.current === 'playing') {
      s.beeVY = JUMP_FORCE;
      s.isOnGround = false;
    }
  }, []);

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.code === 'Space' || e.code === 'ArrowUp') { e.preventDefault(); jump(); }
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [jump]);

  function startGame() {
    const s = stateRef.current;
    s.beeY = GROUND - 30; s.beeVY = 0; s.isOnGround = true;
    s.obstacles = []; s.coins = []; s.clouds = [
      { x: 100, y: 40, w: 80, speed: 0.3 },
      { x: 280, y: 25, w: 60, speed: 0.5 },
      { x: 400, y: 55, w: 70, speed: 0.2 },
    ];
    s.score = 0; s.frame = 0; s.speed = 3; s.nextObs = 120; s.nextCoin = 60; s.stars = 0;
    gameStateRef.current = 'playing';
    setUiState('playing');
    setDisplayScore(0);
    setDisplayStars(0);
    cancelAnimationFrame(rafRef.current);
    rafRef.current = requestAnimationFrame(loop);
  }

  function loop() {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d')!;
    const s = stateRef.current;
    if (gameStateRef.current !== 'playing') return;

    s.frame++;
    // Speed up
    if (s.frame % 400 === 0) s.speed = Math.min(s.speed + 0.4, 10);

    // Physics
    s.beeVY += GRAVITY;
    s.beeY += s.beeVY;
    if (s.beeY >= GROUND - 30) { s.beeY = GROUND - 30; s.beeVY = 0; s.isOnGround = true; }

    // Spawn obstacles
    s.nextObs--;
    if (s.nextObs <= 0) {
      const isBird = s.score > 500 && Math.random() < 0.3;
      s.obstacles.push({
        x: W + 20,
        w: isBird ? 36 : 18,
        h: isBird ? 20 : 30 + Math.random() * 30,
        type: isBird ? 'bird' : 'cactus',
        y: isBird ? GROUND - 55 : GROUND,
      });
      s.nextObs = 80 + Math.random() * 100 - s.speed * 5;
    }

    // Spawn coins
    s.nextCoin--;
    if (s.nextCoin <= 0) {
      s.coins.push({ x: W + 20, y: GROUND - 50 - Math.random() * 60, collected: false });
      s.nextCoin = 60 + Math.random() * 60;
    }

    // Update clouds
    s.clouds.forEach(c => { c.x -= c.speed; if (c.x + c.w < 0) c.x = W + c.w; });

    // Update obstacles
    s.obstacles.forEach(o => { o.x -= s.speed; });
    s.obstacles = s.obstacles.filter(o => o.x > -50);

    // Update coins
    s.coins.forEach(c => { c.x -= s.speed; });
    s.coins = s.coins.filter(c => c.x > -20);

    // Score
    s.score += 1;
    if (s.frame % 6 === 0) setDisplayScore(Math.floor(s.score / 6));

    // Collision with obstacles
    const beeBox = { x: 20, y: s.beeY - 30, w: 30, h: 40 };
    for (const obs of s.obstacles) {
      const hit = beeBox.x < obs.x + obs.w && beeBox.x + beeBox.w > obs.x &&
        beeBox.y < obs.y && beeBox.y + beeBox.h > obs.y - obs.h;
      if (hit) {
        gameStateRef.current = 'gameover';
        const finalScore = Math.floor(s.score / 6);
        if (finalScore > highScore) {
          setHighScore(finalScore);
          localStorage.setItem('skyJumpHigh', String(finalScore));
        }
        onScore?.(finalScore, Math.round(finalScore / 5));
        setUiState('gameover');
        return;
      }
    }

    // Coin collection
    s.coins.forEach(c => {
      if (!c.collected) {
        const dist = Math.hypot(c.x - (beeBox.x + 15), c.y - s.beeY);
        if (dist < 25) { c.collected = true; s.score += 50; s.stars++; setDisplayStars(s.stars); }
      }
    });

    // ── Draw ──
    // Sky gradient
    const grad = ctx.createLinearGradient(0, 0, 0, H);
    grad.addColorStop(0, '#e0f2fe');
    grad.addColorStop(1, '#f0f9ff');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, W, H);

    // Ground
    ctx.fillStyle = '#86efac';
    ctx.fillRect(0, GROUND, W, H - GROUND);
    ctx.fillStyle = '#4ade80';
    ctx.fillRect(0, GROUND, W, 4);

    // Ground dashes
    ctx.strokeStyle = '#d1fae5'; ctx.lineWidth = 2; ctx.setLineDash([20, 15]);
    ctx.beginPath(); ctx.moveTo(0, GROUND + 12); ctx.lineTo(W, GROUND + 12); ctx.stroke();
    ctx.setLineDash([]);

    // Clouds
    ctx.fillStyle = 'rgba(255,255,255,0.85)';
    s.clouds.forEach(c => {
      ctx.beginPath();
      ctx.ellipse(c.x + c.w / 2, c.y, c.w / 2, 15, 0, 0, Math.PI * 2);
      ctx.ellipse(c.x + c.w / 3, c.y + 5, c.w / 3, 12, 0, 0, Math.PI * 2);
      ctx.ellipse(c.x + c.w * 0.7, c.y + 5, c.w / 3, 12, 0, 0, Math.PI * 2);
      ctx.fill();
    });

    // Stars/coins
    s.coins.forEach(c => {
      if (!c.collected) {
        ctx.save();
        ctx.fillStyle = '#fbbf24';
        ctx.beginPath(); ctx.arc(c.x, c.y, 8, 0, Math.PI * 2); ctx.fill();
        ctx.fillStyle = '#fde68a';
        ctx.beginPath(); ctx.arc(c.x - 2, c.y - 2, 4, 0, Math.PI * 2); ctx.fill();
        ctx.fillStyle = '#92400e';
        ctx.font = 'bold 10px sans-serif'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
        ctx.fillText('★', c.x, c.y);
        ctx.restore();
      }
    });

    // Obstacles
    s.obstacles.forEach(o => drawObstacle(ctx, o));

    // Bee
    drawBee(ctx, 50, s.beeY, 28, s.frame);

    // Score overlay
    ctx.fillStyle = 'rgba(30,41,59,0.7)';
    ctx.font = 'bold 14px "Nunito", sans-serif';
    ctx.textAlign = 'right'; ctx.textBaseline = 'top';
    ctx.fillText(`${Math.floor(s.score / 6)}`, W - 12, 10);
    ctx.textAlign = 'left';
    ctx.fillText(`⭐ ${s.stars}`, 12, 10);

    rafRef.current = requestAnimationFrame(loop);
  }

  useEffect(() => () => cancelAnimationFrame(rafRef.current), []);

  return (
    <div className="flex flex-col items-center bg-gradient-to-br from-sky-50 via-blue-50 to-indigo-100 rounded-3xl overflow-hidden">

      {/* ── Intro ── */}
      <AnimatePresence>
        {uiState === 'intro' && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="flex flex-col items-center gap-5 p-8 text-center"
          >
            <MascotBee size={110} mood="excited" />
            <div>
              <h2 className="text-3xl font-black text-slate-800">🦘 Sky Jump</h2>
              <p className="text-slate-500 mt-1 font-semibold">¡Salta obstáculos y recoge estrellas!</p>
            </div>
            <div className="flex gap-4">
              <div className="bg-white rounded-2xl px-4 py-2 shadow-sm text-center">
                <div className="font-black text-slate-700">SPACE / TAP</div>
                <div className="text-xs text-slate-400 font-semibold">para saltar</div>
              </div>
              <div className="bg-white rounded-2xl px-4 py-2 shadow-sm text-center">
                <div className="font-black text-amber-600">🏆 {highScore}</div>
                <div className="text-xs text-slate-400 font-semibold">récord</div>
              </div>
            </div>
            <div className="flex gap-3">
              <motion.button
                whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.96 }}
                onClick={startGame}
                className="bg-gradient-to-r from-sky-500 to-blue-600 text-white font-black text-lg px-8 py-3 rounded-2xl shadow-lg"
              >
                ¡Jugar! 🚀
              </motion.button>
              {onExit && (
                <button onClick={onExit} className="bg-white border border-slate-200 text-slate-600 font-bold px-6 py-3 rounded-2xl">
                  Salir
                </button>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Canvas ── */}
      {(uiState === 'playing' || uiState === 'gameover') && (
        <div className="relative w-full">
          <canvas
            ref={canvasRef}
            width={W} height={H}
            className="w-full cursor-pointer rounded-2xl"
            onClick={jump}
            onTouchStart={e => { e.preventDefault(); jump(); }}
          />
          {uiState === 'playing' && (
            <div className="absolute top-2 left-1/2 -translate-x-1/2 text-xs font-bold text-slate-500 bg-white/70 px-3 py-1 rounded-full">
              TAP para saltar
            </div>
          )}
        </div>
      )}

      {/* ── Game Over ── */}
      <AnimatePresence>
        {uiState === 'gameover' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
            className="flex flex-col items-center gap-4 p-6 text-center"
          >
            <MascotBee size={80} mood="sad" />
            <div>
              <h3 className="text-2xl font-black text-slate-800">¡Game Over!</h3>
              <p className="text-slate-500 font-semibold mt-1">
                Puntuación: <span className="font-black text-blue-600">{displayScore}</span>
                {' '}· Estrellas: <span className="font-black text-amber-500">⭐ {displayStars}</span>
              </p>
              {displayScore >= highScore && displayScore > 0 && (
                <motion.p
                  initial={{ scale: 0 }} animate={{ scale: 1 }}
                  className="text-emerald-600 font-black mt-1"
                >
                  🏆 ¡Nuevo récord!
                </motion.p>
              )}
            </div>
            <div className="flex gap-3">
              <motion.button
                whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.96 }}
                onClick={startGame}
                className="bg-gradient-to-r from-sky-500 to-blue-600 text-white font-black px-6 py-3 rounded-2xl shadow-lg"
              >
                🔄 Otra vez
              </motion.button>
              {onExit && (
                <button onClick={onExit} className="bg-white border border-slate-200 text-slate-600 font-bold px-5 py-3 rounded-2xl">
                  Salir
                </button>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
