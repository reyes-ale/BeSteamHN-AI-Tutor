// ─────────────────────────────────────────────
//  EXAMPLE: app/game-hub/page.tsx
//  Full games dashboard page
// ─────────────────────────────────────────────
// app/game-hub/page.tsx
'use client';
import { GameHub, XPProvider } from '@/components/games';

export default function GameHubPage() {
  return (
    <XPProvider>
      <GameHub />
    </XPProvider>
  );
}

// ─────────────────────────────────────────────
//  EXAMPLE: Inside a course page
//  app/courses/[id]/page.tsx
// ─────────────────────────────────────────────
// 'use client';
// import { SummaryGameButton, XPProvider } from '@/components/games';
// import { myBiologyQuestions, myBiologyCards } from './biologyData';
//
// export default function BiologyCoursePage() {
//   return (
//     <XPProvider>
//       <div className="max-w-2xl mx-auto p-6">
//         <h1>Unidad 3: La Célula</h1>
//         <p>Contenido del curso aquí...</p>
//
//         {/* ← Drop this anywhere in your course content */}
//         <div className="my-8 p-6 bg-blue-50 rounded-3xl border border-blue-200">
//           <h3 className="font-black text-lg text-slate-800 mb-2">
//             ¿Listo para repasar? 🚀
//           </h3>
//           <p className="text-slate-600 text-sm mb-4">
//             Pon a prueba lo que aprendiste con un mini juego interactivo.
//           </p>
//           <SummaryGameButton
//             courseTitle="Biología — La Célula"
//             questions={myBiologyQuestions}
//             memoryCards={myBiologyCards}
//           />
//         </div>
//       </div>
//     </XPProvider>
//   );
// }

// ─────────────────────────────────────────────
//  EXAMPLE: Single game card on dashboard
// ─────────────────────────────────────────────
// 'use client';
// import { GameCard, XPProvider } from '@/components/games';
//
// export default function DashboardPage() {
//   return (
//     <XPProvider>
//       <div className="grid grid-cols-2 gap-4">
//         <GameCard gameId="quiz-battle" />
//         <GameCard gameId="sky-jump" />
//         <GameCard gameId="memory-match" />
//         <GameCard gameId="speed-challenge" variant="card" />
//       </div>
//     </XPProvider>
//   );
// }

// ─────────────────────────────────────────────
//  EXAMPLE: Embedded game (no modal)
// ─────────────────────────────────────────────
// <GameCard gameId="quiz-battle" variant="embed" className="mt-6" />

// ─────────────────────────────────────────────
//  EXAMPLE: Button only (opens modal on click)
// ─────────────────────────────────────────────
// <GameCard gameId="quiz-battle" variant="button" />

// ─────────────────────────────────────────────
//  EXAMPLE: Custom course data
// ─────────────────────────────────────────────
// const myQuestions = [
//   {
//     id: 'q1', emoji: '🔬', topicTag: 'Mi Curso',
//     question: '¿Cuál es...?',
//     options: ['Opción A', 'Opción B', 'Opción C', 'Opción D'],
//     correctIndex: 1,
//     explanation: 'Porque...',
//   },
// ];
// <GameCard gameId="quiz-battle" courseData={{ questions: myQuestions }} />

export {};
