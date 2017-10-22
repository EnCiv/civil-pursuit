'use strict';

import React from 'react';
import Accordion          from 'react-proactive-accordion';
import Icon from './util/icon';
import ItemStore from '../components/store/item';
import EditAndGoAgain from './edit-and-go-again';
import config from '../../public.json';
import {ReactActionStatePath, ReactActionStatePathClient } from 'react-action-state-path';
import Item from './item';
import PanelHead from './panel-head';

class PanelItems extends React.Component {
  render() {
    logger.trace("PanelItems render");
    return (
      <ReactActionStatePath {...this.props} >
        <PanelHead  cssName={'syn-panel-item'} >
          <RASPPanelItems />
        </PanelHead>
      </ReactActionStatePath>
    );
  }
}

class RASPPanelItems extends ReactActionStatePathClient {

  constructor(props) {
    //var raspProps = { rasp: props.rasp }; // do this to reduce name conflict and sometimes a loop
    super(props, 'shortId', 1);  // shortId is the key for indexing to child RASP functions, debug is on
    if (props.type && props.type.name && props.type.name !== this.title) { this.title = props.type.name; this.props.rasp.toParent({ type: "SET_TITLE", title: this.title }); } // this is for pretty debugging
  }

  //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

  loadMore(e) {
    e.preventDefault();

    // window.Dispatcher.emit('get items', this.props.panel);
  }

  actionToState(action, rasp, source, defaultRASP) {
    var nextRASP = {}, delta = {};
    console.info("PanelItems.actionToState", this.childName, this.childTitle, ...arguments);
    if (action.type === "CHILD_SHAPE_CHANGED") {
      if (!action.shortId) logger.error("PanelItems.actionToState action without shortId", action)
      if (action.distance === 1) { //if this action is from an immediate child 
        if (action.shape === 'open' && action.shortId) {
          delta.shortId = action.shortId;
        } else if(action.shape==='truncated'){
            delta.shortId = null; // turn off the shortId
        } else if(action.shape==='title')
          delta.shape='title';
        // else don't change shortId 
      }else if(action.distance >= 2){
        if(rasp.shortId && action.shape==='title') delta.shape='title';
        // if distant child is open or truncated, don't change
      } // if distance negative or 0 skip it
    } else if (action.type === "TOGGLE_CREATOR") {
      if (rasp.creator) {// it's on so toggle it off
        delta.creator=false;
      } else { // it's off so toggle it on
        delta.creator = true;
        if (rasp.shortId) {//there is an item that's open
          this.toChild[rasp.shortId]({ type: "RESET_SHAPE"});
          delta.shortId = null;
        }
      }
    } else if (action.type === "ITEM_DELVE") {
      if(rasp.shortId) {
        var nextFunc = () => this.toChild[rasp.shortId](action);
        if (this.toChild[rasp.shortId]) nextFunc(); // update child before propogating up
        else this.waitingOn = { nextRASP: Object.assign({},rasp), nextFunc: nextFunc };
      }
    } else if (action.type === "SHOW_ITEM") {
      if (!this.props.items.some(item => item._id === action.item._id)) { // if the new item is not in the list
        this.props.items.push(action.item);
      }
      delta.shortId = action.item.id;
    } else 
      return null; // don't know this action, null so the default methods can have a shot at it

    if(!delta.shape) delta.shape=delta.shortId ? 'open' : defaultRASP.shape;
    Object.assign(nextRASP, rasp, delta);
    if(nextRASP.shortId) nextRASP.pathSegment=nextRASP.shortId;
    else nextRASP.pathSegment=null;
    return nextRASP;
  }

  // set the state from the pathSegment. 
  // the shortId is the path segment
  segmentToState(action) {
    var nextRASP={shape: 'truncated', pathSegment: action.segment};
    var shortId = action.segment;
    if(!shortId) console.error("PanelItems.segmentToState no shortId found");
    else {
      nextRASP.shape='open'; nextRASP.shortId=shortId 
    }
    return { nextRASP, setBeforeWait: true }
  }

  // this is just for debugging, to make the trace output easier to follow - associate the panel name to the output
  componentWillReceiveProps(newProps) {
    if (newProps.type && newProps.type.name && newProps.type.name !== this.title) { this.title = newProps.type.name; this.props.rasp.toParent({ type: "SET_TITLE", title: this.title }); } // this is for pretty debugging
    let oldLength = this.props.items && this.props.items.length || 0;
    if(newProps.items && (newProps.items.length > oldLength)){  // if the length changes, history needs to be updated
      console.info("PanelItems.componentWillReceiveProps length change", oldLength, "->", newProps.items.length)
      setTimeout(()=>{
        this.props.rasp.toParent({type: "CHILD_STATE_CHANGED", length: newProps.items.length})
      },0)
    }
  }

  mounted = [];  // we render items and store them in this array.  No need to rerender them every time
  //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

  render() {

    const { limit, skip, type, parent, items, count, user, rasp } = this.props;

    let title = 'Loading items', name, content, loadMore;

    let bgc = 'white';

      var buttons=type.buttons || ['Promote', 'Details', 'Harmony', 'Subtype'];
      console.info("PanelItems.render buttons:", buttons);

      content = items.map(item => {
        let shape;
        if(rasp.shortId){ // one child should be shown
          if(rasp.shortId===item.id) // this is the one to show
            shape=rasp.shape; // could be open or title but child will follow the parent there
          else 
            shape='truncated'; // all other children should be truncated be default
        }else
          shape='truncated'; // show all children as truncated

          //let shape = rasp.shape === 'open' && (rasp.shortId === item.id) ? 'open' : rasp.shape !== 'open' ? rasp.shape :  'truncated';
          //if(items.length===1 && rasp && rasp.shape==='truncated') shape='open';  // if there is only one item and in the list and the panel is 'truncated' then render it open
          var itemRASP = { shape: shape, depth: this.props.rasp.depth, toParent: this.toMeFromChild.bind(this, item.id) };  // inserting me between my parent and my child
          if (!this.mounted[item.id]) { // only render this once
            this.mounted[item.id] = (<ItemStore item={item} key={`item-${item._id}`}>
              <Item
                item={item}
                user={user}
                rasp={itemRASP}
                hideFeedback={this.props.hideFeedback}
                buttons={buttons}
                style={{ backgroundColor: bgc }}
              />
            </ItemStore>
            );
          }
          return (
            <Accordion active={((rasp.shape === 'open' || rasp.shape==='title') && (rasp.shortId === item.id)) || rasp.shape !== 'open'} name='item' key={item._id +'-panel-item'}>
              {this.mounted[item.id]}
            </Accordion>
          );
        });

        const end = skip + limit;

        //       if ( count > limit ) {
        //         loadMore = (
        //           <h5 className="gutter text-center">
        //             <a href="#" onClick={ this.loadMore.bind(this) }>Show more</a>
        //           </h5>
        //         );
        //       }

    return (
      <section>
        {content}
        {loadMore}
      </section>
    );
  }
}

export default PanelItems;
export { PanelItems };



