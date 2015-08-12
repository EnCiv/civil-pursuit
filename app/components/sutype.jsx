'use strict';

import React from 'react';

class Promote extends React.Component {
  constructor (props) {
    super(props);

    this.state = {
      cursor: 1,
      limit: 5,
      evaluation: null
    };

    this.get();
  }

  get () {
    if ( typeof window !== 'undefined' ) {
      window.socket.emit('get evaluation', this.props.item)
        .on('OK get evaluation', evaluation => {
          console.log({ evaluation })
          // if ( evaluation.items)
        })
    }
  }

  render () {
    return (
      <section className="promote text-center">
        <header className="promote-steps">
          <h2>{ this.state.cursor } of { this.state.limit }</h2>
          <h4>Evaluate each item below</h4>
        </header>

        <div className="items-side-by-side">

        </div>
      </section>
    );
  }
}

export default Promote;
