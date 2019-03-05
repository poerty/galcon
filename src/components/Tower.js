import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import ImmutablePropTypes from 'react-immutable-proptypes';

import { selectFromTower, selectToTower, upgradeTower } from '../actions/tower';
import towerData from '../datas/tower';


class Tower extends Component {

  render() {
    const { towerAmount, towerStyle, towerLevel } = this.props;
    const { _selectFromTower, _selectToTower, _upgradeTower } = this.props;
    const towerSize = towerData[towerLevel].size;
    const fontSize = towerData[towerLevel].fontSize;
    const style = {
      width: towerSize,
      height: towerSize,
      background: 'lightsteelblue',
      border: '2px solid #666',
      color: '#666',
      textAlign: 'center',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      font: fontSize + 'px Arial, sans-serif',
      padding: '3px',
      borderRadius: '50%',
      position: 'absolute',
      ...towerStyle.toJS(),
    };
    return (
      <div className='tower'
        style={style}
        onDoubleClick={_upgradeTower}
        onMouseDown={_selectFromTower}
        onMouseUp={_selectToTower}
      >
        <div className='noselect'>{towerAmount}</div>
      </div>
    );
  }
}

Tower.propTypes = {
  towerStyle: ImmutablePropTypes.map.isRequired,
  towerAmount: PropTypes.number.isRequired,
  towerLevel: PropTypes.number.isRequired,

  _selectFromTower: PropTypes.func.isRequired,
  _selectToTower: PropTypes.func.isRequired,
  _upgradeTower: PropTypes.func.isRequired,
};

const mapStateToProps = (state, ownProps) => {
  return {
    towerStyle: state.towers.getIn(['byId', ownProps.id, 'style']),
    towerAmount: state.towers.getIn(['byId', ownProps.id, 'amount']),
    towerLevel: state.towers.getIn(['byId', ownProps.id, 'level']),
  };
};

const mapDispatchToProps = (dispatch, ownProps) => {
  return {
    _selectFromTower: () => dispatch(selectFromTower(ownProps.id)),
    _selectToTower: () => dispatch(selectToTower(ownProps.id)),
    _upgradeTower: () => dispatch(upgradeTower(ownProps.id)),
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Tower);