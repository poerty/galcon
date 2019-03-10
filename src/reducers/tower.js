import * as ActionTypes from '../actions/tower';

import towerInfos from '../datas/tower';
import mapInfos from '../datas/map';
import { Map } from 'immutable';
import math from 'mathjs';

const initialState = mapInfos.map1.towers
  .set('selected', Map({
    percentage: 1.0,
  }));


// call timer per 5 second(10000 ms)
const callRatio = process.env.REACT_APP_CALL_RATIO;

const selectFromTower = (state, action) => {
  const towerId = action.towerId;
  const playerId = action.playerId;
  if (state.getIn(['byId', towerId, 'ownerId']) !== playerId) {
    return state;
  }

  return state.setIn(['selected', 'from'], towerId);
};

const selectToTower = (state, action) => {
  const playerId = action.playerId;
  const toTowerId = action.towerId;
  const toTowerStyle = state.getIn(['byId', toTowerId, 'style']);
  const fromTowerId = state.getIn(['selected', 'from']);
  const fromTowerStyle = state.getIn(['byId', fromTowerId, 'style']);
  const attackPercentage = state.getIn(['selected', 'percentage']);
  if (!toTowerStyle || !fromTowerStyle || !attackPercentage) {
    return state;
  }
  if (toTowerId === fromTowerId) {
    return state;
  }

  const attackAmount = Math.floor(state.getIn(['byId', fromTowerId, 'amount']) * attackPercentage);
  const attack = Map({
    amount: attackAmount,
    from: Map({
      towerId: fromTowerId,
      playerId,
      top: fromTowerStyle.get('top'),
      left: fromTowerStyle.get('left'),
    }),
    to: Map({
      towerId: toTowerId,
      top: toTowerStyle.get('top'),
      left: toTowerStyle.get('left'),
    }),
    at: (new Date()).getTime() / 1000,
  });

  return state
    .setIn(['selected'], attack);
  // .updateIn(['byId', fromTowerId, 'realAmount'],
  //   realAmount => {
  //     const newRealAmount = Math.max(
  //       0,
  //       math.subtract(realAmount, math.multiply(callRatio, attackAmount))
  //     );
  //     return newRealAmount;
  //   }
  // )
  // .setIn(['byId', fromTowerId, 'amount'],
  //   math.floor(math.divide(state.getIn(['byId', fromTowerId, 'realAmount']), callRatio)));
};

const marineArriveTower = (state, action) => {
  const attackId = action.attackId;
  const playerId = state.getIn(['attacks', 'byId', attackId, 'from', 'playerId']);
  const towerId = state.getIn(['attacks', 'byId', attackId, 'to', 'towerId']);

  const realAmount = state.getIn(['byId', towerId, 'realAmount']);
  let newRealAmount;
  let newOwnerId = state.getIn(['byId', towerId, 'ownerId']);
  if (newOwnerId === playerId) {
    newRealAmount = math.add(realAmount, callRatio);
  }
  else if (realAmount < callRatio) {
    // change owner of tower
    newRealAmount = math.subtract(callRatio, realAmount);
    newOwnerId = playerId;
  } else {
    newRealAmount = math.subtract(realAmount, callRatio);
  }

  return state
    .setIn(['byId', towerId, 'ownerId'], newOwnerId)
    .setIn(['byId', towerId, 'realAmount'], newRealAmount)
    .setIn(['byId', towerId, 'amount'],
      math.floor(math.divide(state.getIn(['byId', towerId, 'realAmount']), callRatio)));
};


const upgradeTower = (state, action) => {
  const towerId = action.towerId;
  const level = state.getIn(['byId', towerId, 'level']);
  const amount = state.getIn(['byId', towerId, 'amount']);
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
    .updateIn(['byId', towerId, 'level'], level => math.add(level, 1))
    .updateIn(['byId', towerId, 'amount'], amount => math.subtract(amount, towerInfo.upgradeCost))
    .updateIn(['byId', towerId, 'realAmount'], realAmount => math.subtract(realAmount, math.multiply(callRatio, towerInfo.upgradeCost)));
};

const addAmount = (state) => {
  const towerIds = state.get('ids');

  return state.withMutations(map => {
    towerIds.forEach(towerId => {
      // set amount as realAmount divide by 10
      // cause optimize component render time
      map
        .updateIn(['byId', towerId, 'realAmount'],
          realAmount => {
            const level = state.getIn(['byId', towerId, 'level']);
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
        .setIn(['byId', towerId, 'amount'],
          math.floor(math.divide(state.getIn(['byId', towerId, 'realAmount']), callRatio)));
    });
  });
};

const subAmount = (state, action) => {
  const subAmount = action.subAmount;
  const towerId = action.towerId;

  const realAmount = state.getIn(['byId', towerId, 'realAmount']);
  const newRealAmount = math.max(0, math.subtract(realAmount, math.multiply(callRatio, subAmount)));
  const amount = state.getIn(['byId', towerId, 'amount']);
  const newAmount = math.floor(math.divide(newRealAmount, callRatio));

  return state
    .setIn(['byId', towerId, 'realAmount'], newRealAmount)
    .setIn(['byId', towerId, 'amount'], newAmount)
    .setIn(['selected', 'subAmount'], math.subtract(newAmount - amount));
};

const towerReducer = (state = initialState, action) => {
  switch (action.type) {
    case ActionTypes.SELECT_FROM_TOWER:
      return selectFromTower(state, action);
    case ActionTypes.SELECT_TO_TOWER:
      return selectToTower(state, action);
    case ActionTypes.MARINE_ARRIVE_TOWER:
      return marineArriveTower(state, action);
    case ActionTypes.UPGRADE_TOWER:
      return upgradeTower(state, action);

    case ActionTypes.ADD_AMOUNT:
      return addAmount(state, action);
    case ActionTypes.SUB_AMOUNT:
      return subAmount(state, action);

    default:
      return state;
  }
};

export default towerReducer;
