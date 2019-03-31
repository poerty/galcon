import React, { Component } from 'react';
import { connect } from 'react-redux';

import Timer from 'hiddens/Timer';

class Hidden extends Component {
  public render() {
    return (
      <div style={{ display: 'none' }}>
        <Timer />
      </div>
    );
  }
}

export default connect(null)(Hidden);
