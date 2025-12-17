export enum GameState {
  MENU = 'MENU',
  LEVEL_SELECT = 'LEVEL_SELECT',
  PLAYING = 'PLAYING',
  SKINS = 'SKINS',
  SETTINGS = 'SETTINGS',
  ACHIEVEMENTS = 'ACHIEVEMENTS',
  EXTRAS = 'EXTRAS',
  LEADERBOARD = 'LEADERBOARD',
  STORY = 'STORY',
  GAME_OVER = 'GAME_OVER',
  VICTORY = 'VICTORY'
}

export type Difficulty = 'easy' | 'normal' | 'hard' | 'extreme' | 'hacker';

export interface Entity {
  id: string;
  x: number;
  y: number;
  width: number;
  height: number;
  vx: number;
  vy: number;
  color: string;
  type: 'player' | 'enemy' | 'projectile' | 'sprout' | 'decoration' | 'mutant';
  health?: number;
  variant?: string; // New: For detailed decorations (e.g., 'rock', 'flower', 'crack')
  rotation?: number; // New: For visual variety
}

export interface Skin {
  id: string;
  name: string;
  color: string;
  secondaryColor: string;
  description: string;
  unlocked: boolean;
  unlockHint: string;
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  skinRewardId: string;
  isUnlocked: boolean;
  currentProgress: number;
  target: number;
}

export interface GameSettings {
  soundEnabled: boolean;
  difficulty: Difficulty;
  playerName: string; // New: For leaderboard
}

export interface ActiveExtras {
  mutant: boolean;
  infinite: boolean;
  fuegorin: boolean;
}

export interface LeaderboardEntry {
  name: string;
  score: number;
  date: string;
}

export interface PlayerProgress {
  totalSprouts: number;
  totalLosses: number;
  completedDifficulties: Difficulty[];
  unlockedSkins: string[];
  maxHackerSurvival: number; 
  maxTotalSurvivalTime: number; 
  unlockedStoryParts: number[]; // IDs of unlocked story parts (1-5)
  fuegorinLosses?: number; // Tracks losses specifically in Fuegorin mode
}

export interface GameResult {
  won: boolean;
  score: number;
  hackerSurvivalTime: number;
  totalSurvivalTime: number; 
  unlockedSecret?: number; // Should return secret ID if found
}

export interface StoryPart {
  id: number;
  title: string;
  content: string;
  hint: string; // Hint to find it
  difficultyReq: Difficulty;
}