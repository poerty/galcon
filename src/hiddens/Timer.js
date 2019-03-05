import React, { Component } from 'react';
import { connect } from 'react-redux';
import ImmutablePropTypes from 'react-immutable-proptypes';
import PropTypes from 'prop-types';

import { initTimer } from '../actions/timer';
import { addAmount } from '../actions/tower';


class Timer extends Component {

  render() {
    const { _addAmount, _initTimer } = this.props;
    const startedAt = this.props.timer.get('startedAt');
    if (startedAt) {
      setInterval(() => {
        _addAmount();
      }, process.env.REACT_APP_TIME_INTERVAL);
    } else {
      _initTimer((new Date()).getTime());
    }
    return (<div />);
  }
}

Timer.propTypes = {
  timer: ImmutablePropTypes.map.isRequired,

  _addAmount: PropTypes.func.isRequired,
  _initTimer: PropTypes.func.isRequired,
};

const mapStateToProps = (state) => {
  return {
    timer: state.timer,
  };
};

const mapDispatchToProps = dispatch => {
  return {
    _addAmount: () =>
      dispatch(addAmount()),
    _initTimer: (timer) =>
      dispatch(initTimer(timer)),
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Timer);
