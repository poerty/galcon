
import mapInfos from 'datas/map';
import { handleActions } from 'redux-actions';

import UserState from 'modules/user.state';

// *Actions
// *Actions payload type

// *Reducer
export default handleActions({

}, (new UserState()).set('id',mapInfos.map1.users.getIn(['ids',0])));

// *Action Creators
