'use strict';

import React from 'react';

class Subject extends React.Component {
  static propTypes = {
    subject : React.PropTypes.string
  }

  render () {
    return (
      <h4 className="item-subject">{ this.props.subject }</h4>
    );
  }
}

export default Subject;
