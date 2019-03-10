import { startAttack } from './attack';

export const SELECT_FROM_TOWER = 'SELECT_FROM_TOWER';
export function selectFromTower(towerId, playerId) {
  return {
    type: SELECT_FROM_TOWER,
    towerId,
    playerId,
  };
}

export const SELECT_TO_TOWER = 'SELECT_TO_TOWER';
export function selectToTower(towerId, playerId) {
  return {
    type: SELECT_TO_TOWER,
    towerId,
    playerId,
  };
}

export const SELECT_TO_TOWER_AND_ATTACK = 'SELECT_TO_TOWER_AND_ATTACK';
export function selectToTowerAndAttack(towerId, playerId) {
  return (dispatch, getState) => {
    dispatch(selectToTower(towerId, playerId));
    const selected = getState().towers.get('selected');
    dispatch(startAttack(selected));
  };
}

export const MARINE_ARRIVE_TOWER = 'MARINE_ARRIVE_TOWER';
export function marineArriveTower(attackId) {
  return {
    type: MARINE_ARRIVE_TOWER,
    attackId,
  };
}

export const UPGRADE_TOWER = 'UPGRADE_TOWER';
export function upgradeTower(towerId, playerId) {
  return {
    type: UPGRADE_TOWER,
    towerId,
    playerId,
  };
}

export const ADD_AMOUNT = 'ADD_AMOUNT';
export function addAmount() {
  return {
    type: ADD_AMOUNT,
  };
}