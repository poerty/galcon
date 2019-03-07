import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import ImmutablePropTypes from 'react-immutable-proptypes';

import { marineArriveTower, attackEnd } from '../actions/tower';

class Attack extends Component {
  constructor(props) {
    super(props);
    const { _marineArriveTower, _attackEnd } = this.props;


    this.path = React.createRef();
    this.pathLoad = (element) => {
      if (!element) {
        return;
      }
      this.path = element;
      this.len = this.path.getTotalLength();
    };

    this.startTime = new Date();
    this.div = {};
    this.divLoad = (i, endPoint) => (element) => {
      if (!element) {
        return;
      }
      this.div[i] = React.createRef();
      this.div[i] = element;

      this.startAnimate(i, endPoint);
    };

    this.startAnimate = (i, endPoint) => {
      const dur = this.len / 100;
      // 초속 100
      const interval = setInterval(() => {
        const now = new Date();
        const time = (now - this.startTime - i * 100) / 1000;
        const percentage = time / dur;

        const point = this.path.getPointAtLength(this.len * percentage);
        this.div[i].style.left = `${point.x}px`;
        this.div[i].style.top = `${point.y}px`;

        if (point.x === endPoint.left && point.y === endPoint.top) {
          clearInterval(interval);
          _marineArriveTower();
          delete this.div[i];
          if (Object.keys(this.div).length === 0) {
            _attackEnd();
          }
        }
      }, process.env.REACT_APP_TIME_INTERVAL);
    };
  }

  render() {
    // ATTACK component will never re-render
    const { id, attack } = this.props;
    const fromPosition = `${attack.getIn(['from', 'left'])},${attack.getIn(['from', 'top'])}`;
    const toPosition = `${attack.getIn(['to', 'left'])},${attack.getIn(['to', 'top'])}`;
    const path = `M${fromPosition} L${toPosition}`;
    const pathId = `${id}-path`;
    const amount = attack.get('amount');

    // style will fixed
    const style = {
      top: attack.getIn(['from', 'top']),
      left: attack.getIn(['from', 'left']),
    };

    const marineList = [];
    for (let i = 0; i < amount; i++) {
      marineList.push(
        <div
          key={`${id}-${i}`} ref={this.divLoad(i, attack.get('to').toJS())}
          style={style} className='marine' background='red' />
      );
    }
    return (
      <div className='attack'>
        <svg className='attack-svg'>
          <path d={path} stroke='black' id={pathId} ref={this.pathLoad} />
        </svg>
        {marineList}
      </div>
    );
  }
}

Attack.propTypes = {
  id: PropTypes.string.isRequired,
  attack: ImmutablePropTypes.map.isRequired,

  _marineArriveTower: PropTypes.func.isRequired,
  _attackEnd: PropTypes.func.isRequired,
};

const mapStateToProps = (state, ownProps) => {
  return {
    attack: state.towers.getIn(['attacks', 'byId', ownProps.id]),
  };
};

const mapDispatchToProps = (dispatch, ownProps) => {
  return {
    _marineArriveTower: () => dispatch(marineArriveTower(ownProps.id)),
    _attackEnd: () => dispatch(attackEnd(ownProps.id)),
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Attack);