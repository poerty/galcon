import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import ImmutablePropTypes from 'react-immutable-proptypes';

import { selectFromTower, selectToTowerAndAttack, upgradeTower } from '../actions/tower';
import towerData from '../datas/tower';


class Tower extends Component {
  constructor(props) {
    super(props);
    const { playerId } = props;
    this._selectFromTower = () => this.props._selectFromTower(playerId);
    this._selectToTowerAndAttack = () => this.props._selectToTowerAndAttack(playerId);
    this._upgradeTower = () => this.props._upgradeTower(playerId);
  }

  render() {
    const { playerId, towerOwnerId, towerAmount, towerStyle, towerLevel } = this.props;
    const { _selectFromTower, _selectToTowerAndAttack, _upgradeTower } = this;
    const towerSize = towerData[towerLevel].size;
    const fontSize = towerData[towerLevel].fontSize;
    const style = {
      width: towerSize,
      height: towerSize,
      font: `${fontSize}px Arial, sans-serif`,
      ...towerStyle.toJS(),
    };
    if (playerId === towerOwnerId) {
      style.backgroundColor = 'lightyellow';
    }
    return (
      <div className='tower'
        style={style}
        onDoubleClick={_upgradeTower}
        onMouseDown={_selectFromTower}
        onMouseUp={_selectToTowerAndAttack}
      >
        <div className='noselect'>{towerAmount}</div>
      </div>
    );
  }
}

Tower.propTypes = {
  playerId: PropTypes.string.isRequired,

  towerOwnerId: PropTypes.string.isRequired,
  towerStyle: ImmutablePropTypes.map.isRequired,
  towerAmount: PropTypes.number.isRequired,
  towerLevel: PropTypes.number.isRequired,

  _selectFromTower: PropTypes.func.isRequired,
  _selectToTowerAndAttack: PropTypes.func.isRequired,
  _upgradeTower: PropTypes.func.isRequired,
};

const mapStateToProps = (state, ownProps) => {
  return {
    playerId: state.users.get('playerId'),

    towerOwnerId: state.towers.getIn(['byId', ownProps.id, 'ownerId']),
    towerStyle: state.towers.getIn(['byId', ownProps.id, 'style']),
    towerAmount: state.towers.getIn(['byId', ownProps.id, 'amount']),
    towerLevel: state.towers.getIn(['byId', ownProps.id, 'level']),
  };
};

const mapDispatchToProps = (dispatch, ownProps) => {
  return {
    _selectFromTower: (playerId) => dispatch(selectFromTower(ownProps.id, playerId)),
    _selectToTowerAndAttack: (playerId) => dispatch(selectToTowerAndAttack(ownProps.id, playerId)),
    _upgradeTower: (playerId) => dispatch(upgradeTower(ownProps.id, playerId)),
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Tower);