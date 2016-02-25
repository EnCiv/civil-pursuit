'use strict';

import React from 'react';

class Description extends React.Component {
  static propTypes = {
    description : React.PropTypes.string
  };

  render () {
    return (
      <section className="promote-description item-description">{ this.props.description }</section>
    );
  }
}

export default Description;
