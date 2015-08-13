'use strict';

import React from 'react';

class Details extends React.Component {
  constructor (props) {
    super(props);

    this.get();
  }

  get () {
    if ( typeof window !== 'undefined' ) {
      window.socket.emit('get item details', this.props.item)
        .on('OK get item details', details => {
          // console.log({ details })
          // if ( evaluation.items)
        })
    }
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
