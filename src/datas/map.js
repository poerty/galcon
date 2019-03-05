import { fromJS } from 'immutable';
import uuidv4 from 'uuidv4';

const ids = [];
const byId = {};
for (let i = 1; i < 4; i++) {
  const id = uuidv4();
  const amount = 4;

  ids.push(id);
  byId[id] = {
    level: 1,
    amount,
    realAmount: amount * process.env.REACT_APP_CALL_RATIO,
    style: {
      top: Math.floor(440 * Math.random()) + 30,
      left: Math.floor(440 * Math.random()) + 30,
    },
  };
}
const module = {
  map1: {
    width: 300,
    height: 300,
    towers: fromJS({
      ids,
      byId,
    }),
  },
};
export default module;