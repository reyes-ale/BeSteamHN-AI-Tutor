# 🎮 BESTEAMHN AI Tutor — Mini Games System

Sistema completo de mini juegos educativos para integrar en cualquier plataforma Next.js.

**Stack:** React 18 · TypeScript · Next.js 14 · Tailwind CSS · Framer Motion

---

## 📁 Estructura de Carpetas

```
besteamhn-games/
├── components/
│   ├── games/
│   │   ├── index.ts              ← Barrel export (importa todo desde aquí)
│   │   ├── GameCard.tsx          ← Launcher card reutilizable
│   │   ├── GameHub.tsx           ← Dashboard completo de juegos
│   │   ├── SummaryGameButton.tsx ← Botón "🎮 Hacer Summary Game"
│   │   ├── QuizBattle.tsx        ← Quiz con combos + temporizador
│   │   ├── MemoryMatch.tsx       ← Cartas de memoria
│   │   ├── DragDropChallenge.tsx ← Arrastar y clasificar
│   │   ├── SpeedChallenge.tsx    ← Arcade de velocidad + power-ups
│   │   ├── SkyJump.tsx           ← Endless runner con Canvas
│   │   └── ColorDash.tsx         ← Juego de reflejos de colores
│   └── ui/
│       └── GameShared.tsx        ← Componentes compartidos (mascots, UI)
├── hooks/
│   ├── useXPStore.tsx            ← Sistema de XP + nivel + badges
│   └── useGameTimer.ts           ← Hook de temporizador reutilizable
├── types/
│   └── games.ts                  ← Todos los tipos TypeScript
├── data/
│   └── mockData.ts               ← Datos de ejemplo para todos los juegos
├── lib/
│   └── examples.tsx              ← Ejemplos de integración
├── package.json
├── tailwind.config.js
└── tsconfig.json
```

---

## 🚀 Instalación desde cero

### 1. Crear nuevo proyecto Next.js

```bash
npx create-next-app@latest besteamhn-games \
  --typescript \
  --tailwind \
  --app \
  --no-src-dir

cd besteamhn-games
```

### 2. Instalar dependencias

```bash
npm install framer-motion
```

### 3. Copiar archivos

```bash
# Copiar todas las carpetas del proyecto:
cp -r components/ tu-proyecto/
cp -r hooks/ tu-proyecto/
cp -r types/ tu-proyecto/
cp -r data/ tu-proyecto/
```

### 4. Agregar fuentes (app/layout.tsx)

```tsx
import { Nunito, Space_Grotesk } from 'next/font/google';

const nunito = Nunito({
  subsets: ['latin'],
  variable: '--font-nunito',
  weight: ['400', '600', '700', '800', '900'],
});

const spaceGrotesk = Space_Grotesk({
  subsets: ['latin'],
  variable: '--font-space',
  weight: ['400', '500', '600', '700'],
});

export default function RootLayout({ children }) {
  return (
    <html lang="es">
      <body className={`${nunito.variable} ${spaceGrotesk.variable} font-sans`}>
        {children}
      </body>
    </html>
  );
}
```

### 5. Correr el proyecto

```bash
npm run dev
# → http://localhost:3000
```

---

## 🔌 Integración en tu proyecto existente

### Opción A — Copiar a tu proyecto

```bash
# Desde la carpeta de este proyecto:
cp -r components/games/ ../mi-proyecto/components/games/
cp -r components/ui/GameShared.tsx ../mi-proyecto/components/ui/
cp -r hooks/ ../mi-proyecto/hooks/
cp -r types/games.ts ../mi-proyecto/types/
cp -r data/mockData.ts ../mi-proyecto/data/

# Instalar framer-motion si no lo tienes:
cd ../mi-proyecto
npm install framer-motion
```

### Opción B — NPM package (futuro)

```bash
# Próximamente disponible como:
npm install @besteamhn/games
```

---

## 📖 Guía de uso por componente

---

### 1. XPProvider — Envolver tu app (OBLIGATORIO)

```tsx
// app/layout.tsx o en el layout donde uses juegos
import { XPProvider } from '@/components/games';

export default function Layout({ children }) {
  return (
    <XPProvider>
      {children}
    </XPProvider>
  );
}
```

---

### 2. GameHub — Dashboard completo

```tsx
// app/games/page.tsx
import { GameHub, XPProvider } from '@/components/games';

export default function GamesPage() {
  return (
    <XPProvider>
      <GameHub />
    </XPProvider>
  );
}
```

