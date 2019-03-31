import React, { Component } from 'react';
import { connect } from 'react-redux';
import { List, Map } from 'immutable';

import { selectAttackFromTower, selectAttackToTower, upgradeTower } from 'actions/board';

interface TowerProps {
  userId: string;

  towerStyle: any;
  towerAmount: number;
  towerLevel: number;
  towerOwnerId: string;

  _selectAttackFromTower: () => void;
  _selectAttackToTower: () => void;
  _upgradeTower: () => void;
}
class Tower extends Component<TowerProps> {
  constructor(props: any) {
    super(props);
    this.handleDoubleClick = this.handleDoubleClick.bind(this);
    this.handleMouseDown = this.handleMouseDown.bind(this);
    this.handleMouseUp = this.handleMouseUp.bind(this);
  }

  public render() {
    const { towerAmount, towerStyle, towerLevel, towerOwnerId } = this.props;
    const style: any = Object.assign({}, towerStyle);
    if (towerOwnerId === this.props.userId) {
      style.background = 'lightyellow';
    }

    const noselectStyle: any = {};
    if (towerAmount.toString()[0] === '1') {
      noselectStyle.paddingRight = '0.5px';
    }
    // fuck safari.. does not re render immediately if css not changed
    if (towerAmount % 2 === 0) {
      noselectStyle.position = 'absolute';
    }
    return (
      <div
        className={`tower tower-${towerLevel}`}
        style={style}
        onDoubleClick={this.handleDoubleClick}
        onMouseDown={this.handleMouseDown}
        onMouseUp={this.handleMouseUp}
      >
        <div className='noselect' style={noselectStyle}>
          {towerAmount}
        </div>
      </div>
    );
  }

  private handleDoubleClick(event: React.MouseEvent<HTMLElement>) {
    const { _upgradeTower } = this.props;
    _upgradeTower();
  }
  private handleMouseDown(event: React.MouseEvent<HTMLElement>) {
    const { _selectAttackFromTower } = this.props;
    _selectAttackFromTower();
  }
  private handleMouseUp(event: React.MouseEvent<HTMLElement>) {
    const { _selectAttackToTower } = this.props;
    _selectAttackToTower();
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
  mapDispatchToProps,
)(Tower);
