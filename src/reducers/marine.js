import * as ActionTypes from '../actions/attack';

import uuidv4 from 'uuidv4';
import { Map, List } from 'immutable';

const initialState = Map({
  ids: List([]),
  byId: Map({}),
});


const startMarine = (state, action) => {
  const { amount, from, to } = action;
  const marineId = uuidv4();

  const newState = state
    .setIn(['byId', marineId])
    .setIn(['ids', marineId], Map({ amount, from, to }));
  return newState;
};

const marineReducer = (state = initialState, action) => {
  switch (action.type) {
    case ActionTypes.START_MARINE:
      return startMarine(state, action);

    default:
      return state;
  }
};

export default marineReducer;
