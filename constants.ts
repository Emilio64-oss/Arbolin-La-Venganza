import { Skin, Difficulty, StoryPart } from './types';

// Swapped dimensions for Vertical/Portrait Mode
export const CANVAS_WIDTH = 450;
export const CANVAS_HEIGHT = 800;

// Doubled speed as requested
export const PLAYER_SPEED = 8;

// Fire mechanics
export const FIRE_WIDTH = 40;
export const FIRE_HEIGHT = 50;

export const DIFFICULTY_ORDER: Difficulty[] = ['easy', 'normal', 'hard', 'extreme', 'hacker'];

export const DIFFICULTY_CONFIG: Record<Difficulty, { winScore: number; spawnRate: number; label: string; color: string }> = {
  easy: { winScore: 10, spawnRate: 60, label: 'Fácil', color: '#22c55e' },
  normal: { winScore: 20, spawnRate: 40, label: 'Medio', color: '#eab308' },
  hard: { winScore: 30, spawnRate: 25, label: 'Difícil', color: '#f97316' },
  extreme: { winScore: 50, spawnRate: 15, label: 'Extremo', color: '#ef4444' },
  hacker: { winScore: 100, spawnRate: 5, label: 'HACKER', color: '#a855f7' },
};

// Secrets Configuration
// Locations are percentages of canvas width/height to be responsive-ish
export const SECRETS_CONFIG = [
  { id: 1, difficulty: 'normal', xMin: 0.85, yMax: 0.1, label: 'Esquina Superior Derecha' }, // Top Right
  { id: 2, difficulty: 'easy', xMax: 0.15, yMax: 0.1, label: 'Esquina Superior Izquierda' }, // Top Left
  { id: 3, difficulty: 'easy', xMax: 0.15, yMin: 0.9, label: 'Esquina Inferior Izquierda' }, // Bottom Left
  { id: 4, difficulty: 'hard', xMin: 0.85, yMin: 0.9, label: 'Esquina Inferior Derecha' }, // Bottom Right
  { id: 5, difficulty: 'hard', xMin: 0.4, xMax: 0.6, yMin: 0.4, yMax: 0.6, label: 'Centro del Bosque' } // Center
];

export const FUEGORIN_STORY: StoryPart[] = [
  {
    id: 1,
    title: "El Cómic Perdido",
    difficultyReq: 'normal',
    hint: "Busca en la esquina superior derecha del nivel MEDIO.",
    content: "Hace mucho tiempo, Arbolín no era el único guardián. Existía una llama pequeña, Fuegorín, que solo quería calentar a los viajeros perdidos. Pero nadie se acercaba, todos temían quemarse."
  },
  {
    id: 2,
    title: "La Soledad Fría",
    difficultyReq: 'easy',
    hint: "Arbolín debe visitar la esquina superior izquierda en FÁCIL.",
    content: "Fuegorín veía cómo Arbolín recibía abrazos de los animales y agua de las nubes. La envidia comenzó a crecer como una brasa en el viento. '¿Por qué él es amado y yo temido?', pensaba."
  },
  {
    id: 3,
    title: "El Rechazo",
    difficultyReq: 'easy',
    hint: "Explora la esquina inferior izquierda en FÁCIL.",
    content: "Un día, Fuegorín intentó abrazar a un viejo roble para demostrar su cariño. El roble gritó de dolor y se convirtió en cenizas. Los demás árboles lo expulsaron del bosque sagrado."
  },
  {
    id: 4,
    title: "La Ira Ardiente",
    difficultyReq: 'hard',
    hint: "Escóndete en la esquina inferior derecha en DIFÍCIL.",
    content: "Exiliado en el volcán, Fuegorín lloró lágrimas de lava. 'Si no puedo ser amado por mi calor, seré temido por mi furia'. Juró volver y convertir el bosque verde en un reino de ceniza donde él sería el rey."
  },
  {
    id: 5,
    title: "La Venganza Comienza",
    difficultyReq: 'hard',
    hint: "Medita en el centro exacto del mapa DIFÍCIL.",
    content: "Y así comenzó la gran quema. Arbolín despertó rodeado de llamas. Pero Fuegorín no contaba con una cosa: la esperanza brota incluso de la tierra quemada. La guerra había comenzado."
  }
];

