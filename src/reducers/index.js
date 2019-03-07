import { combineReducers } from 'redux';

import towerReducer from './tower';
import userReducer from './user';
import timerReducer from './timer';

const galconApp = combineReducers({
  towers: towerReducer,
  users: userReducer,
  timer: timerReducer,
});

export default galconApp;
