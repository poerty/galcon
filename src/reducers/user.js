// import * as ActionTypes from '../actions/tower';

import mapInfos from '../datas/map';
// import { Map } from 'immutable';

const initialState = mapInfos.map1.users
  .set('id', mapInfos.map1.users.getIn(['ids', 0]));


const userReducer = (state = initialState, action) => {
  switch (action.type) {
    default:
      return state;
  }
};

export default userReducer;
