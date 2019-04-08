import { Map } from 'immutable';

import Tower from 'models/tower';
import Attack from 'models/attack';
import Marine from 'models/marine';

import mapInfos from 'datas/map';

import { isTowerOwner } from 'functions/checker';
import { createAction, handleActions, Action } from 'redux-actions';

const REAL_AMOUNT_RATIO = parseInt(getEnv('REACT_APP_REALAMOUNT_RATIO'), 10);
const MAX_ATTACK_SIZE = parseInt(getEnv('REACT_APP_MAX_ATTACK_SIZE'), 10);

import BoardState from 'modules/board.state';

// *Actions & Actions payload type
// init board(adding tower)
export const INIT_BOARD = 'INIT_BOARD';
type INIT_BOARD_PAYLOAD = { now: number };
// select from tower for attack
export const SELECT_ATTACK_FROM_TOWER = 'SELECT_ATTACK_FROM_TOWER';
type SELECT_ATTACK_FROM_TOWER_PAYLOAD = { towerId: string };
// select to tower for attack & generate new attack
export const SELECT_ATTACK_TO_TOWER = 'SELECT_ATTACK_TO_TOWER';
type SELECT_ATTACK_TO_TOWER_PAYLOAD = { towerId: string };
// upgrade tower level
export const UPGRADE_TOWER = 'UPGRADE_TOWER';
type UPGRADE_TOWER_PAYLOAD = { towerId: string };
// add tower's amount by level rate
export const ADD_TOWER_AMOUNT = 'ADD_TOWER_AMOUNT';
type ADD_TOWER_AMOUNT_PAYLOAD = void;
// move marines
export const MOVE_MARINE = 'MOVE_MARINE';
type MOVE_MARINE_PAYLOAD = void;
// generate marine of attacks & restract from tower amount
export const CREATE_MARINE = 'CREATE_MARINE';
type CREATE_MARINE_PAYLOAD = void;


// add field by middleware
type MIDDLEWARE_PAYLOAD = { now: number; userId: string }
interface IAction<T> extends Action<T> {
  type: string;
  payload: T & MIDDLEWARE_PAYLOAD;
  error?: boolean;
  meta?: any;
}

