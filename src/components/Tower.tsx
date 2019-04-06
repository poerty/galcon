import React, { Component } from 'react';
import { connect } from 'react-redux';

import { bindActionCreators } from 'redux';

import { actionCreators as boardActions } from 'modules/board';

interface TowerProps {
  id: string;
  userId: string;

  towerStyle: any;
  towerAmount: number;
  towerLevel: number;
  towerOwnerId: string;

  BoardActions: typeof boardActions;
}
class Tower extends Component<TowerProps> {
  public handleMouseUp() {
    const { BoardActions, id } = this.props;
    BoardActions.selectAttackToTower({ towerId: id });
  }
  
  private handleDoubleClick() {
    const { BoardActions, id } = this.props;
    BoardActions.upgradeTower({ towerId: id });
  }
  private handleMouseDown() {
    const { BoardActions, id } = this.props;
    BoardActions.selectAttackFromTower({ towerId: id });
  }

  public constructor(props: any) {
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
        data-testid='tower'
      >
        <div
          className='noselect'
          style={noselectStyle}
          data-testid='towerAmount'
        >
          {towerAmount}
        </div>
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

const mapDispatchToProps = (dispatch: any) => {
  return {
    BoardActions: bindActionCreators(boardActions, dispatch),
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(Tower);
