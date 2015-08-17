'use strict';

import React from 'react';
import Panel from './panel';
import Item  from './item';
import Loading from './util/loading';

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
    // if ( typeof window !== 'undefined' ) {
    //   window.socket.emit('get top level type')
    //     .on('OK get top level type', type => this.getItems(type));
    // }
  }

  getItems (type) {
    // window.socket.emit('get items', { type })
    //   .on('OK get items', (panel, items) => {
    //     let relevant = false;
    //     if ( panel.type._id === type._id ) {
    //
    //       relevant = true;
    //
    //       if ( panel.parent ) {
    //         relevant = panel.parent === panel.parent;
    //       }
    //
    //       if ( relevant ) {
    //         this.setState({ type, items });
    //       }
    //     }
    //   })
  }

  render () {

    // let { type } = this.state;
    //
    // let panelTitle;
    //
    // if ( type ) {
    //   panelTitle = type.name;
    // }
    //
    // panelTitle = this.props.topLevelType.name;
    //
    // let items = this.state.items.map(item => (
    //   <Item key={ item._id } item={ item } { ...this.props } />
    // ));

    let items = ( <Loading /> );

    let title = 'Loading items';

    let type = null;

    if ( this.props.topLevelType ) {
      type = this.props.topLevelType;
      title = type.name;
    }

    return (
      <Panel title={ title } type={ type } { ...this.props }>
        { items }
      </Panel>
    );
  }
}

export default TopLevelPanel;
