import { Map } from 'immutable';
import { createAction, handleActions, Action } from 'redux-actions';

// Actions
const INIT_TIMER = 'galcon/INIT_TIMER';
// Actions payload type
type INIT_TIMER_PAYLOAD = number;

// Reducer initialState
const initialState = Map({
  startedAt: 0,
});
// Reducer
export default handleActions<any, any>({
  [INIT_TIMER]: (state, action: Action<INIT_TIMER_PAYLOAD>) => {
    return state.set('startedAt', action.payload);
  },
}, initialState);

// Action Creators
export const actionCreators = {
  initTimer: createAction<INIT_TIMER_PAYLOAD>(INIT_TIMER),
};
