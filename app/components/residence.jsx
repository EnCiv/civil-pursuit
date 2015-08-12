'use strict';

import React            from 'react';
import Row              from './util/row';
import Column           from './util/column';

class Residence extends React.Component {
  render () {
    return (
      <Row>
        <Column span="50">

        </Column>

        <Column span="50">
          <h2>Residence</h2>
        </Column>
      </Row>
    );
  }
}

export default Residence;
