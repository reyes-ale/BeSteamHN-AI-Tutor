// ─────────────────────────────────────────────
//  BESTEAMHN AI Tutor — Mock Data
// ─────────────────────────────────────────────
import type { QuizQuestion, MemoryCard, DragDropItem, DragDropZone, LeaderboardEntry } from '@/types/games';

// ── Quiz Questions (Biology Example) ──────────
export const QUIZ_QUESTIONS: QuizQuestion[] = [
  {
    id: 'q1', emoji: '🔬', topicTag: 'Biología',
    question: '¿Cuál es la unidad básica de la vida?',
    options: ['El átomo', 'La célula', 'El tejido', 'El órgano'],
    correctIndex: 1,
    explanation: 'La célula es la unidad estructural y funcional de todos los seres vivos.',
  },
  {
    id: 'q2', emoji: '🌱', topicTag: 'Biología',
    question: '¿Qué proceso usan las plantas para hacer su alimento?',
    options: ['Respiración', 'Digestión', 'Fotosíntesis', 'Fermentación'],
    correctIndex: 2,
    explanation: 'La fotosíntesis convierte luz solar, CO₂ y agua en glucosa y oxígeno.',
  },
  {
    id: 'q3', emoji: '🧬', topicTag: 'Biología',
    question: '¿Cuántos cromosomas tiene un ser humano?',
    options: ['23', '44', '46', '48'],
    correctIndex: 2,
    explanation: 'Los humanos tienen 46 cromosomas organizados en 23 pares.',
  },
  {
    id: 'q4', emoji: '🫀', topicTag: 'Biología',
    question: '¿Cuántas cámaras tiene el corazón humano?',
    options: ['2', '3', '4', '5'],
    correctIndex: 2,
    explanation: 'El corazón tiene 4 cámaras: 2 aurículas y 2 ventrículos.',
  },
  {
    id: 'q5', emoji: '🦠', topicTag: 'Biología',
    question: '¿Qué tipo de organismo NO tiene núcleo definido?',
    options: ['Eucariota', 'Procariota', 'Fungi', 'Protista'],
    correctIndex: 1,
    explanation: 'Los procariotas (bacterias) carecen de núcleo membranoso.',
  },
  {
    id: 'q6', emoji: '💧', topicTag: 'Química',
    question: '¿Cuál es la fórmula química del agua?',
    options: ['CO₂', 'H₂O', 'NaCl', 'O₂'],
    correctIndex: 1,
    explanation: 'H₂O: 2 átomos de Hidrógeno + 1 de Oxígeno.',
  },
  {
    id: 'q7', emoji: '⚡', topicTag: 'Física',
    question: '¿Cuál es la unidad de medida de la corriente eléctrica?',
    options: ['Voltio', 'Ohmio', 'Amperio', 'Vatio'],
    correctIndex: 2,
    explanation: 'El Amperio (A) mide la intensidad de corriente eléctrica.',
  },
  {
    id: 'q8', emoji: '🌍', topicTag: 'Geografía',
    question: '¿Cuál es la capital de Honduras?',
    options: ['San Pedro Sula', 'Comayagua', 'La Ceiba', 'Tegucigalpa'],
    correctIndex: 3,
    explanation: 'Tegucigalpa es la capital y ciudad más poblada de Honduras.',
  },
];

