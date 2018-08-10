'use strict';

import React            from 'react';
import makePanelId      from '../../lib/app/make-panel-id';
import publicConfig     from '../../../public.json';
import { QSortToggle } from '../type-components/qsort-items';

class RandomItemStore extends React.Component {

  id;

  constructor(props){
    super(props);
    const parent=this.props.parent || null;
    const type=this.props.type;
    const limit=this.props.shared.limit || this.props.limit || publicConfig.limit;
    this.state={parent, type, limit, items: [], index: {}, sections: {unsorted: []}};
    this.id=makePanelId(this.state);
    window.socket.emit('get random items', this.state, this.props.sampleSize || 8, this.okGetRandomItemsAndInit.bind(this));
  }

  okGetRandomItemsAndInit(panel){
    if ( makePanelId(panel) === this.id ) {
      // add the initial items to the list of random items, at the end
      this.props.items && this.props.items.forEach(itm=>{
        let next=panel.items.length;
        panel.items[next]=itm; // push this on the end
        panel.index[itm._id]=next;
        panel.sections.unsorted.push(itm._id);
      });
      this.setState({ ...panel });
    }
  }

  //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
  randomItemStoreRefresh(){
    var panel = Object.assign({},this.state);
    window.socket.emit('get random items', panel, this.props.sampleSize || 8, this.okGetRandomItems.bind(this));
  }

  //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
  okGetRandomItems (panel) {
    if ( makePanelId(panel) === this.id ) {
      this.setState({ ...panel });
    }
  }
  //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
  toggle(itemId, criteria) {
    //find the section that the itemId is in, take it out, and put it in the new section
    this.setState({ 'sections': QSortToggle(this.state.sections, itemId, criteria) });
  }

  //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
  render () {
    //onsole.info("RandomItemStore.render", this.props, this.state)
    const {children, ...childProps}=this.props;
    Object.assign(childProps, this.state, {randomItemStoreRefresh: this.randomItemStoreRefresh.bind(this), toggle: this.toggle.bind(this)})

    return (  
      <section>
        {React.Children.map(React.Children.only(children), child=>React.cloneElement(child, childProps, child.props.children))}
      </section>
    );
  }
}

export default RandomItemStore;
