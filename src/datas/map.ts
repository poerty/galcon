import { fromJS } from 'immutable';
import uuidv4 from 'uuidv4';

const REAL_AMOUNT_RATIO: number = parseInt(getEnv('REACT_APP_REALAMOUNT_RATIO'), 10);

/*
  type UserType = {
    color: string
  }

  type TowerType = {
    ownerId: string,
    level: number,
    amount: number,
    realAmount: number,
    style: {
      top: number,
      left: number,
    },
  }

  const towerIds: string[] = [];
  const towerById: { [name: string]: TowerType } = {};
  const userIds: string[] = [];
  const userById: { [name: string]: UserType } = {};
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
      realAmount: amount * REAL_AMOUNT_RATIO,
      style: {
        top: Math.floor(440 * Math.random()) + 30,
        left: Math.floor(440 * Math.random()) + 30,
      },
    };
  }
*/

const grayId = uuidv4();
const playerId = uuidv4();
const module = {
  map1: {
    width: 300,
    height: 300,
    towers: [
      {
        ownerId: grayId,
        level: 1,
        amount: 5,
        realAmount: 5 * REAL_AMOUNT_RATIO,
        style: { top: 100, left: 100 },
      },
      {
        ownerId: grayId,
        level: 1,
        amount: 5,
        realAmount: 5 * REAL_AMOUNT_RATIO,
        style: { top: 200, left: 400 },
      },
      {
        ownerId: grayId,
        level: 1,
        amount: 5,
        realAmount: 5 * REAL_AMOUNT_RATIO,
        style: { top: 150, left: 180 },
      },
      {
        ownerId: grayId,
        level: 1,
        amount: 5,
        realAmount: 5 * REAL_AMOUNT_RATIO,
        style: { top: 400, left: 250 },
      },
      {
        ownerId: grayId,
        level: 1,
        amount: 5,
        realAmount: 5 * REAL_AMOUNT_RATIO,
        style: { top: 300, left: 300 },
      },
      {
        ownerId: grayId,
        level: 1,
        amount: 5,
        realAmount: 5 * REAL_AMOUNT_RATIO,
        style: { top: 120, left: 200 },
      },
      {
        ownerId: playerId,
        level: 5,
        amount: 100,
        realAmount: 100 * REAL_AMOUNT_RATIO,
        style: { top: 400, left: 400 },
      },
    ],
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