---

### 3. SummaryGameButton — Dentro de cursos ⭐

Este es el componente principal para integrar en páginas de cursos.

```tsx
// app/courses/biologia/page.tsx
'use client';
import { SummaryGameButton } from '@/components/games';

// Opcional: pasar preguntas del curso
const bioQuestions = [
  {
    id: 'q1',
    emoji: '🔬',
    topicTag: 'Biología',
    question: '¿Cuál es la unidad básica de la vida?',
    options: ['El átomo', 'La célula', 'El tejido', 'El órgano'],
    correctIndex: 1,
    explanation: 'La célula es la unidad estructural y funcional de todos los seres vivos.',
  },
  // ... más preguntas
];

export default function BiologiaPage() {
  return (
    <div className="max-w-3xl mx-auto p-6">
      <h1>Unidad 3: La Célula</h1>

      {/* Tu contenido del curso... */}

      {/* ← Agrega esto al final de cada lección */}
      <div className="mt-8 p-6 bg-gradient-to-r from-blue-50 to-violet-50 rounded-3xl border border-blue-100">
        <h3 className="font-black text-xl mb-1">¿Listo para repasar? 🚀</h3>
        <p className="text-slate-600 text-sm mb-4">
          Pon a prueba lo que aprendiste en esta lección.
        </p>
        <div className="flex gap-3 flex-wrap">
          <SummaryGameButton
            courseTitle="Biología — La Célula"
            questions={bioQuestions}
            variant="primary"
          />
          <SummaryGameButton
            courseTitle="Biología — La Célula"
            questions={bioQuestions}
            variant="secondary"
          />
        </div>
      </div>
    </div>
  );
}
```

---

### 4. GameCard — Tarjeta individual

```tsx
import { GameCard } from '@/components/games';

// Tarjeta completa con modal
<GameCard gameId="quiz-battle" />
<GameCard gameId="memory-match" />
<GameCard gameId="sky-jump" />

// Solo botón
<GameCard gameId="quiz-battle" variant="button" />

// Embebido directo (sin modal)
<GameCard gameId="speed-challenge" variant="embed" />

// Con datos del curso
<GameCard
  gameId="quiz-battle"
  courseData={{ questions: misPreguntas }}
/>
```

---

### 5. Juegos individuales (uso directo)

```tsx
import { QuizBattle, MemoryMatch, DragDropChallenge, SpeedChallenge } from '@/components/games';

// QuizBattle
<QuizBattle
  questions={misPreguntas}
  onComplete={(score, xp) => console.log('Score:', score, 'XP:', xp)}
  onExit={() => router.back()}
/>

// MemoryMatch
<MemoryMatch
  cards={misCartas}
  onComplete={(score, xp) => guardarProgreso(score, xp)}
  onExit={() => setGameOpen(false)}
/>

// DragDropChallenge
<DragDropChallenge
  items={misElementos}
  zones={misZonas}
  onComplete={(score, xp) => subirXP(xp)}
/>

// SpeedChallenge
<SpeedChallenge
  questions={misPreguntas}
  onComplete={(score, xp) => actualizarLeaderboard(score)}
/>
```

---

### 6. Sistema de XP

```tsx
import { useXP } from '@/components/games';

function MiComponente() {
  const { stats, levelInfo, addXP } = useXP();

  // Datos disponibles:
  stats.totalXP        // → 1240
  stats.level          // → 3
  stats.streak         // → 12
  stats.badges         // → [{ id, name, emoji }]

  levelInfo.currentLevel.title  // → "Estudiante"
  levelInfo.progress            // → 62 (porcentaje)
  levelInfo.xpInLevel           // → XP en el nivel actual

  // Agregar XP manualmente:
  addXP({
    gameId: 'quiz-battle',
    xpEarned: 150,
    score: 1200,
    timestamp: Date.now(),
  });
}
```

---

### 7. Timer hook (para crear tus propios juegos)

```tsx
import { useGameTimer } from '@/components/games';

function MiJuego() {
  const timer = useGameTimer({
    initialSeconds: 30,
    autoStart: false,
    onExpire: () => console.log('¡Tiempo!'),
  });

  return (
    <>
      <div>{timer.timeLeft}s</div>
      <div className="w-full h-2 bg-gray-200 rounded">
        <div
          style={{ width: `${timer.percentLeft}%` }}
          className={`h-full rounded ${timer.isDanger ? 'bg-red-500' : 'bg-green-500'}`}
        />
      </div>
      <button onClick={timer.start}>Iniciar</button>
      <button onClick={timer.pause}>Pausar</button>
      <button onClick={() => timer.reset(60)}>Reset (60s)</button>
    </>
  );
}
```