// *Reducer
export default handleActions<BoardState, any>({
  [INIT_BOARD]: (state, action: IAction<INIT_BOARD_PAYLOAD>) => {
    const towers = mapInfos.map1.towers;

    return state.withMutations((map: BoardState) => {
      towers.forEach((tower) => {
        const local: any = tower;
        local.createdAt = action.payload.now;
        local.updatedAt = action.payload.now;
        map.update('towers',
          (ele) => ele.add(local));
      });
    });
  },
  [SELECT_ATTACK_FROM_TOWER]: (state, action: IAction<SELECT_ATTACK_FROM_TOWER_PAYLOAD>) => {
    const fromTowerId = action.payload.towerId;
    const fromTower = state.getIn(['towers', 'byId', fromTowerId]);
    if (!isTowerOwner(fromTower, action.payload.userId)) {
      return state.deleteIn(['selected', 'from']);
    }

    return state.setIn(['selected', 'from'], fromTowerId);
  },
  [SELECT_ATTACK_TO_TOWER]: (state, action: IAction<SELECT_ATTACK_TO_TOWER_PAYLOAD>) => {
    const toTowerId = action.payload.towerId;
    const fromTowerId = state.getIn(['selected', 'from']);
    if (!toTowerId || !fromTowerId) {
      return state;
    }

    const toTower = state.getIn(['towers', 'byId', toTowerId]);
    const fromTower = state.getIn(['towers', 'byId', fromTowerId]);
    const attackPercentage = state.getIn(['selected', 'percentage']);
    if (!toTower || !fromTower || !attackPercentage) {
      return state;
    }
    if (toTowerId === fromTowerId) {
      return state;
    }

    const attack = {
      ownerId: action.payload.userId,
      amount: Math.floor(fromTower.get('amount') * attackPercentage),
      from: {
        towerId: fromTowerId,
        top: fromTower.getIn(['style', 'top']),
        left: fromTower.getIn(['style', 'left']),
      },
      to: {
        towerId: toTowerId,
        top: toTower.getIn(['style', 'top']),
        left: toTower.getIn(['style', 'left']),
      },
      createdAt: action.payload.now,
      updatedAt: action.payload.now,
      marineCreatedAt: action.payload.now,
    };
    return state
      .set('selected', Map({ percentage: 1.0 }))
      .update('attacks',
        (attacks) => attacks.add(attack));
  },
  [UPGRADE_TOWER]: (state, action: IAction<UPGRADE_TOWER_PAYLOAD>) => {
    const towerId = action.payload.towerId;
    const tower = state.getIn(['towers', 'byId', towerId]);
    if (!isTowerOwner(tower, action.payload.userId)) {
      return state;
    }

    return state.updateIn(['towers', 'byId', towerId],
      (ele: Tower) => ele.upgrade());
  },
  [ADD_TOWER_AMOUNT]: (state, action: IAction<ADD_TOWER_AMOUNT_PAYLOAD>) => {
    const towerIds = state.getIn(['towers', 'ids']);

    return state.withMutations((map: BoardState) => {
      towerIds.forEach((towerId: string) => {
        map.updateIn(['towers', 'byId', towerId],
          (ele: Tower) => ele.updateAmount(action.payload.now));
      });
    });
  },
  [MOVE_MARINE]: (state, action: IAction<MOVE_MARINE_PAYLOAD>) => {
    const now = action.payload.now;
    const marineIds = state.getIn(['marines', 'ids']);

    // no mutation cause of lock
    let newState = state;
    marineIds.forEach((marineId: string) => {
      newState = newState.updateIn(['marines', 'byId', marineId],
        (ele: Marine) => ele.move(now));

      const marine = newState.getIn(['marines', 'byId', marineId]);
      const deletedAt = marine.get('deletedAt');

      // marine arrive to tower
      if (now >= deletedAt) {
        const attackOwnerId = marine.get('ownerId');
        const toTowerId = marine.get('toTowerId');
        const realAmount = newState.getIn(['towers', 'byId', toTowerId, 'realAmount']);
        let newRealAmount: number;
        let newOwnerId = newState.getIn(['towers', 'byId', toTowerId, 'ownerId']);
        if (newOwnerId === attackOwnerId) {
          newRealAmount = realAmount + REAL_AMOUNT_RATIO;
        } else if (realAmount < REAL_AMOUNT_RATIO) {
          // change owner of tower
          newRealAmount = REAL_AMOUNT_RATIO - realAmount;
          newOwnerId = attackOwnerId;
        } else {
          newRealAmount = realAmount - REAL_AMOUNT_RATIO;
        }

        newState = newState
          .setIn(['towers', 'byId', toTowerId, 'ownerId'], newOwnerId)
          .updateIn(['towers', 'byId', toTowerId],
            (tower: Tower) => tower.setRealAmount(newRealAmount, action.payload.now))
          .update('marines',
            (marines) => marines.remove(marineId));
      }
    });
    return newState;
  },
  [CREATE_MARINE]: (state, action: IAction<CREATE_MARINE_PAYLOAD>) => {
    const attackIds = state.getIn(['attacks', 'ids']);

    return state.withMutations((map: BoardState) => {
      attackIds.forEach((attackId: string) => {
        const attack = state.getIn(['attacks', 'byId', attackId]);
        const fromTowerId = attack.getIn(['from', 'towerId']);
        const attackAmount = attack.get('amount');
        const towerAmount = state.getIn(['towers', 'byId', fromTowerId, 'amount']);
        const marineAmount = Math.min(MAX_ATTACK_SIZE, attackAmount, towerAmount);

        // get marine list from attack
        const marines = attack.getNewMarines(marineAmount, action.payload.now);

        if (marines && marines.length !== 0) {
          let marineCreatedAt = 0;
          // add marines
          marines.forEach((marine: any) => {
            marineCreatedAt = Math.max(marineCreatedAt, marine.createdAt);
            map.update('marines',
              (ele) => ele.add(marine));
          });
          // subtract from attackAmount & set last marine created time
          map.updateIn(['attacks', 'byId', attackId],
            (ele: Attack) => ele
              .subAmount(marines.length, action.payload.now)
              .set('marineCreatedAt', marineCreatedAt));
          // subtract from towerAmount
          map.updateIn(['towers', 'byId', fromTowerId],
            (tower: Tower) => tower.subAmount(marines.length, action.payload.now));
          // if attack is finished, delete it
          if (map.getIn(['attacks', 'byId', attackId, 'amount']) === 0) {
            map.update('attacks',
              (attacks) => attacks.remove(attackId));
          }
        }
      });
    });
  },
}, new BoardState());

// *Action Creators
export const actionCreators = {
  initBoard: createAction<INIT_BOARD_PAYLOAD>(INIT_BOARD),
  selectAttackFromTower: createAction<SELECT_ATTACK_FROM_TOWER_PAYLOAD>(SELECT_ATTACK_FROM_TOWER),
  selectAttackToTower: createAction<SELECT_ATTACK_TO_TOWER_PAYLOAD>(SELECT_ATTACK_TO_TOWER),
  upgradeTower: createAction<UPGRADE_TOWER_PAYLOAD>(UPGRADE_TOWER),
  addTowerAmount: createAction<ADD_TOWER_AMOUNT_PAYLOAD>(ADD_TOWER_AMOUNT),
  moveMarine: createAction<MOVE_MARINE_PAYLOAD>(MOVE_MARINE),
  createMarine: createAction<CREATE_MARINE_PAYLOAD>(CREATE_MARINE),
};
