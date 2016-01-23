'use strict';

import React from 'react';
import TextArea from './util/text-area';

class Feedback extends React.Component {
  render () {
    return (
      <div { ...this.props }>
        <TextArea block placeholder="Can you provide feedback that would encourage the author to create a statement that more people would unite around?" className="user-feedback block"></TextArea>
      </div>
    );
  }
}

export default Feedback;
