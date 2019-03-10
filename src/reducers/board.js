import * as ActionTypes from '../actions/board';

import towerInfos from '../datas/tower';
import mapInfos from '../datas/map';
import { Map, fromJS } from 'immutable';
import math from 'mathjs';

import { getControllPoints } from '../functions/canvas';
import Bezier from 'bezier-js';

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

  return state.setIn(['selected', 'from'], fromTowerId);
};

const selectAttackToTower = (state, action) => {
  const toTowerId = action.towerId;
  const toTower = state.getIn(['towers', 'byId', toTowerId]);
  const fromTowerId = state.getIn(['selected', 'from']);
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
    .set('selected', Map({
      percentage: 1.0,
    }))
    .updateIn(['attacks', 'ids'], ids => ids.push(attackId))
    .setIn(['attacks', 'byId', attackId], attack);
};

const upgradeTower = (state, action) => {
  const towerId = action.towerId;
  const level = state.getIn(['towers', 'byId', towerId, 'level']);
  const amount = state.getIn(['towers', 'byId', towerId, 'amount']);
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

  const newState = state.withMutations(map => {
    marineIds.forEach(marineId => {
      const marine = map.getIn(['marines', 'byId', marineId]);

      const at = marine.get('at');
      const duration = marine.get('duration');
      const percentage = (now - at) / duration;
      if (percentage >= 1) {
        // marine arrived to tower
        map
          .updateIn(['marines', 'ids'], ids => ids.filter(id => id !== marineId))
          .deleteIn(['marines', 'byId', marineId]);
      } else {
        const curve = marine.get('curve');
        const point = curve.get(percentage);
        map
          .setIn(['marines', 'byId', marineId, 'x'], point.x)
          .setIn(['marines', 'byId', marineId, 'y'], point.y);
      }
    });
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
      let marineAmount = process.env.REACT_APP_MAX_ATTACK_SIZE;

      // subtract from attackAmount
      const attackAmount = attack.get('amount');
      marineAmount = math.min(marineAmount, attackAmount);
      if (marineAmount === process.env.REACT_APP_MAX_ATTACK_SIZE) {
        map.updateIn(['attacks', 'byId', attackId, 'amount'], amount => amount - marineAmount);
      }
      else {
        // if attack is finished, delete it
        map
          .updateIn(['attacks', 'ids'], ids => ids.filter(id => id !== attackId))
          .deleteIn(['attacks', 'byId', attackId]);
      }

      // subtract from towerAmount
      const towerAmount = state.getIn(['towers', 'byId', fromTowerId, 'amount']);
      marineAmount = math.min(marineAmount, towerAmount);
      map
        .updateIn(['towers', 'byId', fromTowerId, 'realAmount'],
          realAmount => math.max(0, math.subtract(realAmount, callRatio * marineAmount))
        )
        .setIn(['towers', 'byId', fromTowerId, 'amount'],
          math.floor(
            math.divide(
              state.getIn(['towers', 'byId', fromTowerId, 'realAmount']),
              callRatio)
          )
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
