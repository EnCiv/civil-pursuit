'use strict';

import React from 'react';

class PromoteReference extends React.Component {
  static propTypes = {
    title : React.PropTypes.string,
    url : React.PropTypes.string.isRequired
  };

  render () {
    return (
      <h5 className="description">
        <a href={ this.props.url } rel="nofollow" target="_blank">{ this.props.title || this.props.url }</a>
      </h5>
    );
  }
}

export default PromoteReference;