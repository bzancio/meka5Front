export type CharState = 'pending' | 'correct' | 'incorrect';

export interface WordChar {
  char: string;
  typed: string;
  state: CharState;
}

export interface TestResult {
  wpm: number;
  accuracy: number;
  hardestWords: { word: string; errors: number }[];
  hardestLetters: { letter: string; count: number }[];
}
