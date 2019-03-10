import { combineReducers } from 'redux';

import towerReducer from './tower';
import userReducer from './user';
import timerReducer from './timer';
import attackReducer from './attack';

const galconApp = combineReducers({
  towers: towerReducer,
  users: userReducer,
  timer: timerReducer,
  attacks: attackReducer,
});

export default galconApp;
