import { combineReducers } from 'redux';

import userReducer from './user';
import timerReducer from './timer';
import boardReducer from './board';

const galconApp = combineReducers({
  users: userReducer,
  timer: timerReducer,
  board: boardReducer,
});

export default galconApp;
