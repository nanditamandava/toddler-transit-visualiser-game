import { GameState, Action, Bank } from './types';
import { INITIAL_STATE } from './constants';
import { validateState, checkWin } from './gameLogic';

/**
 * Deterministic reducer for game state transitions.
 * Ensures strict immutability, full backtrack history, and state validity invariants.
 */
export function gameReducer(state: GameState, action: Action): GameState {
  switch (action.type) {
    case 'BOARD_ENTITY': {
      const { entityId } = action;
      const entity = state.entities.find(e => e.id === entityId);

      // Invariants:
      // 1. Entity must exist.
      // 2. Entity must be on the same bank as the boat.
      // 3. Boat passengers must be less than 2.
      // 4. Entity must not already be on the boat.
      if (
        !entity ||
        entity.bank !== state.boatPosition ||
        state.boatPassengers.length >= 2 ||
        state.boatPassengers.includes(entityId)
      ) {
        return state;
      }

      // Deep copy history and current state before boarding (for backtrack support)
      const nextHistory = [...state.history, {
        ...state,
        entities: state.entities.map(e => ({ ...e })),
        boatPassengers: [...state.boatPassengers]
      }];

      return {
        ...state,
        boatPassengers: [...state.boatPassengers, entityId],
        history: nextHistory,
      };
    }

    case 'DISEMBARK_ENTITY': {
      const { entityId } = action;

      // Invariants:
      // 1. Entity must currently be on the boat.
      if (!state.boatPassengers.includes(entityId)) {
        return state;
      }

      // Deep copy history and current state before disembarking
      const nextHistory = [...state.history, {
        ...state,
        entities: state.entities.map(e => ({ ...e })),
        boatPassengers: [...state.boatPassengers]
      }];

      return {
        ...state,
        boatPassengers: state.boatPassengers.filter(id => id !== entityId),
        history: nextHistory,
      };
    }

    case 'CROSS_RIVER': {
      // Invariants:
      // 1. Boat must contain at least 1 passenger.
      if (state.boatPassengers.length === 0) {
        return state;
      }

      const nextBank: Bank = state.boatPosition === 'left' ? 'right' : 'left';

      // Update entity bank properties for all current boat passengers
      const nextEntities = state.entities.map(e =>
        state.boatPassengers.includes(e.id) ? { ...e, bank: nextBank } : e
      );

      // Validate constraint safety before committing state change
      if (!validateState(nextEntities)) {
        return state; // Reject transition and return current state
      }

      // Deep copy of pre-crossing state pushed to history
      const nextHistory = [...state.history, {
        ...state,
        entities: state.entities.map(e => ({ ...e })),
        boatPassengers: [...state.boatPassengers]
      }];

      const isWon = checkWin(nextEntities, nextBank);

      return {
        ...state,
        entities: nextEntities,
        boatPosition: nextBank,
        // Passengers disembark automatically upon successful crossing
        boatPassengers: [],
        moveCount: state.moveCount + 1,
        history: nextHistory,
        status: isWon ? 'solved' : 'playing',
      };
    }

    case 'BACKTRACK': {
      const { toIndex } = action;

      // Invariants:
      // 1. Index must be within history bounds.
      if (toIndex < 0 || toIndex >= state.history.length) {
        if (toIndex === -1) {
          // Reset to initial state
          return {
            ...INITIAL_STATE,
            entities: INITIAL_STATE.entities.map(e => ({ ...e })),
            boatPassengers: []
          };
        }
        return state;
      }

      // Backtrack by retrieving the state at toIndex
      const targetState = state.history[toIndex];

      // Slice the history array up to the backtrack point (history is immutable)
      const nextHistory = state.history.slice(0, toIndex);

      return {
        ...targetState,
        history: nextHistory,
      };
    }

    case 'RESET': {
      return {
        ...INITIAL_STATE,
        entities: INITIAL_STATE.entities.map(e => ({ ...e })),
        boatPassengers: [],
        history: [],
      };
    }

    case 'LOAD_STATE_SEQUENCE': {
      // Load a generated path sequence for BFS auto-solver playback
      const { path } = action;
      if (path.length === 0) return state;

      const latestState = path[path.length - 1];

      // Build history chain leading to this path state
      const newHistory = [...state.history];
      for (let i = 0; i < path.length - 1; i++) {
        newHistory.push(path[i]);
      }

      return {
        ...latestState,
        history: newHistory,
      };
    }

    default:
      return state;
  }
}
