import React, { Component } from 'react';
import { connect } from 'react-redux';
// import PropTypes from 'prop-types';
import ImmutablePropTypes from 'react-immutable-proptypes';
import { clear, drawPoints, fixCanvasPixel } from '../functions/canvas';

class Canvas extends Component {
  constructor(props) {
    super(props);

    this.canvas = React.createRef();
    this.canvasLoad = (element) => {
      if (!element) {
        return;
      }
      this.canvas = element;

      fixCanvasPixel(this.canvas);

      const { marineIds, marines } = this.props;
      const ctx = this.canvas.getContext('2d');

      this.draw(ctx, marineIds, marines);
    };

    this.draw = (ctx, marineIds, marines) => {
      const points = [];
      marines.forEach(marine => {
        points.push({ x: marine.get('x'), y: marine.get('y'), color: marine.get('color') });
      });
      clear(ctx);
      drawPoints(ctx, points);
    };
  }

  shouldComponentUpdate(nextProps) {
    if (this.canvas) {
      const { marineIds, marines } = nextProps;
      const ctx = this.canvas.getContext('2d');

      this.draw(ctx, marineIds, marines);
    }
    return false;
  }

  render() {
    return (
      <canvas ref={this.canvasLoad}
        width={`${process.env.REACT_APP_BOARD_SIZE}px`} height={`${process.env.REACT_APP_BOARD_SIZE}px`}
        style={
          {
            width: `${process.env.REACT_APP_BOARD_SIZE}px`,
            height: `${process.env.REACT_APP_BOARD_SIZE}px`,
          }
        }
      />
    );
  }
}

Canvas.propTypes = {
  marineIds: ImmutablePropTypes.list.isRequired,
  marines: ImmutablePropTypes.map.isRequired,
};

const mapStateToProps = (state) => {
  return {
    marineIds: state.board.getIn(['marines', 'ids']),
    marines: state.board.getIn(['marines', 'byId']),
  };
};

export default connect(
  mapStateToProps,
  null
)(Canvas);