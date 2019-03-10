import React, { Component } from 'react';
import { connect } from 'react-redux';
// import PropTypes from 'prop-types';
// import ImmutablePropTypes from 'react-immutable-proptypes';

import Towers from './Towers';
import Canvas from '../components/Canvas';

class Board extends Component {
  render() {
    const style = {
      width: `${process.env.REACT_APP_BOARD_SIZE}px`, height: `${process.env.REACT_APP_BOARD_SIZE}px`,
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

Board.propTypes = {
};

const mapStateToProps = () => ({
});

export default connect(mapStateToProps)(Board);
