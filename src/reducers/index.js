import { combineReducers } from 'redux';

import towerReducer from './tower';
import timerReducer from './timer';

const galconApp = combineReducers({
  towers: towerReducer,
  timer: timerReducer,
});

export default galconApp;
