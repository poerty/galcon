import { fromJS } from 'immutable';
import uuidv4 from 'uuidv4';

const towerIds = [];
const towerById = {};
const userIds = [];
const userById = {};
const colors = ['red', 'blue', 'green', 'yellow'];

for (let i = 1; i < 4; i++) {
  const towerId = uuidv4();
  const userId = uuidv4();
  const amount = 4;

  userIds.push(userId);
  userById[userId] = {
    color: colors[i - 1],
  };
  towerIds.push(towerId);
  towerById[towerId] = {
    ownerId: userId,
    level: 1,
    amount,
    realAmount: amount * process.env.REACT_APP_CALL_RATIO,
    style: {
      top: Math.floor(440 * Math.random()) + 30,
      left: Math.floor(440 * Math.random()) + 30,
    },
  };
}

const grayId = uuidv4();
const playerId = uuidv4();
const module = {
  map1: {
    width: 300,
    height: 300,
    towers: fromJS({
      ids: [
        'fcdbb3e1-98d4-478a-b074-85b2e04fbf3a',
        'b62560f6-cf53-487f-8e5a-a38071166364',
        '2cd6a02e-f41b-42c1-966f-bbcf691ff491',
        '6d6cd718-0bdc-4616-be73-f73cae1c1097',
        '95c780fc-de50-4272-810b-f4d5dc5ac1f0',
        '386a9abc-966b-4286-9540-b67ad0db69ab',
        'f8f02d5b-dc90-49d4-b26d-f824bf406bc4',
      ],
      byId: {
        'fcdbb3e1-98d4-478a-b074-85b2e04fbf3a': {
          ownerId: grayId,
          level: 1,
          amount: 5,
          realAmount: 5 * process.env.REACT_APP_CALL_RATIO,
          style: { top: 100, left: 100 },
        },
        'b62560f6-cf53-487f-8e5a-a38071166364': {
          ownerId: grayId,
          level: 1,
          amount: 5,
          realAmount: 5 * process.env.REACT_APP_CALL_RATIO,
          style: { top: 200, left: 400 },
        },
        '2cd6a02e-f41b-42c1-966f-bbcf691ff491': {
          ownerId: grayId,
          level: 1,
          amount: 5,
          realAmount: 5 * process.env.REACT_APP_CALL_RATIO,
          style: { top: 150, left: 180 },
        },
        '6d6cd718-0bdc-4616-be73-f73cae1c1097': {
          ownerId: grayId,
          level: 1,
          amount: 5,
          realAmount: 5 * process.env.REACT_APP_CALL_RATIO,
          style: { top: 400, left: 250 },
        },
        '95c780fc-de50-4272-810b-f4d5dc5ac1f0': {
          ownerId: grayId,
          level: 1,
          amount: 5,
          realAmount: 5 * process.env.REACT_APP_CALL_RATIO,
          style: { top: 300, left: 300 },
        },
        '386a9abc-966b-4286-9540-b67ad0db69ab': {
          ownerId: grayId,
          level: 1,
          amount: 5,
          realAmount: 5 * process.env.REACT_APP_CALL_RATIO,
          style: { top: 120, left: 200 },
        },
        'f8f02d5b-dc90-49d4-b26d-f824bf406bc4': {
          ownerId: playerId,
          level: 5,
          amount: 100,
          realAmount: 100 * process.env.REACT_APP_CALL_RATIO,
          style: { top: 400, left: 400 },
        },
      },
    }),
    users: fromJS({
      ids: [playerId, grayId],
      byId: {
        [grayId]: { color: 'gray' },
        [playerId]: { color: 'lightgreen' },
      },
    }),
  },
};
export default module;