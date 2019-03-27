import * as ActionTypes from '../actions/timer';

import { Map } from 'immutable';
const initialState = Map({
  startedAt: null,
});

const initTimer = (state: any, action: any) => {
  return state.set('startedAt', action.timer);
};

const timerReducer = (state = initialState, action: any) => {
  switch (action.type) {
    case ActionTypes.INIT_TIMER:
      return initTimer(state, action);

    default:
      return state;
  }
};

export default timerReducer;
