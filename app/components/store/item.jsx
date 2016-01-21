'use strict';

import React from 'react';

class ItemStore extends React.Component {

  state = { item : null }

  constructor (props) {
    super(props);

    this.state.item = this.props.item;
  }

  componentDidMount () {
    window.socket.on('item changed', this.itemChanged.bind(this));
  }

  componentWillUnmount () {
    window.socket.off('item changed', this.itemChanged.bind(this));
  }

  itemChanged (item) {
    if ( item._id === this.state.item._id ) {
      this.setState({ item });
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
