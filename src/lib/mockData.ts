export interface Course {
  id: string;
  title: { en: string; es: string };
  description: { en: string; es: string };
  category: 'programming' | 'softSkills' | 'design' | 'robotics';
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  lessons: number;
  duration: string;
  steamReward: number;
  enrolled: number;
  image: string;
  color: string;
}

export interface EnrolledCourse extends Course {
  lessonsCompleted: number;
  status: 'in_progress' | 'completed' | 'not_started';
}

export interface NFTCertificate {
  id: string;
  courseName: { en: string; es: string };
  studentName: string;
  completionDate: string;
  grade: string;
  mintAddress: string;
  image: string;
  color: string;
}

export interface Workshop {
  id: string;
  title: { en: string; es: string };
  description: { en: string; es: string };
  date: string;
  time: string;
  instructor: string;
  location: string;
  capacity: number;
  reserved: number;
  isReserved: boolean;
}

export interface LeaderboardEntry {
  rank: number;
  name: string;
  avatar: string;
  steam: number;
  coursesCompleted: number;
  certificates: number;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

export interface StudentProgress {
  week: string;
  lessons: number;
  steam: number;
}

export const courses: Course[] = [
  {
    id: '1',
    title: { en: 'Introduction to Python', es: 'Introducción a Python' },
    description: {
      en: 'Learn the fundamentals of Python programming. Build real projects from day one with hands-on exercises.',
      es: 'Aprende los fundamentos de la programación en Python. Construye proyectos reales desde el primer día.',
    },
    category: 'programming',
    difficulty: 'beginner',
    lessons: 12,
    duration: '6 weeks',
    steamReward: 50,
    enrolled: 234,
    image: '🐍',
    color: 'from-blue-500 to-cyan-500',
  },
  {
    id: '2',
    title: { en: 'Web Development Basics', es: 'Fundamentos de Desarrollo Web' },
    description: {
      en: 'Master HTML, CSS, and JavaScript to build beautiful websites from scratch.',
      es: 'Domina HTML, CSS y JavaScript para construir sitios web hermosos desde cero.',
    },
    category: 'programming',
    difficulty: 'beginner',
    lessons: 15,
    duration: '8 weeks',
    steamReward: 75,
    enrolled: 189,
    image: '🌐',
    color: 'from-indigo-500 to-purple-500',
  },
  {
    id: '3',
    title: { en: 'Leadership & Teamwork', es: 'Liderazgo y Trabajo en Equipo' },
    description: {
      en: 'Develop essential leadership skills and learn to collaborate effectively in teams.',
      es: 'Desarrolla habilidades de liderazgo esenciales y aprende a colaborar efectivamente en equipo.',
    },
    category: 'softSkills',
    difficulty: 'beginner',
    lessons: 8,
    duration: '4 weeks',
    steamReward: 40,
    enrolled: 156,
    image: '🤝',
    color: 'from-emerald-500 to-teal-500',
  },
  {
    id: '4',
    title: { en: 'Digital Design with Figma', es: 'Diseño Digital con Figma' },
    description: {
      en: 'Create stunning user interfaces and design systems using Figma.',
      es: 'Crea interfaces de usuario impresionantes y sistemas de diseño usando Figma.',
    },
    category: 'design',
    difficulty: 'intermediate',
    lessons: 10,
    duration: '5 weeks',
    steamReward: 50,
    enrolled: 98,
    image: '🎨',
    color: 'from-pink-500 to-rose-500',
  },
  {
    id: '5',
    title: { en: 'Arduino & Robotics', es: 'Arduino y Robótica' },
    description: {
      en: 'Build robots and IoT devices using Arduino microcontrollers.',
      es: 'Construye robots y dispositivos IoT usando microcontroladores Arduino.',
    },
    category: 'robotics',
    difficulty: 'intermediate',
    lessons: 14,
    duration: '7 weeks',
    steamReward: 70,
    enrolled: 72,
    image: '🤖',
    color: 'from-orange-500 to-amber-500',
  },
  {
    id: '6',
    title: { en: 'Advanced JavaScript', es: 'JavaScript Avanzado' },
    description: {
      en: 'Deep dive into advanced JavaScript patterns, async programming, and modern frameworks.',
      es: 'Profundiza en patrones avanzados de JavaScript, programación asíncrona y frameworks modernos.',
    },
    category: 'programming',
    difficulty: 'advanced',
    lessons: 18,
    duration: '9 weeks',
    steamReward: 90,
    enrolled: 64,
    image: '⚡',
    color: 'from-yellow-500 to-orange-500',
  },
  {
    id: '7',
    title: { en: 'Communication Skills', es: 'Habilidades de Comunicación' },
    description: {
      en: 'Master the art of public speaking, presentation, and interpersonal communication.',
      es: 'Domina el arte de hablar en público, presentaciones y comunicación interpersonal.',
    },
    category: 'softSkills',
    difficulty: 'beginner',
    lessons: 6,
    duration: '3 weeks',
    steamReward: 30,
    enrolled: 201,
    image: '💬',
    color: 'from-violet-500 to-purple-500',
  },
  {
    id: '8',
    title: { en: '3D Modeling Basics', es: 'Fundamentos de Modelado 3D' },
    description: {
      en: 'Learn 3D modeling and rendering techniques for games and visualization.',
      es: 'Aprende técnicas de modelado y renderizado 3D para juegos y visualización.',
    },
    category: 'design',
    difficulty: 'advanced',
    lessons: 16,
    duration: '8 weeks',
    steamReward: 80,
    enrolled: 45,
    image: '🧊',
    color: 'from-sky-500 to-blue-500',
  },
];

export const enrolledCourses: EnrolledCourse[] = [
  { ...courses[0], lessonsCompleted: 8, status: 'in_progress' },
  { ...courses[2], lessonsCompleted: 8, status: 'completed' },
  { ...courses[4], lessonsCompleted: 3, status: 'in_progress' },
];

export const nftCertificates: NFTCertificate[] = [
  {
    id: '1',
    courseName: { en: 'Leadership & Teamwork', es: 'Liderazgo y Trabajo en Equipo' },
    studentName: 'María García',
    completionDate: '2025-12-15',
    grade: 'A+',
    mintAddress: '7xKp...3mNq',
    image: '🏆',
    color: 'from-emerald-400 to-teal-500',
  },
  {
    id: '2',
    courseName: { en: 'Introduction to Python', es: 'Introducción a Python' },
    studentName: 'María García',
    completionDate: '2026-02-20',
    grade: 'A',
    mintAddress: '9bRf...7kLm',
    image: '🐍',
    color: 'from-blue-400 to-indigo-500',
  },
];

export const workshops: Workshop[] = [
  {
    id: '1',
    title: { en: 'Blockchain for Beginners', es: 'Blockchain para Principiantes' },
    description: {
      en: 'Hands-on workshop exploring blockchain technology and Solana.',
      es: 'Taller práctico explorando la tecnología blockchain y Solana.',
    },
    date: '2026-06-15',
    time: '10:00 AM',
    instructor: 'Carlos Mendoza',
    location: 'Tegucigalpa Hub',
    capacity: 30,
    reserved: 22,
    isReserved: false,
  },
  {
    id: '2',
    title: { en: 'Robot Building Workshop', es: 'Taller de Construcción de Robots' },
    description: {
      en: 'Build your first robot using Arduino and basic electronics.',
      es: 'Construye tu primer robot usando Arduino y electrónica básica.',
    },
    date: '2026-06-22',
    time: '2:00 PM',
    instructor: 'Ana Reyes',
    location: 'San Pedro Sula Lab',
    capacity: 20,
    reserved: 18,
    isReserved: true,
  },
  {
    id: '3',
    title: { en: 'AI & Machine Learning Intro', es: 'Intro a IA y Machine Learning' },
    description: {
      en: 'Discover how AI works and build your first machine learning model.',
      es: 'Descubre cómo funciona la IA y construye tu primer modelo de machine learning.',
    },
    date: '2026-07-05',
    time: '11:00 AM',
    instructor: 'Luis Hernández',
    location: 'Virtual / Zoom',
    capacity: 50,
    reserved: 31,
    isReserved: false,
  },
  {
    id: '4',
    title: { en: 'Design Thinking Workshop', es: 'Taller de Design Thinking' },
    description: {
      en: 'Learn the design thinking process to solve real-world problems.',
      es: 'Aprende el proceso de design thinking para resolver problemas del mundo real.',
    },
    date: '2026-07-12',
    time: '9:00 AM',
    instructor: 'Sofía López',
    location: 'Tegucigalpa Hub',
    capacity: 25,
    reserved: 25,
    isReserved: false,
  },
];

export const leaderboard: LeaderboardEntry[] = [
  { rank: 1, name: 'María García', avatar: 'MG', steam: 1250, coursesCompleted: 8, certificates: 6 },
  { rank: 2, name: 'José Martínez', avatar: 'JM', steam: 1100, coursesCompleted: 7, certificates: 5 },
  { rank: 3, name: 'Andrea López', avatar: 'AL', steam: 980, coursesCompleted: 6, certificates: 5 },
  { rank: 4, name: 'Carlos Rodríguez', avatar: 'CR', steam: 890, coursesCompleted: 6, certificates: 4 },
  { rank: 5, name: 'Lucía Hernández', avatar: 'LH', steam: 820, coursesCompleted: 5, certificates: 4 },
  { rank: 6, name: 'Diego Flores', avatar: 'DF', steam: 750, coursesCompleted: 5, certificates: 3 },
  { rank: 7, name: 'Valentina Cruz', avatar: 'VC', steam: 680, coursesCompleted: 4, certificates: 3 },
  { rank: 8, name: 'Miguel Torres', avatar: 'MT', steam: 610, coursesCompleted: 4, certificates: 2 },
  { rank: 9, name: 'Isabella Ramos', avatar: 'IR', steam: 540, coursesCompleted: 3, certificates: 2 },
  { rank: 10, name: 'Santiago Mejía', avatar: 'SM', steam: 470, coursesCompleted: 3, certificates: 1 },
];

export const weeklyProgress: StudentProgress[] = [
  { week: 'Sem 1', lessons: 3, steam: 30 },
  { week: 'Sem 2', lessons: 5, steam: 50 },
  { week: 'Sem 3', lessons: 4, steam: 40 },
  { week: 'Sem 4', lessons: 7, steam: 70 },
  { week: 'Sem 5', lessons: 6, steam: 60 },
  { week: 'Sem 6', lessons: 8, steam: 80 },
  { week: 'Sem 7', lessons: 5, steam: 50 },
  { week: 'Sem 8', lessons: 9, steam: 90 },
];

export const tokenHistory = [
  { date: '2026-05-07', amount: 10, reason: { en: 'Lesson completed: Python Variables', es: 'Lección completada: Variables en Python' } },
  { date: '2026-05-06', amount: 5, reason: { en: 'AI Tutor quiz bonus', es: 'Bono de quiz con Tutor IA' } },
  { date: '2026-05-05', amount: 10, reason: { en: 'Lesson completed: Python Loops', es: 'Lección completada: Bucles en Python' } },
  { date: '2026-05-04', amount: 50, reason: { en: 'Course completed: Leadership', es: 'Curso completado: Liderazgo' } },
  { date: '2026-05-03', amount: 10, reason: { en: 'Lesson completed: Teamwork Basics', es: 'Lección completada: Trabajo en Equipo' } },
  { date: '2026-05-02', amount: 5, reason: { en: 'AI Tutor question bonus', es: 'Bono de pregunta al Tutor IA' } },
  { date: '2026-05-01', amount: 10, reason: { en: 'Lesson completed: Arduino Setup', es: 'Lección completada: Configuración Arduino' } },
];

export const adminStudents = [
  { id: '1', name: 'María García', wallet: '7xKp...3mNq', coursesEnrolled: 3, completed: 1, steam: 350 },
  { id: '2', name: 'José Martínez', wallet: '4bRn...8pQw', coursesEnrolled: 2, completed: 1, steam: 280 },
  { id: '3', name: 'Andrea López', wallet: '2cTm...5jKr', coursesEnrolled: 4, completed: 2, steam: 420 },
  { id: '4', name: 'Carlos Rodríguez', wallet: '8dSl...1hGe', coursesEnrolled: 1, completed: 0, steam: 90 },
  { id: '5', name: 'Lucía Hernández', wallet: '6fWp...9tBn', coursesEnrolled: 3, completed: 2, steam: 380 },
];
