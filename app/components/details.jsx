'use strict';

import React from 'react';
import Loading from './util/loading';

class Popularity extends React.Component {
  render () {
    return (
      <div>
        <div>{ this.props.number }</div>
      </div>
    );
  }
}

class Details extends React.Component {
  constructor (props) {
    super(props);

    this.status = 'iddle';

    this.state = {};
  }

  componentWillReceiveProps (props) {
    if ( props.show && this.status === 'iddle' ) {
      this.status = 'ready';
      this.get();
    }
  }

  get () {
    if ( typeof window !== 'undefined' ) {
      window.socket.emit('get item details', this.props.item)
        .on('OK get item details', details => {
          this.setState({ details });
        })
    }
  }

  render () {
    let content = ( <Loading /> );

    if ( this.state.details ) {
      content = [];

      content.push(<Popularity { ...this.props.item.popularity } />);
    }

    return (
      <section className="details text-center">
        { content }
      </section>
    );
  }
}

export default Details;
