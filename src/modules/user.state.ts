import { Record } from 'immutable';

interface UserStateProp {
  id: string;
}

const defaultUserStateProp: UserStateProp = {
  id: '',
};

export default class UserState extends Record(defaultUserStateProp, 'UserState') implements UserState { }