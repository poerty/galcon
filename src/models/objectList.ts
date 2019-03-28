import { Record, List, Map } from 'immutable';
import uuidv4 from 'uuidv4';

type ObjectListProp = {
  ids: List<String>,
  byId: Map<String, Map<any, any>>
}

const defaultObjectListProp: ObjectListProp = {
  ids: List([]),
  byId: Map({})
};

class ObjectList extends Record(defaultObjectListProp, 'ObjectList') implements ObjectListProp {
  add(data: any) {
    if (!Map.isMap(data)) {
      data = Map(data)
    }
    const id = uuidv4();
    return this
      .update('ids', (ids) => ids.push(id))
      .setIn(['byId', id], data)
  }

  remove(id: string) {
    return this
      .update('ids', (ids) => ids.filter(el => el !== id))
      .deleteIn(['byId', id])
  }
}

export default ObjectList;