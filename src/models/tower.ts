import { Record } from 'immutable';

import towerInfos from 'datas/tower';
const callRatio: number = parseInt(process.env['REACT_APP_CALL_RATIO'] || '');

type TowerProp = {
  ownerId: string,
  level: number,
  amount: number,
  realAmount: number,
  style: {
    top: number,
    left: number,
  },
}

const defaultTowerProp: TowerProp = {
  ownerId: '',
  level: 1,
  amount: 0,
  realAmount: 0,
  style: {
    top: 0,
    left: 0,
  },
};

class Tower extends Record(defaultTowerProp, 'Tower') implements TowerProp {
  setAmount(newRealAmount: number) {
    return this
      .set('realAmount', newRealAmount)
      .set('amount', Math.floor(newRealAmount / callRatio));
  }
  addAmount() {
    const towerInfo = towerInfos[this.level];
    const newRealAmount = Math.max(
      this.realAmount,
      Math.min(callRatio * towerInfo.max, this.realAmount + towerInfo.rate)
    );
    return this.setAmount(newRealAmount)
  }

  subAmount(value: number) {
    const newRealAmount = Math.max(0, this.realAmount - callRatio * value);
    return this.setAmount(newRealAmount)
  }

  upgrade() {
    const towerInfo = towerInfos[this.level];
    // max level exceed
    if (this.level >= 5 || !towerInfo.upgradeCost) {
      return this;
    }
    // amount is lower then cost
    if (towerInfo.upgradeCost && towerInfo.upgradeCost > this.amount) {
      return this;
    }

    const newRealAmount = this.realAmount - callRatio * towerInfo.upgradeCost
    return this
      .update('level', level => level + 1)
      .setAmount(newRealAmount)
  }
}

export default Tower;