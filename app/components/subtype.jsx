'use strict';

import React from 'react';

class Subtype extends React.Component {
  constructor (props) {
    super(props);

    this.state = {
      cursor: 1,
      limit: 5
    };
  }

  render () {
    return (
      <section className="subtype text-center">
        <h1>Subtype</h1>
      </section>
    );
  }
}

export default Subtype;
