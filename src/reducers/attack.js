import * as ActionTypes from '../actions/attack';

import { Map, List, fromJS } from 'immutable';
import uuidv4 from 'uuidv4';

const initialState = Map({
  ids: List([]),
  byId: Map({}),
});

const startAttack = (state, action) => {
  console.log('startAttack: ');
  console.log('state: ', state.toJS());

  const attackId = uuidv4();
  const { from, to, amount, at } = action;
  const attack = fromJS({ from, to, amount, at });

  const newState = state
    .update('ids', ids => ids.push(attackId))
    .setIn(['byId', attackId], attack);
  console.log('newState: ', newState.toJS());
  return newState;
};

const endAttack = (state, action) => {
  const attackId = action.attackId;

  const newState = state
    .deleteIn(['byId', attackId])
    .update('ids', ids => ids.filter(id => id !== attackId));
  return newState;
};

const attackReducer = (state = initialState, action) => {
  switch (action.type) {
    case ActionTypes.START_ATTACK:
      return startAttack(state, action);
    case ActionTypes.END_ATTACK:
      return endAttack(state, action);

    default:
      return state;
  }
};

export default attackReducer;
