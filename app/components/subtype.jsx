'use strict';

import React from 'react';
import Loading from './util/loading';

class Subtype extends React.Component {
  constructor (props) {
    super(props);

    this.get();
  }

  get () {
    if ( typeof window !== 'undefined' ) {
      window.socket.emit('get items', { type : this.props.item.subtype._id, parent : this.props.item._id })
        .on('OK get items', (panel, items) => {
          if ( panel.type._id === this.props.item.subtype._id ) {
            console.log({ subtype: { panel, items} })
          }
          // if ( evaluation.items)
        })
    }
  }

  render () {
    return (
      <section className="subtype text-center">
        <Loading />
      </section>
    );
  }
}

export default Subtype;
