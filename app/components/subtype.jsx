'use strict';

import React from 'react';
import Loading from './util/loading';
import Panel from './panel';

class Subtype extends React.Component {
  constructor (props) {
    super(props);

    this.status = 'iddle';

    this.state = { panel : null, items : null };
  }

  componentWillReceiveProps (props) {
    if ( props.show && this.status === 'iddle' ) {
      this.status = 'ready';
      this.get();
    }
  }

  get () {
    if ( typeof window !== 'undefined' ) {
      window.socket.emit('get items', { type : this.props.item.subtype._id, parent : this.props.item._id })
        .on('OK get items', (panel, items) => {
          if ( panel.type === this.props.item.subtype._id ) {
            this.setState({ panel, items });
          }
        })
    }
  }

  render () {
    let content = ( <Loading /> );

    if ( this.state.panel ) {
      let items = this.state.items.map(item => (
        <Item item={ item } { ...this.props } />
      ));

      content = [
        <Panel { ...this.state.panel } title={ this.props.item.subtype.name }>
          { items }
        </Panel>
      ];
    }

    return (
      <section className="subtype text-center">
        { content }
      </section>
    );
  }
}

export default Subtype;
