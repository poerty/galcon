import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import { actionCreators as boardActions } from 'modules/board';
import { actionCreators as timerActions } from 'modules/timer';
import { GalconAppState } from 'modules';

interface TimerProps {
  BoardActions: typeof boardActions;
  TimerActions: typeof timerActions;
}
const tick = (call: () => void) => {
  call();
  requestAnimationFrame(() => tick(call));
};
class Timer extends Component<TimerProps> {

  public componentDidMount() {
    const { BoardActions, TimerActions } = this.props;

    const now = Math.floor((new Date()).getTime());
    BoardActions.initBoard({ now });
    TimerActions.initTimer({now});

    // start requestAnimationFrame
    tick(() => {
      BoardActions.addTowerAmount();
      BoardActions.moveMarine();
      BoardActions.createMarine();
    });
  }

  public render() {
    return (<div />);
  }
}

const mapStateToProps = (state: GalconAppState) => {
  return {
    timer: state.timer,
  };
};

const mapDispatchToProps = (dispatch: any) => {
  return {
    BoardActions: bindActionCreators(boardActions, dispatch),
    TimerActions: bindActionCreators(timerActions, dispatch),
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(Timer);
