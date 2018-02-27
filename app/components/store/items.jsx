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

      if(this.props.limit){panel.limit=this.props.limit}

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

  //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

  render () {
    //onsole.info("PanelStore.render, this.props, this.state")
    const {children, ...lessProps}=this.props;
    return (  
      <section>
        {   React.Children.map(React.Children.only(children), child => {
                var newProps = Object.assign({}, lessProps, this.state);
                Object.keys(child.props).forEach(prop => delete newProps[prop]);
                return React.cloneElement(child, newProps, child.props.children)
            })
        }
      </section>
    );
  }
}

export default ItemsStore;
