'use strict';

import React            from 'react';
import { EventEmitter } from 'events';
import makePanelId      from '../../lib/app/make-panel-id';

class PanelStore extends React.Component {

  id;

  state = { panel : null, count : null, items : null, new : false };

  emitter = new EventEmitter();

  //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

  componentDidMount() {
    window.socket.on('OK create item', this.okCreateItem.bind(this));

    this.emitter.on('edit', this.edit.bind(this));

    if ( ! this.state.panel && this.props['auto-mount'] !== false ) {
      const panel = { type : this.props.type };

      if ( this.props.parent ) {
        panel.parent = this.props.parent._id;
      }

      this.id = makePanelId(panel);

      window.socket.emit('get items', panel, this.okGetItems.bind(this));
    }
  }

  //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

  componentWillUnmount() {
    window.socket.off('OK create item', this.okCreateItem.bind(this));

    this.emitter.removeListener('edit', this.edit.bind(this));
  }

  //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

  edit (item) {
    const loaded = this.state.items.some(
      panelItem => panelItem._id === item._id
    );

    if ( loaded ) {
      this.emitter.emit('show', item._id, 'editItem');
    }
  }

  //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

  okGetItems (panel, count, items) {
    console.info('OK get items', panel, count, items);
    if ( makePanelId(panel) === this.id ) {
      this.setState({ panel, count, items });
    }
  }

  //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

  okCreateItem (item) {
    console.info('new item', {
      new : item,
      props : this.props
    });

    const parent = this.props.parent ? this.props.parent._id : undefined;

    if ( item.type._id === this.props.type._id && item.parent === parent ) {

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
      React.cloneElement(child, Object.assign({}, this.state, { emitter : this.emitter }))
    );
  }

  //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

  render () {
    return (
      <section>
        { this.renderChildren() }
        console.info("panel render", this.props);
      </section>
    );
  }
}

export default PanelStore;
