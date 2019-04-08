import { Record } from 'immutable';

interface TimerStateProp {
  startedAt: number;
}

const defaultTimerStateProp: TimerStateProp = {
  startedAt: 0,
};

export default class TimerState extends Record(defaultTimerStateProp, 'TimerState') implements TimerState { }