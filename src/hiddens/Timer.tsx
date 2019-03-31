import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Map } from 'immutable';

import { initTimer } from 'actions/timer';
import { initBoard, addTowerAmount, moveMarine, createMarine } from 'actions/board';

interface TimerProps {
  _initBoard: (now: number) => void;
  _addTowerAmount: () => void;
  _moveMarine: () => void;
  _createMarine: () => void;

  _initTimer: (now: number) => void;
}
const tick = (call: () => void) => {
  call();
  requestAnimationFrame(() => tick(call));
};
class Timer extends Component<TimerProps> {
  public render() {
    return (<div />);
  }

  public componentDidMount() {
    const { _initBoard, _addTowerAmount, _moveMarine, _createMarine, _initTimer } = this.props;

    const now = Math.floor((new Date()).getTime());
    _initBoard(now);
    _initTimer(now);

    // start requestAnimationFrame
    tick(() => {
      _addTowerAmount();
      _moveMarine();
      _createMarine();
    });
  }
}

const mapStateToProps = (state: any) => {
  return {
    // timer: state.timer,
  };
};

const mapDispatchToProps = (dispatch: any) => {
  return {
    _initBoard: (now: number) => dispatch(initBoard(now)),
    _addTowerAmount: () => dispatch(addTowerAmount()),
    _moveMarine: () => dispatch(moveMarine()),
    _createMarine: () => dispatch(createMarine()),

    _initTimer: (now: number) => dispatch(initTimer(now)),
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(Timer);
