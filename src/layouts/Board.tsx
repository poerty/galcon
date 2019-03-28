import React, { Component } from 'react';
import { connect } from 'react-redux';

import Towers from 'layouts/Towers';
import Canvas from 'components/Canvas';

class Board extends Component {
  render() {
    const style: any = {
      width: `${getEnv('REACT_APP_BOARD_SIZE')}px`, height: `${getEnv('REACT_APP_BOARD_SIZE')}px`,
      border: '1px solid black',
      position: 'absolute',
      top: '0px',
    };
    return (
      <div style={style}>
        <Towers />
        <Canvas />
      </div>
    );
  }
}

const mapStateToProps = () => ({
});

export default connect(mapStateToProps)(Board);
