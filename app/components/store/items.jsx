'use strict';

import React            from 'react';
import makePanelId      from '../../lib/app/make-panel-id';
import publicConfig     from '../../../public.json';

class ItemsStore extends React.Component {

  id;

  state = { count : null };

  constructor(props){
    super(props);
    if(this.props.items){
        this.setState({items, count: items.length});
    }
  }


  //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

  componentDidMount() {
    this.okCreateItemBound=this.okCreateItem.bind(this);
    window.socket.on('OK create item', this.okCreateItemBound);

    if ( ! this.state.items ) {
      const panel = { type : this.props.type };

      if ( this.props.parent ) {
        panel.parent = this.props.parent; //._id;
      }

      panel.limit=this.props.limit || publicConfig['navigator batch size'];

      if(this.props.own){panel.own=this.props.own}

      this.id = makePanelId(panel);

      window.socket.emit('get items', panel, this.okGetItems.bind(this));
    } else {
            this.id = makePanelId({ type : this.props.type, parent: this.props.parent || null });
    }
  }

  //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

  componentWillUnmount() {
    window.socket.off('OK create item', this.okCreateItemBound);
  }

  //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

  okGetItems (panel, count) {
    if ( makePanelId(panel) === this.id ) {
      if(this.state.items) count+=this.state.items.length; // the count returned is the number of items that match the parent and type - excluding the items already in the panel passed
      this.setState({ items: panel.items, count });
    }
  }

  //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

  okCreateItem (item) {

    const parentId = this.props.parent ? this.props.parent._id || this.props.parent : undefined;
    const itemParentId= item.parent ? item.parent._id || item.parent : undefined;

    if ( item.type._id === this.props.type._id && itemParentId === parentId ) {
      let oldItems = this.state.items || [];
      var items= [item].concat(oldItems);
      this.setState({items, count: this.state.count +1} );
    }
  }

  loadMore(page){
		if(page){  // if page 0 don't do anything - this is loading on component mount
			console.info("ItemStore.loadmore",page);
      const panel = { type : this.props.type };

      if ( this.props.parent ) {
        panel.parent = this.props.parent; //._id;
      }

      panel.limit=this.props.limit || publicConfig['navigator batch size'];
      panel.items=this.state.items;
      if(this.props.own){panel.own=this.props.own}

      window.socket.emit('get items', panel, this.okGetItems.bind(this));
      //this.setState({limit})
		}
	}
  //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

  render () {
    //onsole.info("PanelStore.render, this.props, this.state")
    const {children, ...lessProps}=this.props;
    return (  
      <section>
        {   React.Children.map(React.Children.only(children), child => {
                var newProps = Object.assign({}, lessProps, this.state, {PanelLoadMore: this.loadMore.bind(this)});
                Object.keys(child.props).forEach(prop => delete newProps[prop]);
                return React.cloneElement(child, newProps, child.props.children)
            })
        }
      </section>
    );
  }
}

export default ItemsStore;
