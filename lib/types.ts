export type Bank = 'left' | 'right';

export interface Entity {
  id: string; // e.g., 'H_A', 'W_A'
  type: 'husband' | 'wife';
  coupleId: 'A' | 'B' | 'C';
  bank: Bank;
}

export interface GameState {
  entities: Entity[];
  boatPosition: Bank;
  boatPassengers: string[]; // max 2 entity IDs
  moveCount: number;
  history: GameState[]; // full backtrackable history
  status: 'playing' | 'solved' | 'illegal';
}

export type Action =
  | { type: 'BOARD_ENTITY'; entityId: string }
  | { type: 'DISEMBARK_ENTITY'; entityId: string }
  | { type: 'CROSS_RIVER' }
  | { type: 'BACKTRACK'; toIndex: number }
  | { type: 'RESET' }
  | { type: 'LOAD_STATE_SEQUENCE'; path: GameState[] };
