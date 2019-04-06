import { Record } from 'immutable';

import ObjectList from 'models/objectList';

interface MarineProp {
  id: string;
  ownerId: string;
  fromTowerId: string;
  toTowerId: string;
  curve: any;
  x: number;
  y: number;
  color: string;
  createdAt: number;
  updatedAt: number;
  deletedAt: number;
  duration: number;
}

const defaultMarineProp: MarineProp = {
  id: '',
  ownerId: '',
  fromTowerId: '',
  toTowerId: '',
  curve: null,
  x: 0,
  y: 0,
  color: 'gray',
  createdAt: 0,
  updatedAt: 0,
  deletedAt: 0,
  duration: 0,
};

class Marine extends Record(defaultMarineProp, 'Marine') implements MarineProp {
  public move(now: number) {
    const createdAt = this.createdAt;
    const duration = this.duration;
    const percentage = (now - createdAt) / duration;
    const curve = this.curve;
    const point = curve.get(percentage);
    return this
      .set('x', point.x)
      .set('y', point.y)
      .set('updatedAt', now);
  }
}

export default Marine;
export class MarineList extends ObjectList(Marine) { }
