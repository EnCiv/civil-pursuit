'use strict';

import React                          from 'react';
import feedbackType                   from '../lib/proptypes/feedback';

class Feedback extends React.Component {

  render () {
    const { entries, total } = this.props;

    if ( ! entries.length ) {
      return (<section className="details-no-feedback"></section>);
    }

    const comments = entries.map(entry => (
      <section key={ entry._id } className="details-feedback-entry">
        { entry.feedback }
      </section>
    ));

    return (
      <section className="details-feedback">
        <h4 className="number-of-feedback">{ total } feedback</h4>
        { comments }
      </section>
    );
  }
}

export default Feedback;
