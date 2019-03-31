import { Record } from 'immutable';

import towerInfos from 'datas/tower';
const REAL_AMOUNT_RATIO: number = parseInt(getEnv('REACT_APP_REALAMOUNT_RATIO'), 10);

interface TowerProp {
  id: string;
  ownerId: string;
  level: number;
  amount: number;
  realAmount: number;
  style: {
    top: number,
    left: number,
  };
  createdAt: number;
  updatedAt: number;
}

const defaultTowerProp: TowerProp = {
  id: '',
  ownerId: '',
  level: 1,
  amount: 0,
  realAmount: 0,
  style: {
    top: 0,
    left: 0,
  },
  createdAt: 0,
  updatedAt: 0,
};

class Tower extends Record(defaultTowerProp, 'Tower') implements TowerProp {
  // for 1ms, realAmount will increase 'rate'
  // amount is realAmount/1000

  public setRealAmount(newRealAmount: number, now: number) {
    return this
      .set('realAmount', newRealAmount)
      .set('amount', Math.floor(newRealAmount / REAL_AMOUNT_RATIO))
      .set('updatedAt', now);
  }

  public updateAmount(now: number) {
    const towerInfo = towerInfos[this.level];
    const newRealAmount = Math.max(
      this.realAmount,
      Math.min(
        REAL_AMOUNT_RATIO * towerInfo.max,
        this.realAmount + (now - this.updatedAt) * towerInfo.rate,
      ),
    );
    return this.setRealAmount(newRealAmount, now);
  }

  public subAmount(value: number, now: number) {
    const newRealAmount = Math.max(0, this.realAmount - REAL_AMOUNT_RATIO * value);
    return this.setRealAmount(newRealAmount, now);
  }

  public upgrade() {
    const towerInfo = towerInfos[this.level];
    // max level exceed
    if (this.level >= 5 || !towerInfo.upgradeCost) {
      return this;
    }
    // amount is lower then cost
    if (towerInfo.upgradeCost && towerInfo.upgradeCost > this.amount) {
      return this;
    }

    const newRealAmount = this.realAmount - REAL_AMOUNT_RATIO * towerInfo.upgradeCost;
    // dont change updatedAt
    return this
      .update('level', (level) => level + 1)
      .setRealAmount(newRealAmount, this.updatedAt);
  }
}

export default Tower;
