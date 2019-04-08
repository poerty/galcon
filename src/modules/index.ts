import { combineReducers } from 'redux';

import userReducer from 'modules/user';
import timerReducer from 'modules/timer';
import boardReducer from 'modules/board';
import UserState from 'modules/user.state';
import TimerState from 'modules/timer.state';
import BoardState from 'modules/board.state';

const galconApp = combineReducers({
  users: userReducer,
  timer: timerReducer,
  board: boardReducer,
});

export default galconApp;

export type GalconAppState = {
  users: UserState;
  timer: TimerState;
  board: BoardState;
}