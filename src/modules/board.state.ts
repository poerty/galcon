import { Map, Record } from 'immutable';

import { TowerList } from 'models/tower';
import { AttackList } from 'models/attack';
import { MarineList } from 'models/marine';

interface BoardStateProp {
  towers: InstanceType<typeof TowerList>;
  attacks: InstanceType<typeof AttackList>;
  marines: InstanceType<typeof MarineList>;
  selected: any;
}

const defaultBoardStateProp: BoardStateProp = {
  towers: new TowerList([]),
  attacks: new AttackList([]),
  marines: new MarineList([]),
  selected: Map({
    percentage: 1.0,
  }),
};

export default class BoardState extends Record(defaultBoardStateProp, 'BoardState') implements BoardState { }