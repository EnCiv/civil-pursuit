'use strict';

import React from 'react';

class ItemStore extends React.Component {

  state = { item : null };

  constructor (props) {
    super(props);
    if(typeof ItemStore.index === 'undefined') {
      ItemStore.index={};
      if(typeof window !== 'undefined') 
        window.ItemStore={index: ItemStore.index}
    }
    if(this.props.item && this.props.item._id)
      ItemStore.index[this.props.item._id]=this.props.item;
    this.state.item = this.props.item;
  }

  static findOne(query){
    let queryKeys=Object.keys(query);
    let queryValue={};
    let result=null;
    queryKeys.forEach(key=>{
      if(typeof query[key]==='object') queryValue[key]=query[key]._id;
      else queryValue[key]=query[key];
    });
    Object.keys(ItemStore.index).some(_id=>{
      let item=ItemStore.index[_id];
      if(queryKeys.every(key=>{
        let keyValue;
        if(typeof item[key]==='undefined') return (typeof queryValue[key] === 'undefined') ? true : false ;
        if(typeof item[key]==='object') keyValue=item[key]._id;
        else keyValue=item[key];
        if(typeof keyValue === 'undefined') return false;
        return keyValue === queryValue[key];
      })) { 
        result= item; 
        return true
      } else 
        return false;
    }) 
    return result;
  }

  componentDidMount () {
    this.itemChangedBound=this.itemChanged.bind(this);
    this.itemCreatedBound=this.itemCreated.bind(this);
    window.socket.on('item changed', this.itemChangedBound);
    window.socket.on('OK create item', this.itemCreatedBound);
  }

  componentWillUnmount () {
    window.socket.off('item changed', this.itemChangedBound);
    window.socket.off('OK create item', this.itemCreatedBound);
  }

  itemChanged (item) {
    ItemStore.index[item._id]=item;
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
    if (item && item._id) 
      ItemStore.index[item._id]=item;
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
