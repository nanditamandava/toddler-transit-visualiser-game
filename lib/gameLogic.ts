import { Entity, Bank, GameState } from './types';

/**
 * Validates the safety constraints on both river banks.
 * Constraint: A wife may never be in the presence of another husband on a bank unless her own husband is also present.
 *
 * @param entities Current configuration of all entities.
 * @returns true if the configuration is safe (legal), false if a constraint is violated.
 */
export function validateState(entities: Entity[]): boolean {
  const banks: Bank[] = ['left', 'right'];

  for (const bank of banks) {
    const onBank = entities.filter(e => e.bank === bank);
    const wivesOnBank = onBank.filter(e => e.type === 'wife');
    const husbandsOnBank = onBank.filter(e => e.type === 'husband');

    for (const wife of wivesOnBank) {
      const herHusband = husbandsOnBank.find(h => h.coupleId === wife.coupleId);
      const otherHusbands = husbandsOnBank.filter(h => h.coupleId !== wife.coupleId);

      // VIOLATION: her husband is absent, but other husbands are present
      if (!herHusband && otherHusbands.length > 0) {
        return false;
      }
    }
  }
  return true;
}

/**
 * Inspects the entity distribution and returns a detailed description of the first violation found.
 * Used for toast alerts and debugging.
 *
 * @param entities Current configuration of all entities.
 * @returns string describing the violation, or null if state is valid.
 */
export function getViolationReason(entities: Entity[]): string | null {
  const banks: Bank[] = ['left', 'right'];

  for (const bank of banks) {
    const onBank = entities.filter(e => e.bank === bank);
    const wivesOnBank = onBank.filter(e => e.type === 'wife');
    const husbandsOnBank = onBank.filter(e => e.type === 'husband');

    for (const wife of wivesOnBank) {
      const herHusband = husbandsOnBank.find(h => h.coupleId === wife.coupleId);
      const otherHusbands = husbandsOnBank.filter(h => h.coupleId !== wife.coupleId);

      if (!herHusband && otherHusbands.length > 0) {
        const otherHusbandNames = otherHusbands
          .map(h => `Husband ${h.coupleId}`)
          .join(', ');
        return `Wife ${wife.coupleId} cannot be left on the ${bank} bank with ${otherHusbandNames} — her husband is absent.`;
      }
    }
  }
  return null;
}

/**
 * Checks if the state satisfies the final goal criteria.
 * Goal: All 6 entities and the boat must be on the Right Bank.
 */
export function checkWin(entities: Entity[], boatPosition: Bank): boolean {
  return boatPosition === 'right' && entities.every(e => e.bank === 'right');
}

/**
 * Generates all legally valid crossing transitions from a given bank configuration.
 *
 * @param entities Current configuration of entities.
 * @param boatPosition The current position of the boat ('left' | 'right').
 * @returns Array of objects containing passenger combinations and resulting entity banks.
 */
export function getAvailableCrossings(
  entities: Entity[],
  boatPosition: Bank
): { passengers: string[]; resultEntities: Entity[] }[] {
  const currentBank = boatPosition;
  const targetBank: Bank = currentBank === 'left' ? 'right' : 'left';
  const entitiesOnBank = entities.filter(e => e.bank === currentBank);

  const moves: { passengers: string[]; resultEntities: Entity[] }[] = [];

  // Generate 1-passenger combinations
  for (let i = 0; i < entitiesOnBank.length; i++) {
    const p1 = entitiesOnBank[i];
    const proposedEntities = entities.map(e =>
      e.id === p1.id ? { ...e, bank: targetBank } : e
    );
    if (validateState(proposedEntities)) {
      moves.push({
        passengers: [p1.id],
        resultEntities: proposedEntities,
      });
    }
  }

  // Generate 2-passenger combinations
  for (let i = 0; i < entitiesOnBank.length; i++) {
    for (let j = i + 1; j < entitiesOnBank.length; j++) {
      const p1 = entitiesOnBank[i];
      const p2 = entitiesOnBank[j];
      const proposedEntities = entities.map(e =>
        e.id === p1.id || e.id === p2.id ? { ...e, bank: targetBank } : e
      );
      if (validateState(proposedEntities)) {
        moves.push({
          passengers: [p1.id, p2.id],
          resultEntities: proposedEntities,
        });
      }
    }
  }

  return moves;
}

/**
 * BFS Auto-Solver: Finds the shortest sequence of states from the current configuration to the goal state.
 *
 * @param initialEntities The initial state's entities.
 * @param initialBoat The initial boat position.
 * @returns Array of GameStates representing the step-by-step resolution path, or null if unsolvable.
 */
export function solveBFS(initialEntities: Entity[], initialBoat: Bank): GameState[] | null {
  interface BFSNode {
    entities: Entity[];
    boatPosition: Bank;
    path: GameState[];
  }

  const visited = new Set<string>();
  const queue: BFSNode[] = [];

  const serialize = (entities: Entity[], boat: Bank): string => {
    const sorted = [...entities].sort((a, b) => a.id.localeCompare(b.id));
    return `${boat}|${sorted.map(e => `${e.id}:${e.bank}`).join(',')}`;
  };

  const initialPathState: GameState = {
    entities: initialEntities,
    boatPosition: initialBoat,
    boatPassengers: [],
    moveCount: 0,
    history: [],
    status: checkWin(initialEntities, initialBoat) ? 'solved' : 'playing',
  };

  queue.push({
    entities: initialEntities,
    boatPosition: initialBoat,
    path: [initialPathState],
  });

  visited.add(serialize(initialEntities, initialBoat));

  while (queue.length > 0) {
    const curr = queue.shift()!;

    if (checkWin(curr.entities, curr.boatPosition)) {
      return curr.path;
    }

    const nextCrossings = getAvailableCrossings(curr.entities, curr.boatPosition);
    for (const crossing of nextCrossings) {
      const nextBoatPosition: Bank = curr.boatPosition === 'left' ? 'right' : 'left';
      const stateKey = serialize(crossing.resultEntities, nextBoatPosition);

      if (!visited.has(stateKey)) {
        visited.add(stateKey);

        const nextState: GameState = {
          entities: crossing.resultEntities,
          boatPosition: nextBoatPosition,
          boatPassengers: [],
          moveCount: curr.path.length,
          history: [], // History omitted inside optimal search results to save memory
          status: checkWin(crossing.resultEntities, nextBoatPosition) ? 'solved' : 'playing',
        };

        queue.push({
          entities: crossing.resultEntities,
          boatPosition: nextBoatPosition,
          path: [...curr.path, nextState],
        });
      }
    }
  }

  return null; // No path found
}
