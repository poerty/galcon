import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Map } from 'immutable'

import { initTimer } from '../actions/timer';
import { addTowerAmount, moveMarine, createMarine } from '../actions/board';

interface TimerProps {
  timer: Map<any, any>,

  _addTowerAmount: Function,
  _moveMarine: Function,
  _createMarine: Function,

  _initTimer: Function,
}
class Timer extends Component<TimerProps> {

  render() {
    const { _addTowerAmount, _moveMarine, _createMarine, _initTimer } = this.props;
    const startedAt = this.props.timer.get('startedAt');
    if (startedAt) {
      setInterval(() => {
        _addTowerAmount();
        _moveMarine();
      }, parseInt(process.env.REACT_APP_TIME_INTERVAL || ''));

      setInterval(() => {
        _createMarine();
      }, parseInt(process.env.REACT_APP_TIME_INTERVAL || '') * 30);
    } else {
      _initTimer((new Date()).getTime());
    }
    return (<div />);
  }
}

const mapStateToProps = (state: any) => {
  return {
    timer: state.timer,
  };
};

const mapDispatchToProps = (dispatch: any) => {
  return {
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
