import { Map, fromJS, List } from 'immutable';

import * as ActionTypes from 'actions/board';

import Tower from 'models/tower'
import Attack from 'models/attack'
import Marine from 'models/marine'
import ObjectList from 'models/objectList'

import mapInfos from 'datas/map';

import { isTowerOwner } from 'functions/checker';

const REAL_AMOUNT_RATIO: number = parseInt(getEnv('REACT_APP_REALAMOUNT_RATIO'))
const MAX_ATTACK_SIZE = parseInt(getEnv('REACT_APP_MAX_ATTACK_SIZE'));

const initialState = fromJS({
  towers: new ObjectList([], Tower),
  attacks: new ObjectList([], Attack),
  marines: new ObjectList([], Marine),
  selected: {
    percentage: 1.0,
  },
});

const initBoard = (state: any, action: any) => {
  const towers = mapInfos.map1.towers;

  return state.withMutations((map: any) => {
    towers.forEach(tower => {
      const local: any = tower;
      local.createdAt = action.now
      local.updatedAt = action.now;
      map.update('towers',
        (towers: ObjectList) => towers.add(local))
    })
  })
}

const selectAttackFromTower = (state: any, action: any) => {
  const fromTowerId = action.towerId;
  const fromTower = state.getIn(['towers', 'byId', fromTowerId]);
  if (!isTowerOwner(fromTower, action.userId)) {
    return state.deleteIn(['selected', 'from']);
  }

  return state.setIn(['selected', 'from'], fromTowerId);
};

const selectAttackToTower = (state: any, action: any) => {
  const toTowerId = action.towerId;
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
    ownerId: action.userId,
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
    createdAt: action.now,
    updatedAt: action.now,
    marineCreatedAt: action.now,
  };
  return state
    .set('selected', Map({ percentage: 1.0 }))
    .update('attacks',
      (attacks: ObjectList) => attacks.add(attack))
};

const upgradeTower = (state: any, action: any) => {
  const towerId = action.towerId;
  const tower = state.getIn(['towers', 'byId', towerId]);
  if (!isTowerOwner(tower, action.userId)) {
    return state;
  }

  return state.updateIn(['towers', 'byId', towerId],
    (tower: Tower) => tower.upgrade())
};


const addTowerAmount = (state: any, action: any) => {
  const towerIds = state.getIn(['towers', 'ids']);

  return state.withMutations((map: any) => {
    towerIds.forEach((towerId: string) => {
      map.updateIn(['towers', 'byId', towerId],
        (tower: Tower) => tower.updateAmount(action.now))
    });
  });
};


const moveMarin = (state: any, action: any) => {
  const now = action.now;
  const marineIds = state.getIn(['marines', 'ids']);

  // no mutation cause of lock
  let newState = state;
  marineIds.forEach((marineId: string) => {
    newState = newState.updateIn(['marines', 'byId', marineId],
      (marine: Marine) => marine.move(now))

    const marine = newState.getIn(['marines', 'byId', marineId]);
    const deletedAt = marine.get('deletedAt')

    //marine arrive to tower
    if (now >= deletedAt) {
      const attackOwnerId = marine.get('ownerId');
      const toTowerId = marine.get('toTowerId');
      const realAmount = newState.getIn(['towers', 'byId', toTowerId, 'realAmount']);
      let newRealAmount: number;
      let newOwnerId = newState.getIn(['towers', 'byId', toTowerId, 'ownerId']);
      if (newOwnerId === attackOwnerId) {
        newRealAmount = realAmount + REAL_AMOUNT_RATIO;
      }
      else if (realAmount < REAL_AMOUNT_RATIO) {
        // change owner of tower
        newRealAmount = REAL_AMOUNT_RATIO - realAmount;
        newOwnerId = attackOwnerId;
      } else {
        newRealAmount = realAmount - REAL_AMOUNT_RATIO;
      }

      newState = newState
        .setIn(['towers', 'byId', toTowerId, 'ownerId'], newOwnerId)
        .updateIn(['towers', 'byId', toTowerId],
          (tower: Tower) => tower.setRealAmount(newRealAmount, action.now))
        .update('marines',
          (marines: ObjectList) => marines.remove(marineId))
    }
  });
  return newState;
};

const createMarine = (state: any, action: any) => {
  const attackIds = state.getIn(['attacks', 'ids']);

  return state.withMutations((map: any) => {
    attackIds.forEach((attackId: string) => {
      const attack = state.getIn(['attacks', 'byId', attackId]);
      const fromTowerId = attack.getIn(['from', 'towerId']);
      const attackAmount = attack.get('amount');
      const towerAmount = state.getIn(['towers', 'byId', fromTowerId, 'amount']);
      const marineAmount = Math.min(MAX_ATTACK_SIZE, attackAmount, towerAmount);

      //get marine list from attack
      const marines = attack.getNewMarines(marineAmount, action.now)

      if (marines && marines.length !== 0) {
        let marineCreatedAt = 0;
        //add marines
        marines.forEach((marine: any) => {
          marineCreatedAt = Math.max(marineCreatedAt, marine.createdAt)
          map.update('marines',
            (marines: ObjectList) => marines.add(marine))
        })
        // subtract from attackAmount & set last marine created time
        map.updateIn(['attacks', 'byId', attackId],
          (attack: Attack) => attack
            .subAmount(marines.length, action.now)
            .set('marineCreatedAt', marineCreatedAt))
        // subtract from towerAmount
        map.updateIn(['towers', 'byId', fromTowerId],
          (tower: Tower) => tower.subAmount(marines.length, action.now));
        // if attack is finished, delete it
        if (map.getIn(['attacks', 'byId', attackId, 'amount']) === 0) {
          map.update('attacks',
            (attacks: ObjectList) => attacks.remove(attackId))
        }
      }
    });
  });
};


const boardReducer = (state = initialState, action: any) => {
  switch (action.type) {
    case ActionTypes.INIT_BOARD:
      return initBoard(state, action)
    case ActionTypes.SELECT_ATTACK_FROM_TOWER:
      return selectAttackFromTower(state, action);
    case ActionTypes.SELECT_ATTACK_TO_TOWER:
      return selectAttackToTower(state, action);

    case ActionTypes.UPGRADE_TOWER:
      return upgradeTower(state, action);


    case ActionTypes.ADD_TOWER_AMOUNT:
      return addTowerAmount(state, action);

    case ActionTypes.MOVE_MARINE:
      return moveMarin(state, action);
    case ActionTypes.CREATE_MARINE:
      return createMarine(state, action);

    default:
      return state;
  }
};

export default boardReducer;
