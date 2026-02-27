export enum GameState {
  MENU = 'MENU',
  LEVEL_SELECT = 'LEVEL_SELECT',
  PLAYING = 'PLAYING',
  SKINS = 'SKINS',
  SETTINGS = 'SETTINGS',
  ACHIEVEMENTS = 'ACHIEVEMENTS',
  EXTRAS = 'EXTRAS',
  STORY = 'STORY',
  LEADERBOARD = 'LEADERBOARD',
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
  type: 'player' | 'enemy' | 'projectile' | 'sprout' | 'decoration' | 'mutant' | 'banana_item';
  health?: number;
  variant?: string;
  rotation?: number;
}

export interface Skin {
  id: string;
  name: string;
  color: string;
  secondaryColor: string;
  description: string;
  unlocked: boolean;
  unlockHint: string;
  type: 'arbolin' | 'fuegorin' | 'banana';
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

export interface ControlSettings {
  type: 'joystick' | 'buttons';
  scale: number;
  opacity: number;
  side: 'left' | 'right' | 'center';
  yOffset: number;
  xOffset: number;
}

export interface GameSettings {
  soundEnabled: boolean;
  difficulty: Difficulty;
  playerName: string;
  controls: ControlSettings;
  secretCodeInput?: string;
}

export interface ActiveExtras {
  mutant: boolean;
  infinite: boolean;
  fuegorin: boolean;
  bananaMode: boolean;
}

export interface PlayerProgress {
  totalSprouts: number;
  totalLosses: number;
  totalAshes: number; // New currency for Fuegorin
  totalBaskets: number; // New currency for Banana
  completedDifficulties: Difficulty[];
  unlockedSkins: string[];
  maxHackerSurvival: number; 
  maxTotalSurvivalTime: number; 
  unlockedStoryParts: number[]; 
  fuegorinLosses?: number;
  bananaLosses?: number;
  hasSacredPeel?: boolean;
  hasCaramelBanana?: boolean;
  unlockedBananaMode?: boolean;
  redeemedCodes?: string[];
}

export type PowerUpType = 'shield' | 'speed' | 'rapid_fire' | 'triple_shot' | 'nuke';

export interface PowerUp {
  id: PowerUpType;
  name: string;
  description: string;
  cost: number;
  icon: string;
}

export interface ActivePowerUp {
  type: PowerUpType;
  duration: number; // in seconds
  active: boolean;
}

export interface GameResult {
  won: boolean;
  score: number;
  hackerSurvivalTime: number;
  totalSurvivalTime: number; 
  unlockedSecret?: number;
  foundPeel?: boolean;
  foundCaramel?: boolean;
}

export interface StoryPart {
  id: number;
  title: string;
  content: string;
  hint: string;
  difficultyReq: Difficulty;
}

export interface LeaderboardEntry {
  name: string;
  score: number;
  date: string;
}