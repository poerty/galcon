import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import ImmutablePropTypes from 'react-immutable-proptypes';

class Attack extends Component {
  constructor(props) {
    super(props);
    this.path = React.createRef();
    this.pathLoad = (element) => {
      this.path = element;
      this.len = this.path.getTotalLength();
    };

    this.startTime = new Date();
    this.div = {};
    this.divLoad = (i) => (element) => {
      this.div[i] = React.createRef();
      this.div[i] = element;

      this.startAnimate(i);
    };

    this.startAnimate = (i) => {
      const dur = 5;
      setInterval(() => {
        const now = new Date();
        const time = (now - this.startTime - i * 100) / 1000;
        const percentage = time / dur;
        const point = this.path.getPointAtLength(this.len * percentage);
        this.div[i].style.left = `${point.x}px`;
        this.div[i].style.top = `${point.y}px`;
      }, process.env.REACT_APP_TIME_INTERVAL);
    };
  }

  render() {
    const { id, attack } = this.props;
    console.log('RENDER ATTACK', id);
    const fromPosition = `${attack.getIn(['from', 'left'])},${attack.getIn(['from', 'top'])}`;
    const toPosition = `${attack.getIn(['to', 'left'])},${attack.getIn(['to', 'top'])}`;
    const path = `M${fromPosition} L${toPosition}`;
    const pathId = `${id}-path`;
    // const begin = attack.get('at');
    const style = {
      position: 'absolute',
      top: attack.getIn(['from', 'top']),
      left: attack.getIn(['from', 'left']),
      width: '10px', height: '10px',
      background: 'red',
    };

    const amount = 100;

    const marineList = [];
    for (let i = 0; i < amount; i++) {
      marineList.push(
        <div
          key={`${id}-${i}`}
          style={style} background='red' ref={this.divLoad(i)} />
      );
    }
    console.log('amount: ', amount);
    return (
      <div className='attack'>
        <svg>
          <path d={path} stroke='green' id={pathId} ref={this.pathLoad} />
        </svg>
        {marineList}
      </div>
    );
  }
}

Attack.propTypes = {
  id: PropTypes.string.isRequired,
  attack: ImmutablePropTypes.map.isRequired,
};

const mapStateToProps = (state, ownProps) => {
  return {
    attack: state.towers.getIn(['attacks', 'byId', ownProps.id]),
  };
};

// const mapDispatchToProps = (dispatch, ownProps) => {
//   return {
//   };
// };

export default connect(
  mapStateToProps,
  // mapDispatchToProps
)(Attack);