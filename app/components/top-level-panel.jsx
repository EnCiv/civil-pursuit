'use strict';

import React from 'react';
import Panel from './panel';
import Item  from './item';

class TopLevelPanel extends React.Component {
  constructor (props) {
    super(props);

    this.state = {
      type : null,
      items : []
    };

    this.get();
  }

  get () {
    this.getType();
  }

  getType () {
    if ( typeof window !== 'undefined' ) {
      window.socket.emit('get top level type')
        .on('OK get top level type', type => this.getItems(type));
    }
  }

  getItems (type) {
    window.socket.emit('get items', { type })
      .on('OK get items', (panel, items) => {
        if ( panel.type._id === type._id ) {
          console.log(panel, items);
          this.setState({ type, items });
        }
      })
  }

  render () {

    let { type } = this.state;

    let panelTitle;

    if ( type ) {
      panelTitle = type.name;
    }

    let items = this.state.items.map(item => (
      <Item item={ item } />
    ));

    return (
      <Panel title={ panelTitle } type={ type } { ...this.props }>
        { items }
      </Panel>
    );
  }
}

export default TopLevelPanel;
