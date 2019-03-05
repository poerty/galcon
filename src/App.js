import React, { Component } from 'react';
import { connect } from 'react-redux';
import './App.css';
// import PropTypes from 'prop-types';

import Board from './layouts/Board';
import Hidden from './layouts/Hidden';

class App extends Component {
  render() {
    const style = {
      width: '100%',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
    };
    return (
      <div className='App' style={style}>
        <Board />
        <Hidden />
      </div>
    );
  }
}

export default connect(
  null,
  null,
)(App);
