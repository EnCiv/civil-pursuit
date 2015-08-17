'use strict';

import React            from 'react';
import Loading          from './util/loading';
import Votes            from './votes';

class Popularity extends React.Component {
  animate () {
    let { number } = this.props;

    number =  75;

    let bar = React.findDOMNode(this.refs.bar);
    bar.style.width = `${number}%`;
  }

  render () {
    let { number } = this.props;

    number =  75;

    setTimeout(this.animate.bind(this), 2000);

    return (
      <div className="syn-popularity">
        <div className="syn-popularity-bar" style={{ width : 0 }} ref="bar">{ `${number}%` }</div>
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

      content.push(
        ( <Popularity { ...this.props.item.popularity } /> ),
        ( <Votes { ...this.state.details } /> )
      );
    }

    return (
      <section className={`item-details ${this.props.className}`}>
        { content }
      </section>
    );
  }
}

export default Details;