// ── Memory Match Cards ─────────────────────────
export const MEMORY_CARDS: MemoryCard[] = [
  { id: 'term-1', content: 'Fotosíntesis', emoji: '🌿', matchId: 'def-1', type: 'term' },
  { id: 'def-1', content: 'Proceso que convierte luz en energía', emoji: '☀️', matchId: 'term-1', type: 'definition' },
  { id: 'term-2', content: 'Mitosis', emoji: '🔬', matchId: 'def-2', type: 'term' },
  { id: 'def-2', content: 'División celular para crecimiento', emoji: '🧫', matchId: 'term-2', type: 'definition' },
  { id: 'term-3', content: 'ADN', emoji: '🧬', matchId: 'def-3', type: 'term' },
  { id: 'def-3', content: 'Ácido desoxirribonucleico — material genético', emoji: '🔑', matchId: 'term-3', type: 'definition' },
  { id: 'term-4', content: 'Ecosistema', emoji: '🌳', matchId: 'def-4', type: 'term' },
  { id: 'def-4', content: 'Comunidad biótica + ambiente físico', emoji: '🌎', matchId: 'term-4', type: 'definition' },
  { id: 'term-5', content: 'Neurona', emoji: '🧠', matchId: 'def-5', type: 'term' },
  { id: 'def-5', content: 'Célula del sistema nervioso', emoji: '⚡', matchId: 'term-5', type: 'definition' },
  { id: 'term-6', content: 'Osmosis', emoji: '💧', matchId: 'def-6', type: 'term' },
  { id: 'def-6', content: 'Paso de agua por membrana semipermeable', emoji: '🌊', matchId: 'term-6', type: 'definition' },
];

// ── Drag & Drop Data ───────────────────────────
export const DD_ZONES: DragDropZone[] = [
  { id: 'zona-animal', label: '🐾 Reino Animal', color: 'blue' },
  { id: 'zona-vegetal', label: '🌿 Reino Vegetal', color: 'green' },
  { id: 'zona-fungi', label: '🍄 Reino Fungi', color: 'purple' },
];

export const DD_ITEMS: DragDropItem[] = [
  { id: 'item-1', text: 'León', emoji: '🦁', correctZoneId: 'zona-animal' },
  { id: 'item-2', text: 'Rosa', emoji: '🌹', correctZoneId: 'zona-vegetal' },
  { id: 'item-3', text: 'Champiñón', emoji: '🍄', correctZoneId: 'zona-fungi' },
  { id: 'item-4', text: 'Águila', emoji: '🦅', correctZoneId: 'zona-animal' },
  { id: 'item-5', text: 'Roble', emoji: '🌳', correctZoneId: 'zona-vegetal' },
  { id: 'item-6', text: 'Levadura', emoji: '🧫', correctZoneId: 'zona-fungi' },
  { id: 'item-7', text: 'Tiburón', emoji: '🦈', correctZoneId: 'zona-animal' },
  { id: 'item-8', text: 'Cactus', emoji: '🌵', correctZoneId: 'zona-vegetal' },
];

// ── Speed Challenge Questions ──────────────────
export const SPEED_QUESTIONS = QUIZ_QUESTIONS.map(q => ({
  ...q,
  timeLimit: 8, // seconds per question
}));

// ── Leaderboard Mock Data ──────────────────────
export const LEADERBOARD_DATA: LeaderboardEntry[] = [
  { rank: 1, name: 'María L.', avatar: '🦅', score: 9420, xp: 12500 },
  { rank: 2, name: 'Carlos R.', avatar: '🐉', score: 8110, xp: 10200 },
  { rank: 3, name: 'Sofia M.', avatar: '🦊', score: 7890, xp: 9800 },
  { rank: 4, name: 'Diego S.', avatar: '🐯', score: 6540, xp: 8100 },
  { rank: 5, name: 'Ana P.', avatar: '🦋', score: 5320, xp: 6700 },
  { rank: 6, name: 'Tú', avatar: '🚀', score: 4800, xp: 5600, isCurrentUser: true },
  { rank: 7, name: 'Luis T.', avatar: '🦁', score: 4200, xp: 5100 },
];

// ── XP Level Table ────────────────────────────
export const XP_LEVELS = [
  { level: 1, minXP: 0, title: 'Explorador' },
  { level: 2, minXP: 500, title: 'Aprendiz' },
  { level: 3, minXP: 1200, title: 'Estudiante' },
  { level: 4, minXP: 2500, title: 'Practicante' },
  { level: 5, minXP: 4500, title: 'Avanzado' },
  { level: 6, minXP: 7000, title: 'Experto' },
  { level: 7, minXP: 10000, title: 'Maestro' },
  { level: 8, minXP: 15000, title: 'Campeón' },
  { level: 9, minXP: 22000, title: 'Leyenda' },
  { level: 10, minXP: 30000, title: 'Élite ⭐' },
];
