'use strict';

import React from 'react';

class ItemStore extends React.Component {

  state = { item : null };

  constructor (props) {
    super(props);

    this.state.item = this.props.item;
  }

  componentDidMount () {
    window.socket.on('item changed', this.itemChanged.bind(this));
    window.socket.on('OK create item', this.itemCreated.bind(this));
  }

  componentWillUnmount () {
    window.socket.off('item changed', this.itemChanged.bind(this));
    window.socket.off('OK create item', this.itemCreated.bind(this));
  }

  itemChanged (item) {
    if ( item._id === this.state.item._id ) {
      this.setState({ item });
    }
  }

  itemCreated (item) {
    if (   ( item.parent && item.parent._id && item.parent._id=== this.state.item._id)
    || ( item.parent === this.state.item._id )) {
      const stateItem = this.state.item;
      stateItem.children ++;
      this.setState({ item : stateItem });
    }
  }

  renderChildren () {
    return React.Children.map(this.props.children, child =>
      React.cloneElement(child, this.state)
    );
  }

  render () {
    return (
      <section>{ this.renderChildren() }</section>
    );
  }
}

export default ItemStore;
