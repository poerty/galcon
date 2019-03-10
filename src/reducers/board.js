import * as ActionTypes from '../actions/board';

import towerInfos from '../datas/tower';
import mapInfos from '../datas/map';
import { Map, fromJS } from 'immutable';

import math from 'mathjs';
import Bezier from 'bezier-js';

import { getControllPoints } from '../functions/canvas';
import { isTowerOwner } from '../functions/checker';

import uuidv4 from 'uuidv4';

const towers = mapInfos.map1.towers;
const initialState = fromJS({
  towers,
  attacks: { byId: {}, ids: [] },
  marines: { byId: {}, ids: [] },
  selected: {
    percentage: 1.0,
  },
});

// call timer per 5 second(10000 ms)
const callRatio = process.env.REACT_APP_CALL_RATIO;

const selectAttackFromTower = (state, action) => {
  const fromTowerId = action.towerId;
  const fromTower = state.getIn(['towers', 'byId', fromTowerId]);
  if (!isTowerOwner(fromTower, action.userId)) {
    return state.deleteIn(['selected', 'from']);
  }

  return state.setIn(['selected', 'from'], fromTowerId);
};

const selectAttackToTower = (state, action) => {
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

  const attackAmount = math.floor(math.multiply(fromTower.get('amount'), attackPercentage));
  const attackId = uuidv4();
  const attack = Map({
    ownerId: action.userId,
    amount: attackAmount,
    from: Map({
      towerId: fromTowerId,
      top: fromTower.getIn(['style', 'top']),
      left: fromTower.getIn(['style', 'left']),
    }),
    to: Map({
      towerId: toTowerId,
      top: toTower.getIn(['style', 'top']),
      left: toTower.getIn(['style', 'left']),
    }),
    at: (new Date()).getTime() / 1000,
  });

  return state
    .set('selected', Map({ percentage: 1.0 }))
    .updateIn(['attacks', 'ids'], ids => ids.push(attackId))
    .setIn(['attacks', 'byId', attackId], attack);
};

const upgradeTower = (state, action) => {
  const towerId = action.towerId;
  const tower = state.getIn(['towers', 'byId', towerId]);
  if (!isTowerOwner(tower, action.userId)) {
    return state;
  }
  const level = tower.get('level');
  const amount = tower.get('amount');
  const towerInfo = towerInfos[level];
  // max level exceed
  if (level >= 5 || !towerInfo.upgradeCost) {
    return state;
  }
  // amount is lower then cost
  if (towerInfo.upgradeCost && towerInfo.upgradeCost > amount) {
    return state;
  }
  return state
    .updateIn(['towers', 'byId', towerId, 'level'], level => math.add(level, 1))
    .updateIn(['towers', 'byId', towerId, 'amount'], amount => math.subtract(amount, towerInfo.upgradeCost))
    .updateIn(['towers', 'byId', towerId, 'realAmount'], realAmount =>
      math.subtract(
        realAmount,
        math.multiply(callRatio, towerInfo.upgradeCost)
      )
    );
};



const addTowerAmount = (state) => {
  const towerIds = state.getIn(['towers', 'ids']);

  return state.withMutations(map => {
    towerIds.forEach(towerId => {
      // set amount as realAmount divide by callRatio
      // cause optimize component render time
      map
        .updateIn(['towers', 'byId', towerId, 'realAmount'],
          realAmount => {
            const level = state.getIn(['towers', 'byId', towerId, 'level']);
            const towerInfo = towerInfos[level];
            const newRealAmount = math.max(
              realAmount,
              math.min(
                math.multiply(callRatio, towerInfo.max),
                math.add(realAmount, towerInfo.rate)
              )
            );
            return newRealAmount;
          }
        )
        .setIn(['towers', 'byId', towerId, 'amount'],
          math.floor(
            math.divide(
              state.getIn(['towers', 'byId', towerId, 'realAmount']),
              callRatio)
          )
        );
    });
  });
};


