'use strict';

import React from 'react';
import Row from './util/row';
import Column from './util/column';
import ItemMedia from './item-media';
import Loading from './util/loading';

class Header extends React.Component {
  render () {
    return (
      <header className="promote-steps">
        <h2>{ this.state.cursor } of { this.state.limit }</h2>
        <h4>Evaluate each item below</h4>
      </header>
    );
  }
}

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
          // console.log({ evaluation })
          // if ( evaluation.items)
        })
    }
  }

  render () {

    let content = ( <Loading /> );

    return (
      <section className="promote text-center">
        { content }
      </section>
    );
  }
}

export default Promote;
