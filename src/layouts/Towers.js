import React, { Component } from 'react';
import { connect } from 'react-redux';
// import PropTypes from 'prop-types';
import ImmutablePropTypes from 'react-immutable-proptypes';

import Tower from '../components/Tower';

class Towers extends Component {
  render() {
    const { towerIds } = this.props;
    const style = {
      width: `${process.env.REACT_APP_BOARD_SIZE}px`, height: `${process.env.REACT_APP_BOARD_SIZE}px`,
      border: '1px solid black',
      position: 'absolute',
      top: '0px',
    };
    return (
      <div style={style}>
        {towerIds.map(towerId => (
          <Tower key={towerId} id={towerId} />
        ))}
      </div>
    );
  }
}

Towers.propTypes = {
  towerIds: ImmutablePropTypes.list.isRequired,
};

const mapStateToProps = (state) => ({
  towerIds: state.towers.get('ids'),
});

export default connect(mapStateToProps)(Towers);
