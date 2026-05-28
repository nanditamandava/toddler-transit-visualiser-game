import { Entity, GameState } from './types';

export const INITIAL_ENTITIES: Entity[] = [
  { id: 'H_A', type: 'husband', coupleId: 'A', bank: 'left' },
  { id: 'W_A', type: 'wife', coupleId: 'A', bank: 'left' },
  { id: 'H_B', type: 'husband', coupleId: 'B', bank: 'left' },
  { id: 'W_B', type: 'wife', coupleId: 'B', bank: 'left' },
  { id: 'H_C', type: 'husband', coupleId: 'C', bank: 'left' },
  { id: 'W_C', type: 'wife', coupleId: 'C', bank: 'left' },
];

export const INITIAL_STATE: GameState = {
  entities: INITIAL_ENTITIES,
  boatPosition: 'left',
  boatPassengers: [],
  moveCount: 0,
  history: [],
  status: 'playing',
};

export const COUPLE_COLORS = {
  A: {
    bg: 'from-slate-800 to-indigo-950 hover:from-slate-700 hover:to-indigo-900',
    border: 'border-indigo-500/30 group-hover:border-indigo-400',
    text: 'text-indigo-400',
    glow: 'shadow-indigo-500/10',
    name: 'Couple A (Slate Blue)'
  },
  B: {
    bg: 'from-slate-800 to-rose-950 hover:from-slate-700 hover:to-rose-900',
    border: 'border-rose-500/30 group-hover:border-rose-400',
    text: 'text-rose-400',
    glow: 'shadow-rose-500/10',
    name: 'Couple B (Rose/Coral)'
  },
  C: {
    bg: 'from-slate-800 to-emerald-950 hover:from-slate-700 hover:to-emerald-900',
    border: 'border-emerald-500/30 group-hover:border-emerald-400',
    text: 'text-emerald-400',
    glow: 'shadow-emerald-500/10',
    name: 'Couple C (Teal/Emerald)'
  }
} as const;