const moveMarin = (state) => {
  const now = (new Date()).getTime() / 1000;
  const marineIds = state.getIn(['marines', 'ids']);

  // no mutation cause of lock
  let newState = state;
  marineIds.forEach(marineId => {
    const marine = newState.getIn(['marines', 'byId', marineId]);

    const at = marine.get('at');
    const duration = marine.get('duration');
    const percentage = (now - at) / duration;
    if (percentage >= 1) {
      const attackOwnerId = marine.get('ownerId');
      const toTowerId = marine.get('toTowerId');
      const realAmount = newState.getIn(['towers', 'byId', toTowerId, 'realAmount']);
      let newRealAmount;
      let newOwnerId = newState.getIn(['towers', 'byId', toTowerId, 'ownerId']);
      if (newOwnerId === attackOwnerId) {
        newRealAmount = math.add(realAmount, callRatio);
      }
      else if (realAmount < callRatio) {
        // change owner of tower
        newRealAmount = math.subtract(callRatio, realAmount);
        newOwnerId = attackOwnerId;
      } else {
        newRealAmount = math.subtract(realAmount, callRatio);
      }

      newState = newState
        .setIn(['towers', 'byId', toTowerId, 'ownerId'], newOwnerId)
        .setIn(['towers', 'byId', toTowerId, 'realAmount'], newRealAmount)
        .setIn(['towers', 'byId', toTowerId, 'amount'],
          math.floor(math.divide(newState.getIn(['towers', 'byId', toTowerId, 'realAmount']), callRatio)))
        .updateIn(['marines', 'ids'], ids => ids.filter(id => id !== marineId))
        .deleteIn(['marines', 'byId', marineId]);
    } else {
      const curve = marine.get('curve');
      const point = curve.get(percentage);
      newState = newState
        .setIn(['marines', 'byId', marineId, 'x'], point.x)
        .setIn(['marines', 'byId', marineId, 'y'], point.y);
    }
  });
  return newState;
};

const createMarine = (state) => {
  const now = (new Date()).getTime() / 1000;
  const attackIds = state.getIn(['attacks', 'ids']);

  return state.withMutations(map => {
    attackIds.forEach(attackId => {
      const attack = state.getIn(['attacks', 'byId', attackId]);
      const fromTowerId = attack.getIn(['from', 'towerId']);
      const toTowerId = attack.getIn(['to', 'towerId']);
      let marineAmount = process.env.REACT_APP_MAX_ATTACK_SIZE;

      const attackAmount = attack.get('amount');
      marineAmount = math.min(marineAmount, attackAmount);

      const towerAmount = state.getIn(['towers', 'byId', fromTowerId, 'amount']);
      marineAmount = math.min(marineAmount, towerAmount);

      // if attack is finished, delete it
      if (marineAmount !== process.env.REACT_APP_MAX_ATTACK_SIZE) {
        map
          .updateIn(['attacks', 'ids'], ids => ids.filter(id => id !== attackId))
          .deleteIn(['attacks', 'byId', attackId]);
      }

      // subtract from attackAmount
      map.updateIn(['attacks', 'byId', attackId, 'amount'], amount => amount - marineAmount);

      // subtract from towerAmount
      map
        .updateIn(['towers', 'byId', fromTowerId, 'realAmount'],
          realAmount => math.max(0, math.subtract(realAmount, callRatio * marineAmount))
        )
        .setIn(['towers', 'byId', fromTowerId, 'amount'],
          math.floor(math.divide(state.getIn(['towers', 'byId', fromTowerId, 'realAmount']), callRatio))
        );

      const startPoint = { x: attack.getIn(['from', 'left']), y: attack.getIn(['from', 'top']) };
      const endPoint = { x: attack.getIn(['to', 'left']), y: attack.getIn(['to', 'top']) };
      const controllPoints = getControllPoints(
        marineAmount,
        startPoint,
        endPoint,
        10
      );
      const distance = Math.sqrt(Math.pow(endPoint.x - startPoint.x, 2) + Math.pow(endPoint.y - startPoint.y, 2));
      const duration = distance / 30;
      for (let i = 0; i < marineAmount; i++) {
        const curve = new Bezier(startPoint, controllPoints[i], endPoint);
        // const LUT = curve.getLUT(1000);
        const point = curve.get(0);
        const marineId = uuidv4();
        map
          .updateIn(['marines', 'ids'], ids => ids.push(marineId))
          .setIn(['marines', 'byId', marineId], Map({
            ownerId: attack.get('ownerId'),
            fromTowerId,
            toTowerId,
            startPoint: Map(startPoint),
            endPoint: Map(endPoint),
            controllPoint: Map(controllPoints[i]),
            curve,
            x: point.x,
            y: point.y,
            color: 'red',
            at: now,
            duration,
          }));
      }
    });
  });
};


const boardReducer = (state = initialState, action) => {
  switch (action.type) {
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