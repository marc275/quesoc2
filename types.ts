export enum Language {
  CATALAN = 'ca',
  SPANISH = 'es'
}

export interface GameState {
  currentObject: string | null;
  clue: string | null;
  history: Array<{ role: 'user' | 'assistant', content: string }>;
  isGameOver: boolean;
  score: number;
  round: number;
}

export type View = 'home' | 'game' | 'result';