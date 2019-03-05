export const SELECT_FROM_TOWER = 'SELECT_FROM_TOWER';
export function selectFromTower(towerId) {
  return {
    type: SELECT_FROM_TOWER,
    towerId,
  };
}

export const SELECT_TO_TOWER = 'SELECT_TO_TOWER';
export function selectToTower(towerId) {
  return {
    type: SELECT_TO_TOWER,
    towerId,
  };
}

export const MARINE_ARRIVE_TOWER = 'MARINE_ARRIVE_TOWER';
export function marineArriveTower(attackId) {
  return {
    type: MARINE_ARRIVE_TOWER,
    attackId,
  };
}

export const ATTACK_END = 'ATTACK_END';
export function attackEnd(attackId) {
  return {
    type: ATTACK_END,
    attackId,
  };
}

export const UPGRADE_TOWER = 'UPGRADE_TOWER';
export function upgradeTower(towerId) {
  return {
    type: UPGRADE_TOWER,
    towerId,
  };
}

export const ADD_AMOUNT = 'ADD_AMOUNT';
export function addAmount() {
  return {
    type: ADD_AMOUNT,
  };
}