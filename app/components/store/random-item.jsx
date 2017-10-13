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

  okGetRandomItems (panel) {
    if ( makePanelId(panel) === this.id ) {
      this.setState({ panel });
    }
  }

  //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

  renderChildren () {
    console.info("RandomItemStore.renderChildren",this.props);
    return React.Children.map(this.props.children, child =>{
      console.info("RandomItemStore.renderChildren.map",child.props.children);
      return React.cloneElement(child, Object.assign({}, this.state), child.props.children );
    });
  }

  //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

  render () {
    console.info("RandomItemStore.render", this.props, this.state)
    const panelout = this.renderChildren();

    console.info("RandomItemStore children rendered");
    
    return (  
      <section>
        { panelout }
      </section>
    );
  }
}

export default RandomItemStore;
