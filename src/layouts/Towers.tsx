import React, { Component } from 'react';
import { connect } from 'react-redux';
import { List } from 'immutable'

import Tower from '../components/Tower';

interface TowersProp {
  towerIds: List<any>
}
class Towers extends Component<TowersProp> {
  render() {
    const { towerIds } = this.props;
    const style: any = {
      width: `${process.env.REACT_APP_BOARD_SIZE}px`, height: `${process.env.REACT_APP_BOARD_SIZE}px`,
      border: '1px solid black',
      position: 'absolute',
      top: '0px',
    };
    return (
      <div style={style}>
        {towerIds.map((towerId: string) => (
          <Tower key={towerId} id={towerId} />
        ))}
      </div>
    );
  }
}

const mapStateToProps = (state: any) => ({
  towerIds: state.board.getIn(['towers', 'ids']),
});

export default connect(mapStateToProps)(Towers);
