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
        <h2>{ this.props.cursor } of { this.props.limit }</h2>
        <h4>Evaluate each item below</h4>
      </header>
    );
  }
}

class Promote extends React.Component {
  constructor (props) {
    super(props);

    this.state = {
      cursor: 1
    };

    this.get();
  }

  get () {
    if ( typeof window !== 'undefined' ) {
      window.socket.emit('get evaluation', this.props.item)
        .on('OK get evaluation', evaluation => {

          let limit = 5;

          this.setState({
            limit   :   limit,
            left    :   evaluation.items[0],
            right   :   evaluation.items[1]
          });
        })
    }
  }

  render () {

    let content = ( <Loading /> );

    if ( this.state.limit ) {
      content = [];

      content.push(
        ( <Header { ...this.state } /> ),
        (
          <Row>
            <Column>
              <ItemMedia item={ this.state.left } />
            </Column>

            <Column>
              <ItemMedia item={ this.state.right } />
            </Column>
          </Row>
        )
      );
    }

    return (
      <section className="promote text-center">
        { content }
      </section>
    );
  }
}

export default Promote;
