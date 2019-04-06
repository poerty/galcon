import { Record } from 'immutable';
import Bezier from 'bezier-js';

import ObjectList from 'models/objectList';

import { getControllPoints } from 'functions/canvas';

const MAX_ATTACK_SIZE = parseInt(getEnv('REACT_APP_MAX_ATTACK_SIZE'), 10);
const MARINE_INTERVAL = parseInt(getEnv('REACT_APP_MARINE_INTERVAL'), 10);

interface AttackProp {
  id: string;
  ownerId: string;
  amount: number;
  from: {
    towerId: string;
    top: number;
    left: number;
  };
  to: {
    towerId: string;
    top: number;
    left: number;
  };
  createdAt: number;
  updatedAt: number;
  marineCreatedAt: number;
}

const defaultAttackProp: AttackProp = {
  id: '',
  ownerId: '',
  amount: 0,
  from: {
    towerId: '',
    top: 0,
    left: 0,
  },
  to: {
    towerId: '',
    top: 0,
    left: 0,
  },
  createdAt: 0,
  updatedAt: 0,
  marineCreatedAt: 0,
};

class Attack extends Record(defaultAttackProp, 'Attack') implements AttackProp {

  public getNewMarines(amount: number, now: number) {
    const fromTowerId = this.from.towerId;
    const toTowerId = this.to.towerId;
    let marineCreatedAt = this.marineCreatedAt;

    const marines = [];
    let totalMarineAmount = Math.min(amount, this.amount);
    while (totalMarineAmount > 0) {
      if (marineCreatedAt + MARINE_INTERVAL > now) {
        break;
      }
      marineCreatedAt += MARINE_INTERVAL;
      const marineAmount = Math.min(totalMarineAmount, MAX_ATTACK_SIZE);
      totalMarineAmount -= marineAmount;

      const startPoint = { x: this.getIn(['from', 'left']), y: this.getIn(['from', 'top']) };
      const endPoint = { x: this.getIn(['to', 'left']), y: this.getIn(['to', 'top']) };
      const controllPoints = getControllPoints(
        marineAmount,
        startPoint,
        endPoint,
        10,
      );
      const distance = Math.sqrt(Math.pow(endPoint.x - startPoint.x, 2) + Math.pow(endPoint.y - startPoint.y, 2));
      const duration = distance * 30;
      for (let i = 0; i < marineAmount; i++) {
        const curve = new Bezier(startPoint, controllPoints[i], endPoint);
        // const LUT = curve.getLUT(1000);
        const point = curve.get(0);
        const marine = {
          ownerId: this.get('ownerId'),
          fromTowerId,
          toTowerId,
          curve,
          x: point.x,
          y: point.y,
          color: 'red',
          createdAt: marineCreatedAt,
          updatedAt: marineCreatedAt,
          deletedAt: marineCreatedAt + duration,
          duration,
        };
        marines.push(marine);
      }
    }

    return marines;
  }

  public subAmount(value: number, now: number) {
    return this
      .update('amount', (amount) => Math.max(0, amount - value))
      .set('updatedAt', now);
  }
}

export default Attack;
export class AttackList extends ObjectList(Attack) { }
