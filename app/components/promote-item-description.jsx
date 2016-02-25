'use strict';

import React from 'react';

class Description extends React.Component {
  static propTypes = {
    description1 : React.PropTypes.string,
    description2 : React.PropTypes.string
  };

  render () {
    return (
      <section className="promote-description item-description">
      	<div className="column1">{ this.props.description1 }</div>
      	<div className="column2">{ this.props.description2 }</div>
      </section>
    );
  }
}

export default Description;
