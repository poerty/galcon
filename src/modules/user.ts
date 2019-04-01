
import mapInfos from 'datas/map';
import { handleActions } from 'redux-actions';

// Actions
// Actions payload type

// Reducer initialState
const initialState = mapInfos.map1.users
  .set('id', mapInfos.map1.users.getIn(['ids', 0]));
// Reducer
export default handleActions({

}, initialState);

// Action Creators
