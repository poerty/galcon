import React, { Component } from 'react';
import { connect } from 'react-redux';
import { List } from 'immutable';

import Tower from 'components/Tower';
import { GalconAppState } from 'modules';

interface TowersProp {
  towerIds: List<any>;
}
class Towers extends Component<TowersProp> {
  public renderTowers(towerIds: List<any>) {
    return towerIds.map((towerId: string) => (
      <Tower key={towerId} id={towerId} />
    ));
  }
  public render() {
    const { towerIds } = this.props;
    const style: any = {
      width: `${getEnv('REACT_APP_BOARD_SIZE')}px`, height: `${getEnv('REACT_APP_BOARD_SIZE')}px`,
      border: '1px solid black',
      position: 'absolute',
      top: '0px',
    };
    return (
      <div style={style}>
        {this.renderTowers(towerIds)}
      </div>
    );
  }
}

const mapStateToProps = (state: GalconAppState) => ({
  towerIds: state.board.getIn(['towers', 'ids']),
});

export default connect(mapStateToProps)(Towers);
