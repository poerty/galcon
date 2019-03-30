export const INIT_BOARD = 'INIT_BOARD';
export function initBoard(now: string) {
  return {
    type: INIT_BOARD,
    now
  }
}

/**
 * for tower component event
 */

// select from tower for attack
export const SELECT_ATTACK_FROM_TOWER = 'SELECT_ATTACK_FROM_TOWER';
export function selectAttackFromTower(towerId: string) {
  return {
    type: SELECT_ATTACK_FROM_TOWER,
    towerId,
  };
}

// select to tower for attack & generate new attack
export const SELECT_ATTACK_TO_TOWER = 'SELECT_ATTACK_TO_TOWER';
export function selectAttackToTower(towerId: string) {
  return {
    type: SELECT_ATTACK_TO_TOWER,
    towerId,
  };
}

// upgrade tower level
export const UPGRADE_TOWER = 'UPGRADE_TOWER';
export function upgradeTower(towerId: string) {
  return {
    type: UPGRADE_TOWER,
    towerId,
  };
}


/**
 * for timer component event
 */

// add tower's amount by level rate
export const ADD_TOWER_AMOUNT = 'ADD_TOWER_AMOUNT';
export function addTowerAmount() {
  return {
    type: ADD_TOWER_AMOUNT,
  };
}

// move marines
export const MOVE_MARINE = 'MOVE_MARINE';
export function moveMarine() {
  return {
    type: MOVE_MARINE,
  };
}

// generate marine of attacks & restract from tower amount
export const CREATE_MARINE = 'CREATE_MARINE';
export function createMarine() {
  return {
    type: CREATE_MARINE,
  };
}