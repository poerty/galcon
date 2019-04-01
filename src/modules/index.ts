import { combineReducers } from 'redux';

import userReducer from 'modules/user';
import timerReducer from 'modules/timer';
import boardReducer from 'modules/board';

const galconApp = combineReducers({
  users: userReducer,
  timer: timerReducer,
  board: boardReducer,
});

export default galconApp;
