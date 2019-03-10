import React, { Component } from 'react';
import { connect } from 'react-redux';
import ImmutablePropTypes from 'react-immutable-proptypes';
import PropTypes from 'prop-types';

import { initTimer } from '../actions/timer';
import { addTowerAmount, moveMarine, createMarine } from '../actions/board';


class Timer extends Component {

  render() {
    const { _addTowerAmount, _moveMarine, _createMarine, _initTimer } = this.props;
    const startedAt = this.props.timer.get('startedAt');
    if (startedAt) {
      setInterval(() => {
        _addTowerAmount();
        _moveMarine();
      }, process.env.REACT_APP_TIME_INTERVAL);

      setInterval(() => {
        _createMarine();
      }, process.env.REACT_APP_TIME_INTERVAL * 30);
    } else {
      _initTimer((new Date()).getTime());
    }
    return (<div />);
  }
}

Timer.propTypes = {
  timer: ImmutablePropTypes.map.isRequired,

  _addTowerAmount: PropTypes.func.isRequired,
  _moveMarine: PropTypes.func.isRequired,
  _createMarine: PropTypes.func.isRequired,

  _initTimer: PropTypes.func.isRequired,
};

const mapStateToProps = (state) => {
  return {
    timer: state.timer,
  };
};

const mapDispatchToProps = dispatch => {
  return {
    _addTowerAmount: () => dispatch(addTowerAmount()),
    _moveMarine: () => dispatch(moveMarine()),
    _createMarine: () => dispatch(createMarine()),

    _initTimer: (timer) => dispatch(initTimer(timer)),
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Timer);