export const AVAILABLE_SKINS: Skin[] = [
  {
    id: 'default',
    name: 'Arbolín Original',
    color: '#22c55e', // green-500
    secondaryColor: '#4ade80', // green-400
    description: 'El inicio de todo.',
    unlocked: true,
    unlockHint: 'Desbloqueado por defecto'
  },
  {
    id: 'sakura',
    name: 'Cerezo Místico',
    color: '#ec4899', // pink-500
    secondaryColor: '#fce7f3', // pink-100
    description: 'Recompensa por dificultad Media.',
    unlocked: false,
    unlockHint: 'Completa el modo Medio'
  },
  {
    id: 'autumn',
    name: 'Roble de Otoño',
    color: '#d97706', // amber-600
    secondaryColor: '#fcd34d', // amber-300
    description: 'Recompensa por dificultad Difícil.',
    unlocked: false,
    unlockHint: 'Completa el modo Difícil'
  },
  {
    id: 'magma',
    name: 'Espíritu de Magma',
    color: '#7f1d1d', // red-900
    secondaryColor: '#ef4444', // red-500
    description: 'Nacido del modo Extremo.',
    unlocked: false,
    unlockHint: 'Completa el modo Extremo'
  },
  {
    id: 'glitch',
    name: '0x_ARBOL_ERROR',
    color: '#000000', // black
    secondaryColor: '#22c55e', // green-500 (matrix)
    description: 'Solo para Hackers.',
    unlocked: false,
    unlockHint: 'Completa el modo Hacker'
  },
  {
    id: 'peruano',
    name: 'El Peruano',
    color: '#000000', // Black
    secondaryColor: '#ef4444', // Red (flag detail)
    description: 'Quemado por el sol... y el fuego.',
    unlocked: false,
    unlockHint: 'Logro: Quemarse 50 veces'
  },
  {
    id: 'venezolano',
    name: 'El Venezolano',
    color: '#7f1d1d', // Vinotinto
    secondaryColor: '#fbbf24', // Yellow
    description: 'Sobreviviente de la inflación y el fuego.',
    unlocked: false,
    unlockHint: 'Hacker: 50s sin comer brotes'
  },
  {
    id: 'bolivia',
    name: 'El Navegante',
    color: '#ef4444', // Red (Fire)
    secondaryColor: '#3b82f6', // Blue (Sea/Boat)
    description: 'Un fuego soñando con el mar.',
    unlocked: false,
    unlockHint: 'Logro: Pierde 25 veces en modo Fuegorín'
  },
  {
    id: 'golden',
    name: 'Arbolín Dorado',
    color: '#fbbf24', // amber-400
    secondaryColor: '#ffffff', // white
    description: 'Por recolectar 50 brotes.',
    unlocked: false,
    unlockHint: 'Logro: Coger 50 brotes totales'
  },
  {
    id: 'void',
    name: 'El Vacío',
    color: '#1e1b4b', // indigo-950
    secondaryColor: '#818cf8', // indigo-400
    description: 'Maestro de todas las dificultades.',
    unlocked: false,
    unlockHint: 'Logro: Completar todas las dificultades'
  },
  {
    id: 'ghost',
    name: 'Fantasma',
    color: '#94a3b8', // slate-400
    secondaryColor: '#f1f5f9', // slate-100
    description: 'La perseverancia del perdedor.',
    unlocked: false,
    unlockHint: 'Logro: Perder 25 veces'
  },
  {
    id: 'ancient',
    name: 'Arbolín Ancestral',
    color: '#65a30d', // lime-700
    secondaryColor: '#a78bfa', // violet-400
    description: 'Por una vida de supervivencia en el bosque.',
    unlocked: false,
    unlockHint: 'Logro: Sobrevive 120 segundos totales'
  }
];