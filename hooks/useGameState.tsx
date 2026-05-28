'use client';

import React, { createContext, useContext, useReducer, useState, useCallback, useRef } from 'react';
import { GameState, Entity, Bank } from '../lib/types';
import { INITIAL_STATE } from '../lib/constants';
import { gameReducer } from '../lib/stateEngine';
import { getViolationReason, solveBFS, getAvailableCrossings } from '../lib/gameLogic';
import { useToast, ToastItem } from './useToast';

interface GameContextType {
  state: GameState;
  toasts: ToastItem[];
  isPlayingBack: boolean;
  branchingFactor: number;
  availableCrossings: { passengers: string[]; resultEntities: Entity[] }[];
  addToast: (message: string, type?: 'error' | 'success' | 'warning') => void;
  removeToast: (id: string) => void;
  boardEntity: (entityId: string) => void;
  disembarkEntity: (entityId: string) => void;
  crossRiver: () => void;
  backtrack: (toIndex: number) => void;
  resetGame: () => void;
  triggerAutoSolve: () => void;
}

const GameContext = createContext<GameContextType | undefined>(undefined);

export function GameStateProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(gameReducer, INITIAL_STATE);
  const { toasts, addToast, removeToast } = useToast();
  const [isPlayingBack, setIsPlayingBack] = useState(false);
  const playbackTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Compute dynamic analytical features
  const availableCrossings = getAvailableCrossings(state.entities, state.boatPosition);
  const branchingFactor = availableCrossings.length;

  const boardEntity = useCallback((entityId: string) => {
    if (isPlayingBack) return;
    dispatch({ type: 'BOARD_ENTITY', entityId });
  }, [isPlayingBack]);

  const disembarkEntity = useCallback((entityId: string) => {
    if (isPlayingBack) return;
    dispatch({ type: 'DISEMBARK_ENTITY', entityId });
  }, [isPlayingBack]);

  const crossRiver = useCallback(() => {
    if (isPlayingBack) return;

    // Validate boat is occupied
    if (state.boatPassengers.length === 0) {
      addToast('The boat cannot cross without any passengers!', 'warning');
      return;
    }

    const nextBank: Bank = state.boatPosition === 'left' ? 'right' : 'left';
    
    // Test the proposed transition logic for constraint violations
    const proposedEntities = state.entities.map(e =>
      state.boatPassengers.includes(e.id) ? { ...e, bank: nextBank } : e
    );

    const violation = getViolationReason(proposedEntities);
    if (violation) {
      addToast(violation, 'error');
      return;
    }

    // Execute state commit
    dispatch({ type: 'CROSS_RIVER' });
    addToast('River crossed safely!', 'success');
  }, [state, isPlayingBack, addToast]);

  const backtrack = useCallback((toIndex: number) => {
    if (isPlayingBack) return;
    dispatch({ type: 'BACKTRACK', toIndex });
  }, [isPlayingBack]);

  const resetGame = useCallback(() => {
    if (playbackTimerRef.current) {
      clearTimeout(playbackTimerRef.current);
    }
    setIsPlayingBack(false);
    dispatch({ type: 'RESET' });
    addToast('Simulation reset to initial state.', 'success');
  }, [addToast]);

  const triggerAutoSolve = useCallback(() => {
    if (isPlayingBack) return;

    // BFS solve from the current bank configuration
    const solutionPath = solveBFS(state.entities, state.boatPosition);

    if (!solutionPath || solutionPath.length <= 1) {
      addToast('No optimal path exists from this configuration! Try resetting or back-tracking.', 'warning');
      return;
    }

    setIsPlayingBack(true);
    addToast('Optimal solution found! Running visual playback...', 'success');

    // Create high-fidelity animation frames
    interface Frame {
      entities: Entity[];
      boatPosition: Bank;
      boatPassengers: string[];
      moveCount: number;
      delay: number;
      status: 'playing' | 'solved';
    }

    const frames: Frame[] = [];
    let currentEntities = state.entities.map(e => ({ ...e }));
    let currentBoatPosition = state.boatPosition;
    let accumMoveCount = state.moveCount;

    for (let i = 1; i < solutionPath.length; i++) {
      const nextStep = solutionPath[i];
      const nextBoatPosition = nextStep.boatPosition;

      // Identify passengers crossing in this step
      const passengers = nextStep.entities
        .filter(e => e.bank === nextBoatPosition && currentEntities.find(ce => ce.id === e.id)?.bank === currentBoatPosition)
        .map(e => e.id);

      accumMoveCount++;

      // Frame A: Board passengers
      frames.push({
        entities: currentEntities.map(e => ({ ...e })),
        boatPosition: currentBoatPosition,
        boatPassengers: passengers,
        moveCount: accumMoveCount - 1,
        status: 'playing',
        delay: 500, // wait for boarding animation
      });

      // Frame B: Cross the river
      frames.push({
        entities: currentEntities.map(e => ({ ...e })),
        boatPosition: nextBoatPosition,
        boatPassengers: passengers,
        moveCount: accumMoveCount - 1,
        status: 'playing',
        delay: 900, // wait for boat slide animation (transition-all duration-500)
      });

      // Frame C: Disembark
      frames.push({
        entities: nextStep.entities.map(e => ({ ...e })),
        boatPosition: nextBoatPosition,
        boatPassengers: [],
        moveCount: accumMoveCount,
        status: i === solutionPath.length - 1 ? 'solved' : 'playing',
        delay: 400, // brief pause before next move boarding
      });

      // Update current reference structures
      currentEntities = nextStep.entities.map(e => ({ ...e }));
      currentBoatPosition = nextBoatPosition;
    }

    let frameIndex = 0;

    const playNextFrame = () => {
      if (frameIndex >= frames.length) {
        setIsPlayingBack(false);
        addToast('Optimal crossing path complete!', 'success');
        return;
      }

      const frame = frames[frameIndex];

      // Dispatch load state to inject frame
      dispatch({
        type: 'LOAD_STATE_SEQUENCE',
        path: [{
          entities: frame.entities,
          boatPosition: frame.boatPosition,
          boatPassengers: frame.boatPassengers,
          moveCount: frame.moveCount,
          history: [],
          status: frame.status
        }]
      });

      frameIndex++;
      playbackTimerRef.current = setTimeout(playNextFrame, frame.delay);
    };

    playNextFrame();
  }, [state, isPlayingBack, addToast]);

  return (
    <GameContext.Provider
      value={{
        state,
        toasts,
        isPlayingBack,
        branchingFactor,
        availableCrossings,
        addToast,
        removeToast,
        boardEntity,
        disembarkEntity,
        crossRiver,
        backtrack,
        resetGame,
        triggerAutoSolve,
      }}
    >
      {children}
    </GameContext.Provider>
  );
}

export function useGameState() {
  const context = useContext(GameContext);
  if (!context) {
    throw new Error('useGameState must be used within a GameStateProvider');
  }
  return context;
}
