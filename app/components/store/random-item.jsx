'use strict';

import React            from 'react';
import makePanelId      from '../../lib/app/make-panel-id';
import publicConfig     from '../../../public.json';

class RandomItemStore extends React.Component {

  id;

  state = { panel : null };

  constructor(props){
    super(props);
    if(this.props.items){
      this.state.panel={};
      this.state.panel.type=this.props.type;
      this.state.panel.parent=this.props.parent || null;
      this.state.panel.items=this.props.items.slice(0);
      this.state.panel.limit= this.props.limit || publicConfig['navigator batch size'];
    }
  }


  //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

  componentDidMount() {
    if ( ! this.state.panel ) {
      const panel = { type : this.props.type };

      if ( this.props.parent ) {
        panel.parent = this.props.parent; //._id;
      }

      if(this.props.limit){panel.limit=this.props.limit}

      if(this.props.own){panel.own=this.props.own}

      this.id = makePanelId(panel);

      window.socket.emit('get random items', panel, this.props.sampleSize || 8, this.okGetRandomItems.bind(this));
    } else {
            this.id = makePanelId({ type : this.props.type, parent: this.props.parent || null });
    }
  }

  //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

  randomItemStoreRefresh(){
    var panel = Object.assign({},this.state.panel);
    panel.items=[];
    window.socket.emit('get random items', panel, this.props.sampleSize || 8, this.okGetRandomItems.bind(this));
  }

  //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

  okGetRandomItems (panel) {
    if ( makePanelId(panel) === this.id ) {
      this.setState({ panel });
    }
  }

  //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

  renderChildren () {
    return React.Children.map(this.props.children, child =>{
      return React.cloneElement(child, Object.assign({}, this.state, {randomItemStoreRefresh: this.randomItemStoreRefresh.bind(this)}), child.props.children );
    });
  }

  //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

  render () {
    //onsole.info("RandomItemStore.render", this.props, this.state)
    const panelout = this.renderChildren();

    return (  
      <section>
        { panelout }
      </section>
    );
  }
}

export default RandomItemStore;
