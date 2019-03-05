import React, { Component } from 'react';
import { connect } from 'react-redux';
// import PropTypes from 'prop-types';
import ImmutablePropTypes from 'react-immutable-proptypes';

import Tower from '../components/Tower';
import Attack from '../components/Attack';

class Board extends Component {
  render() {
    const { towerIds, attackIds } = this.props;
    const style = {
      width: '500px', height: '500px',
      border: '1px solid black',
      position: 'absolute',
      top: '0px',
    };
    return (
      <div style={style}>
        {towerIds.map(towerId => (
          <Tower key={towerId} id={towerId} />
        ))}
        {attackIds.map(attackId => (
          <Attack key={attackId} id={attackId} />
        ))}
      </div>
    );
  }
}

Board.propTypes = {
  towerIds: ImmutablePropTypes.list.isRequired,
  attackIds: ImmutablePropTypes.list.isRequired,
};

const mapStateToProps = (state) => ({
  towerIds: state.towers.get('ids'),
  attackIds: state.towers.getIn(['attacks', 'ids']),
});

export default connect(mapStateToProps)(Board);
