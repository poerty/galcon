import { Record, List, Map } from 'immutable';
import uuidv4 from 'uuidv4';

interface ObjectListProp {
  ids: List<string>;
  byId: Map<string, Map<any, any>>;
  objectClass: any;
}

const defaultObjectListProp: ObjectListProp = {
  ids: List([]),
  byId: Map({}),
  objectClass: Map,
};

class ObjectList extends Record(defaultObjectListProp, 'ObjectList') implements ObjectListProp {
  constructor(objectList: any[], objectClass: any = Map) {
    const ids: string[] = [];
    const byId: { [name: string]: Map<any, any> } = {};
    objectList.forEach((object: any) => {
      if (!object.id) {
        object.id = uuidv4();
      }
      ids.push(object.id);
      byId[object.id] = new objectClass(object);
    });
    super({ ids: List(ids), byId: Map(byId), objectClass });
    return this;
  }

  public add(data: any) {
    if (!(data instanceof this.objectClass)) {
      data = new this.objectClass(data);
    }
    const id = data.id || uuidv4();
    return this
      .update('ids', (ids) => ids.push(id))
      .setIn(['byId', id], data);
  }

  public remove(id: string) {
    return this
      .update('ids', (ids) => ids.filter((el) => el !== id))
      .deleteIn(['byId', id]);
  }
}

export default ObjectList;
