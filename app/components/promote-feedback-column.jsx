'use strict';

import React from 'react';
import Column from './util/column';
import Feedback from './promote-feedback';

class ColumnFeedback extends React.Component {
  render () {
    let { item, position } = this.props;

    if ( ! item ) {
      return ( <div></div> );
    }

    return (
      <Column span="50" className={ `promote-${position}` }>
        <Feedback className="gutter-top" />
      </Column>
    );
  }
}

export default ColumnFeedback;
