import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Map } from 'immutable'

import { initTimer } from 'actions/timer';
import { initBoard, addTowerAmount, moveMarine, createMarine } from 'actions/board';

interface TimerProps {
  timer: Map<any, any>,

  _initBoard: Function,
  _addTowerAmount: Function,
  _moveMarine: Function,
  _createMarine: Function,

  _initTimer: Function,
}
const tick = (call: Function) => {
  call()
  requestAnimationFrame(() => tick(call))
}
class Timer extends Component<TimerProps> {
  render() {
    return (<div />);
  }

  componentDidMount() {
    const { _initBoard, _addTowerAmount, _moveMarine, _createMarine, _initTimer } = this.props;

    const now = Math.floor((new Date()).getTime());
    _initBoard(now);
    _initTimer(now);

    //start requestAnimationFrame
    tick(() => {
      _addTowerAmount();
      _moveMarine();
    })

    setInterval(() => {
      _createMarine();
    }, parseInt(getEnv('REACT_APP_TIME_INTERVAL')) * 30);
  }
}

const mapStateToProps = (state: any) => {
  return {
    timer: state.timer,
  };
};

const mapDispatchToProps = (dispatch: any) => {
  return {
    _initBoard: (now: string) => dispatch(initBoard(now)),
    _addTowerAmount: () => dispatch(addTowerAmount()),
    _moveMarine: () => dispatch(moveMarine()),
    _createMarine: () => dispatch(createMarine()),

    _initTimer: (timer: any) => dispatch(initTimer(timer)),
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Timer);
