'use strict';

import React from 'react';
import Panel from './panel';

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
        console.log(panel, items);
        this.setState({ type });
      })
  }

  render () {

    let { type } = this.state;

    let panelTitle;

    if ( type ) {
      panelTitle = type.name;
    }

    return (
      <Panel title={ panelTitle }>

      </Panel>
    );
  }
}

export default TopLevelPanel;
