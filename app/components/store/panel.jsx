'use strict';

import React from 'react';
import makePanelId from 'syn/../../dist/lib/app/make-panel-id';

class PanelStore extends React.Component {

  id

  state = { panel : null, count : null, items : null, new : false }

  //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

  componentDidMount() {
    window.socket.on('OK create item', this.okCreateItem.bind(this));

    if ( ! this.state.panel ) {
      const panel = { type : this.props.type };

      if ( this.props.parent ) {
        panel.parent = this.props.parents;
      }

      this.id = makePanelId(panel);

      window.socket.emit('get items', panel, this.okGetItems.bind(this));
    }
  }

  //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

  componentWillUnmount() {
    window.socket.off('OK create item', this.okCreateItem.bind(this));
  }

  //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

  okGetItems (panel, count, items) {
    console.log('get items', panel, count, items);
    if ( makePanelId(panel) === this.id ) {
      this.setState({ panel, count, items });
    }
  }

  //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

  okCreateItem (item) {
    console.log('ok item', item);

    if ( item.type._id === this.props.type._id && item.parent === this.props.parent ) {
      let { items } = this.state;

      if ( ! items ) {
        items = [];
      }

      items = [item].concat(items);

      console.log(items.map(item => item.subject));

      this.setState({ items, new : item });
    }
  }

  //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

  renderChildren () {
    return React.Children.map(this.props.children, child =>
      React.cloneElement(child, this.state)
    );
  }

  //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

  render () {
    return (
      <section>
        { this.renderChildren() }
      </section>
    );
  }
}

export default PanelStore;
