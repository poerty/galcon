import React, { Component } from 'react';
import { connect } from 'react-redux';
import { List, Map } from 'immutable'

import { selectAttackFromTower, selectAttackToTower, upgradeTower } from 'actions/board';

interface TowerProps {
  userId: string,

  towerStyle: any,
  towerAmount: number,
  towerLevel: number,
  towerOwnerId: string,

  _selectAttackFromTower: Function,
  _selectAttackToTower: Function,
  _upgradeTower: Function,
}
class Tower extends Component<TowerProps> {
  render() {
    const { towerAmount, towerStyle, towerLevel, towerOwnerId } = this.props;
    const { _selectAttackFromTower, _selectAttackToTower, _upgradeTower } = this.props;
    const style: any = Object.assign({}, towerStyle);
    if (towerOwnerId === this.props.userId) {
      style.background = 'lightyellow';
    }

    const noselectStyle: any = {};
    if (towerAmount.toString()[0] === '1') {
      noselectStyle.paddingRight = '0.5px';
    }
    return (
      <div className={`tower tower-${towerLevel}`}
        style={style}
        onDoubleClick={() => _upgradeTower()}
        onMouseDown={() => _selectAttackFromTower()}
        onMouseUp={() => _selectAttackToTower()}
      >
        <div className='noselect'
          style={noselectStyle}>{towerAmount}</div>
      </div>
    );
  }
}



const mapStateToProps = (state: any, ownProps: any) => {
  return {
    userId: state.users.get('id'),

    towerStyle: state.board.getIn(['towers', 'byId', ownProps.id, 'style']),
    towerAmount: state.board.getIn(['towers', 'byId', ownProps.id, 'amount']),
    towerLevel: state.board.getIn(['towers', 'byId', ownProps.id, 'level']),
    towerOwnerId: state.board.getIn(['towers', 'byId', ownProps.id, 'ownerId']),
  };
};

const mapDispatchToProps = (dispatch: any, ownProps: any) => {
  return {
    _selectAttackFromTower: () => dispatch(selectAttackFromTower(ownProps.id)),
    _selectAttackToTower: () => dispatch(selectAttackToTower(ownProps.id)),
    _upgradeTower: () => dispatch(upgradeTower(ownProps.id)),
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Tower);