'use strict';

import React from 'react';
import Loading from './util/loading';

class Harmony extends React.Component {
  constructor (props) {
    super(props);

    this.get()
  }

  get () {
    if ( typeof window !== 'undefined' ) {
      let { harmony } = this.props.item.type;
      // window.socket.emit('get items', { type : this.props.item.subtype._id, parent : this.props.item._id })
      //   .on('OK get items', (panel, items) => {
      //     if ( panel.type._id === this.props.item.subtype._id ) {
      //       console.log({ subtype: { panel, items} })
      //     }
      //     // if ( evaluation.items)
      //   })
    }
  }


  render () {
    return (
      <section className="harmony text-center">
        <Loading />
      </section>
    );
  }
}

export default Harmony;
