import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import ImmutablePropTypes from 'react-immutable-proptypes';

import { selectAttackFromTower, selectAttackToTower, upgradeTower } from '../actions/board';


class Tower extends Component {
  render() {
    const { towerAmount, towerStyle, towerLevel, towerOwnerId } = this.props;
    const { _selectAttackFromTower, _selectAttackToTower, _upgradeTower } = this.props;
    const style = towerStyle.toJS();
    if (towerOwnerId === this.props.userId) {
      style.background = 'lightyellow';
    }

    const noselectStyle = {};
    if (towerAmount.toString()[0] === '1') {
      noselectStyle.paddingRight = '0.5px';
    }
    return (
      <div className={`tower tower-${towerLevel}`}
        style={style}
        onDoubleClick={(_upgradeTower)}
        onMouseDown={_selectAttackFromTower}
        onMouseUp={_selectAttackToTower}
      >
        <div className='noselect'
          style={noselectStyle}>{towerAmount}</div>
      </div>
    );
  }
}

Tower.propTypes = {
  userId: PropTypes.string.isRequired,

  towerStyle: ImmutablePropTypes.map.isRequired,
  towerAmount: PropTypes.number.isRequired,
  towerLevel: PropTypes.number.isRequired,
  towerOwnerId: PropTypes.string.isRequired,

  _selectAttackFromTower: PropTypes.func.isRequired,
  _selectAttackToTower: PropTypes.func.isRequired,
  _upgradeTower: PropTypes.func.isRequired,
};

const mapStateToProps = (state, ownProps) => {
  return {
    userId: state.users.get('id'),

    towerStyle: state.board.getIn(['towers', 'byId', ownProps.id, 'style']),
    towerAmount: state.board.getIn(['towers', 'byId', ownProps.id, 'amount']),
    towerLevel: state.board.getIn(['towers', 'byId', ownProps.id, 'level']),
    towerOwnerId: state.board.getIn(['towers', 'byId', ownProps.id, 'ownerId']),
  };
};

const mapDispatchToProps = (dispatch, ownProps) => {
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