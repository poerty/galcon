import { combineReducers } from 'redux';

import userReducer from 'reducers/user';
import timerReducer from 'reducers/timer';
import boardReducer from 'reducers/board';

const galconApp = combineReducers({
  users: userReducer,
  timer: timerReducer,
  board: boardReducer,
});

export default galconApp;
