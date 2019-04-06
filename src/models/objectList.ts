import { Record, List, Map } from 'immutable';
import uuidv4 from 'uuidv4';

type Constructor<T> = new (...args: any[]) => T;

// for Immutable Record (functional type is not complete I guess)
interface ObjectListProp<T> {
  ids: List<string>;
  byId: Map<string, T>;

}
function getDefaultObjectListProp<T>(): ObjectListProp<T> {
  return {
    ids: List([]),
    byId: Map({}),
  };
}
interface ObjectList<T> extends ObjectListProp<T> {
  add(data: any): ObjectList<T>;
  remove(id: string): ObjectList<T>;
  getById(id: string): T;
}

function ObjectList<T>(Base: Constructor<T>) {
  class ObjectListClass
    extends Record(getDefaultObjectListProp<T>()) implements ObjectListProp<T> {

    public constructor(objectList: any[]) {
      super({ ids: List([]), byId: Map([]) });
      const ids: string[] = [];
      const byId: { [name: string]: T } = {};
      objectList.forEach((object: any) => {
        if (!object.id) {
          object.id = uuidv4();
        }
        ids.push(object.id);
        byId[object.id] = new Base(object);
      });
      this.add = this.add.bind(this);
      this.remove = this.remove.bind(this);
      this.getById = this.getById.bind(this);
      return this
        .set('ids', List(ids))
        .set('byId', Map(byId));
    }

    public add(data: any) {
      if (!(data instanceof Base)) {
        data = new Base(data);
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

    public getById(id: string) {
      const byId = this.get('byId');
      const object = byId.get(id);
      if (!object) {
        throw new Error('OBJECT_NOT_EXIST');
      }
      return object;
    }
  }

  return ObjectListClass;
}

export default ObjectList;
