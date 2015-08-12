'use strict';

import React from 'react';

class Details extends React.Component {
  constructor (props) {
    super(props);

    this.state = {
      cursor: 1,
      limit: 5
    };
  }

  render () {
    return (
      <section className="details text-center">
        <h1>Details</h1>
      </section>
    );
  }
}

export default Details;
