import React, { Component } from 'react';
import { connect } from 'react-redux';
import { List, Map } from 'immutable'
import { clear, drawPoints, fixCanvasPixel } from '../functions/canvas';

interface CanvasProps {
  marineIds: List<any>,
  marines: Map<any, any>,
}
class Canvas extends Component<CanvasProps> {
  canvas?: HTMLCanvasElement;
  canvasLoad: Function;
  draw: Function;

  constructor(props: any) {
    super(props);

    // this.canvas = React.createRef();
    this.canvasLoad = (element: HTMLCanvasElement) => {
      if (!element) {
        return;
      }
      this.canvas = element;
      fixCanvasPixel(this.canvas);

      const { marineIds, marines } = this.props;
      const ctx = this.canvas.getContext('2d');
      this.draw(ctx, marineIds, marines);
    };

    this.draw = (ctx: any, marineIds: any, marines: any) => {
      const points: any[] = [];
      marines.forEach((marine: any) => {
        points.push({ x: marine.get('x'), y: marine.get('y'), color: marine.get('color') });
      });
      clear(ctx);
      drawPoints(ctx, points);
    };
  }

  shouldComponentUpdate(nextProps: any) {
    if (this.canvas) {
      // no re-render dom, only re-draw
      const { marineIds, marines } = nextProps;
      const ctx = this.canvas.getContext('2d');
      this.draw(ctx, marineIds, marines);
    }
    return false;
  }

  render() {
    return (
      <canvas ref={this.canvasLoad as any}
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

const mapStateToProps = (state: any) => {
  return {
    marineIds: state.board.getIn(['marines', 'ids']),
    marines: state.board.getIn(['marines', 'byId']),
  };
};

export default connect(
  mapStateToProps,
  null
)(Canvas);