---

## 🎨 Personalizar datos

### Crear preguntas para tu curso

```typescript
// data/myCourseData.ts
import type { QuizQuestion } from '@/types/games';

export const MATH_QUESTIONS: QuizQuestion[] = [
  {
    id: 'math-1',
    emoji: '📐',
    topicTag: 'Geometría',
    question: '¿Cuántos lados tiene un hexágono?',
    options: ['4', '5', '6', '8'],
    correctIndex: 2,
    explanation: 'El prefijo "hexa" significa seis en griego.',
  },
];
```

### Crear cartas de memoria

```typescript
import type { MemoryCard } from '@/types/games';

export const HISTORY_CARDS: MemoryCard[] = [
  { id: 't-1', content: 'Independencia de Honduras', emoji: '🇭🇳', matchId: 'd-1', type: 'term' },
  { id: 'd-1', content: '15 de septiembre de 1821', emoji: '📅', matchId: 't-1', type: 'definition' },
];
```

### Crear zonas para Drag & Drop

```typescript
import type { DragDropItem, DragDropZone } from '@/types/games';

export const SCIENCE_ZONES: DragDropZone[] = [
  { id: 'zona-fisica', label: '⚡ Física', color: 'blue' },
  { id: 'zona-quimica', label: '⚗️ Química', color: 'green' },
];

export const SCIENCE_ITEMS: DragDropItem[] = [
  { id: 'it-1', text: 'Gravedad', emoji: '🍎', correctZoneId: 'zona-fisica' },
  { id: 'it-2', text: 'Oxidación', emoji: '🔥', correctZoneId: 'zona-quimica' },
];
```

---

## 🔧 Variables de entorno (opcional)

```env
# .env.local
NEXT_PUBLIC_APP_NAME="BESTEAMHN AI Tutor"
NEXT_PUBLIC_ENABLE_SOUNDS=true
```

---

## 📦 Checklist de integración

```
✅ npm install framer-motion
✅ Copiar /components/games/ a tu proyecto
✅ Copiar /components/ui/GameShared.tsx
✅ Copiar /hooks/ a tu proyecto
✅ Copiar /types/games.ts
✅ Copiar /data/mockData.ts
✅ Envolver tu app con <XPProvider>
✅ Agregar fuentes Nunito y Space Grotesk
✅ Importar y usar componentes
```

---

## 🎮 Demo rápida

```tsx
// app/demo/page.tsx
import { XPProvider, GameHub } from '@/components/games';

export default function Demo() {
  return <XPProvider><GameHub /></XPProvider>;
}
```

Visita `http://localhost:3000/demo` y verás todos los juegos funcionando.

---

## 🏗 Arquitectura de componentes

```
XPProvider (context global de XP)
└── GameHub (dashboard)
    ├── GameCard × N (launchers)
    │   └── [Modal]
    │       ├── QuizBattle
    │       ├── MemoryMatch
    │       ├── DragDropChallenge
    │       ├── SpeedChallenge
    │       ├── SkyJump
    │       └── ColorDash
    └── Leaderboard + Badges

SummaryGameButton (en páginas de cursos)
└── [Picker modal]
    └── [Game modal]
        └── QuizBattle / MemoryMatch / DragDrop / Speed
```

---

## ✨ Características incluidas

| Feature | Estado |
|---------|--------|
| ⚔️ Quiz Battle con combos | ✅ |
| 🧠 Memory Match con flip 3D | ✅ |
| 🎯 Drag & Drop con touch | ✅ |
| ⚡ Speed Challenge + power-ups | ✅ |
| 🦘 Sky Jump (Canvas runner) | ✅ |
| 🎨 Color Dash (reflejos) | ✅ |
| ✨ Sistema de XP persistente | ✅ |
| 🏆 Leaderboard mock | ✅ |
| 🏅 Badges / logros | ✅ |
| 📱 Responsive + touch | ✅ |
| 🎭 Mascota animada (SVG) | ✅ |
| 🌈 Framer Motion animations | ✅ |
| 💾 Persistencia localStorage | ✅ |
| 🔄 Reiniciar juego | ✅ |
| 📊 Pantalla de resultados | ✅ |
| 🎯 Sistema de estrellas | ✅ |

---

**Made with ❤️ for BESTEAMHN AI Tutor**
