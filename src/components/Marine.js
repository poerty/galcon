import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import ImmutablePropTypes from 'react-immutable-proptypes';

import { upgradeMarine } from '../actions/marine';
// import marineData from '../datas/marine';


class Marine extends Component {

  render() {
    return (
      <div className='marine' />
    );
  }
}

Marine.propTypes = {
  marineStyle: ImmutablePropTypes.map.isRequired,
  marineAmount: PropTypes.number.isRequired,
  marineLevel: PropTypes.number.isRequired,

  _upgradeMarine: PropTypes.func.isRequired,
};

const mapStateToProps = (state, ownProps) => {
  return {
    marineStyle: state.marines.getIn(['byId', ownProps.id, 'style']),
    marineAmount: state.marines.getIn(['byId', ownProps.id, 'amount']),
    marineLevel: state.marines.getIn(['byId', ownProps.id, 'level']),
  };
};

const mapDispatchToProps = (dispatch, ownProps) => {
  return {
    _upgradeMarine: () => dispatch(upgradeMarine(ownProps.id)),
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Marine);