'use strict';

import React                          from 'react';
import feedbackType                   from '../lib/proptypes/feedback';

class Feedback extends React.Component {

  static propTypes = {
    entries : React.PropTypes.arrayOf(feedbackType)
  }

  render () {
    const { entries } = this.props;

    if ( ! entries.length ) {
      return (<div></div>);
    }

    const comments = entries.map(entry => (
      <div key={ entry._id }>
        { entry.feedback }
      </div>
    ));

    return (
      <div>
        <h4>{ entries.length } feedback</h4>
        { comments }
      </div>
    );
  }
}

export default Feedback;
