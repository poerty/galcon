import * as ActionTypes from '../actions/tower';

import towerInfos from '../datas/tower';
import mapInfos from '../datas/map';
import { Map, List } from 'immutable';
import uuidv4 from 'uuidv4';

const initialState = mapInfos.map1.towers
  .set('selected', Map({
    percentage: 1.0,
  }))
  .set('attacks', Map({
    ids: List([]),
    byId: Map({}),
  }));

// call timer per 5 second(10000 ms)
const callRatio = process.env.REACT_APP_CALL_RATIO;

const selectFromTower = (state, action) => {
  const towerId = action.towerId;

  return state.setIn(['selected', 'from'], towerId);
};

const selectToTower = (state, action) => {
  const toTowerId = action.towerId;
  const toTowerStyle = state.getIn(['byId', toTowerId, 'style']);
  const fromTowerId = state.getIn(['selected', 'from']);
  const fromTowerStyle = state.getIn(['byId', fromTowerId, 'style']);
  const attackPercentage = state.getIn(['selected', 'percentage']);
  if (!toTowerStyle || !fromTowerStyle || !attackPercentage) {
    return state;
  }

  const attackAmount = Math.floor(state.getIn(['byId', fromTowerId, 'amount']) * attackPercentage);
  const attackId = uuidv4();
  const attack = Map({
    amount: attackAmount,
    from: Map({
      towerId: fromTowerId,
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
  console.log('attack: ', attack.toJS());

  return state
    .setIn(['selected'], Map({ percentage: 1.0 }))
    .updateIn(['attacks', 'ids'], ids => ids.push(attackId))
    .setIn(['attacks', 'byId', attackId], attack);
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
    .updateIn(['byId', towerId, 'level'], level => level + 1)
    .updateIn(['byId', towerId, 'amount'], amount => amount - towerInfo.upgradeCost)
    .updateIn(['byId', towerId, 'realAmount'], realAmount => realAmount - callRatio * towerInfo.upgradeCost);
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
            const newRealAmount = Math.min(
              callRatio * towerInfo.max,
              realAmount + towerInfo.rate
            );
            return newRealAmount;
          }
        )
        .setIn(['byId', towerId, 'amount'],
          Math.floor(state.getIn(['byId', towerId, 'realAmount']) / callRatio));
    });
  });
};

const towerReducer = (state = initialState, action) => {
  switch (action.type) {
    case ActionTypes.SELECT_FROM_TOWER:
      return selectFromTower(state, action);
    case ActionTypes.SELECT_TO_TOWER:
      return selectToTower(state, action);
    case ActionTypes.UPGRADE_TOWER:
      return upgradeTower(state, action);

    case ActionTypes.ADD_AMOUNT:
      return addAmount(state, action);

    default:
      return state;
  }
};

export default towerReducer;
