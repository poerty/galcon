import { createAction, handleActions, Action } from 'redux-actions';

// *Actions
const INIT_TIMER = 'galcon/INIT_TIMER';
// *Actions payload type
type INIT_TIMER_PAYLOAD = {now: number};

import TimerState from 'modules/timer.state';

// *Reducer
export default handleActions<TimerState, any>({
  [INIT_TIMER]: (state, action: Action<INIT_TIMER_PAYLOAD>) => {
    return state.set('startedAt', action.payload.now);
  },
}, new TimerState());

// *Action Creators
export const actionCreators = {
  initTimer: createAction<INIT_TIMER_PAYLOAD>(INIT_TIMER),
};
