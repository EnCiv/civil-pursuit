'use strict';

import React from 'react';

class Harmony extends React.Component {
  constructor (props) {
    super(props);

    this.state = {
      cursor: 1,
      limit: 5
    };
  }

  render () {
    return (
      <section className="harmony text-center">
        <h1>Harmony</h1>
      </section>
    );
  }
}

export default Harmony;
