import React, { Component } from 'react';
import { connect } from 'react-redux';
// import PropTypes from 'prop-types';
import ImmutablePropTypes from 'react-immutable-proptypes';
import { clear, drawPoints } from '../functions/canvas';

class Canvas extends Component {
  constructor(props) {
    super(props);

    this.canvas = React.createRef();
    this.canvasLoad = (element) => {
      if (!element) {
        return;
      }
      this.canvas = element;
      // this.canvas.getContext('2d').fillRect(20, 20, 100, 100);
      this.startDraw(this.canvas);
    };

    this.startDraw = (canvas) => {
      const points = [
        { x: 20, y: 20, color: 'blue' },
      ];
      setInterval(() => {
        clear(canvas);
        drawPoints(canvas, points);

        // if () {
        //   clearInterval(draw);
        // }
      }, process.env.REACT_APP_TIME_INTERVAL);
    };
  }

  render() {
    const { attack } = this.props;
    console.log('attack: ', attack.toJS());
    return (
      <canvas ref={this.canvasLoad}
        width={`${process.env.REACT_APP_BOARD_SIZE}px`} height={`${process.env.REACT_APP_BOARD_SIZE}px`}
      />
    );
  }
}

Canvas.propTypes = {
  attack: ImmutablePropTypes.list.isRequired,
};

const mapStateToProps = (state) => {
  return {
    attack: state.attacks.get('ids'),
  };
};

export default connect(
  mapStateToProps,
  null
)(Canvas);