import React, { Component } from 'react';
import { connect } from 'react-redux';
// import PropTypes from 'prop-types';
// import ImmutablePropTypes from 'react-immutable-proptypes';

import Timer from '../hiddens/Timer';

class Hidden extends Component {
  render() {
    return (
      <div style={{ display: 'none' }}>
        <Timer />
      </div>
    );
  }
}

export default connect(null)(Hidden);
