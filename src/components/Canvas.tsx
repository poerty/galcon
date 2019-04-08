import React, { Component } from 'react';
import { connect } from 'react-redux';
import { List, Map } from 'immutable';

import { clear, drawPoints, fixCanvasPixel } from 'functions/canvas';
import {GalconAppState} from 'modules';

interface CanvasProps {
  marineIds: List<any>;
  marines: Map<any, any>;
}
class Canvas extends Component<CanvasProps> {
  public canvas?: HTMLCanvasElement;
  public canvasLoad: (element: HTMLCanvasElement) => void;
  public draw: (ctx: any, marineIds: any, marines: any) => void;

  public constructor(props: any) {
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

  public shouldComponentUpdate(nextProps: any) {
    if (this.canvas) {
      // no re-render dom, only re-draw
      const { marineIds, marines } = nextProps;
      const ctx = this.canvas.getContext('2d');
      this.draw(ctx, marineIds, marines);
    }
    return false;
  }

  public render() {
    const style = {
      width: `${getEnv('REACT_APP_BOARD_SIZE')}px`,
      height: `${getEnv('REACT_APP_BOARD_SIZE')}px`,
    };
    return (
      <canvas
        ref={this.canvasLoad as any}
        width={`${getEnv('REACT_APP_BOARD_SIZE')}px`}
        height={`${getEnv('REACT_APP_BOARD_SIZE')}px`}
        style={style}
      />
    );
  }
}

const mapStateToProps = (state: GalconAppState) => {
  return {
    marineIds: state.board.getIn(['marines', 'ids']),
    marines: state.board.getIn(['marines', 'byId']),
  };
};

export default connect(
  mapStateToProps,
  null,
)(Canvas);
