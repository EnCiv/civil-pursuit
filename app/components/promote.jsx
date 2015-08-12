'use strict';

import React from 'react';

class Promote extends React.Component {
  constructor (props) {
    super(props);

    this.state = {
      cursor: 1,
      limit: 5
    };
  }

  render () {
    return (
      <section className="promote text-center">
        <header className="promote-steps">
          <h2>{ this.state.cursor } of { this.state.limit }</h2>
        </header>
      </section>
    );
  }
}

export default Promote;
