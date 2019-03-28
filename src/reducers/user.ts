
import mapInfos from 'datas/map';

const initialState = mapInfos.map1.users
  .set('id', mapInfos.map1.users.getIn(['ids', 0]));


const userReducer = (state = initialState, action: any) => {
  switch (action.type) {
    default:
      return state;
  }
};

export default userReducer;
