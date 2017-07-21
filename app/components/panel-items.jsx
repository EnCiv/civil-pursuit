'use strict';

import React from 'react';
import Accordion from './util/accordion';
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
    var raspProps = { rasp: props.rasp }; // do this to reduce name conflict and sometimes a loop
    super(raspProps, 'shortId', 1);  // shortId is the key for indexing to child RASP functions, debug is on
    if (props.type && props.type.name && props.type.name !== this.title) { this.title = props.type.name; this.props.rasp.toParent({ type: "SET_TITLE", title: this.title }); } // this is for pretty debugging
  }

  //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

  loadMore(e) {
    e.preventDefault();

    // window.Dispatcher.emit('get items', this.props.panel);
  }

  actionToState(action, rasp, source, defaultRASP) {
    var nextRASP = {}, delta = {};
    console.info("PanelItems.actionToState", ...arguments);
    if (action.type === "CHILD_SHAPE_CHANGED") {
      let ash = action.shape, ush = rasp.shape;
      if (!action.shortId) logger.error("PanelItems.actionToState action without shortId", action)
      var ooview = false;
      if (this.props.type && this.props.type.visualMethod && this.props.type.visualMethod === "ooview") ooview = true;

      if (action.distance === 1) { //if this action is from an immediate child 
        if (action.shape === 'open' && action.shortId) {
          delta.shortId = action.shortId;
          delta.pathSegment = action.shortId;
          delta.shape='open';
        } else {
          delta.pathSegment = null;
          delta.shortId = null; // turn off the shortId
          delta.shape = defaultRASP.shape;
        } 
        Object.assign(nextRASP, rasp, delta);
      } else { // it's not my child that changed shape
        logger.trace("PanelItems.actionToState it's not my child that changed shape")
        if (ooview && ash === 'open') {
          Object.assign(nextRASP, rasp, { shape: 'collapsed', shortId: action.shortId });
        } else if (ooview && ash === 'truncated') {
          Object.assign(nextRASP, rasp, { shape: 'truncated', shortId: null });
        } else Object.assign(nextRASP, rasp); // no change to shape
      }
    } else if (action.type === "TOGGLE_CREATOR") {
      if (rasp.creator) {// it's on so toggle it off
        Object.assign(nextRASP, rasp, { creator: false })
      } else { // it's off so toggle it on
        delta.creator = true;
        if (rasp.shape !== 'truncated') { //if shape was not truncated 
          if (rasp.shortId) {//there is an item that's open
            this.toChild[rasp.shortId]({ type: "CHANGE_SHAPE", shape: 'truncated' });
            delta.shape = 'truncated';
            delta.shortId = null;
            delta.pathSegment = 'Creator';
          } else {
            Object.assign(nextRASP, nextRASP, { shape: 'truncated' });
            delta.shape = 'truncated';
            delta.pathSegment = null;
          }
        }
        Object.assign(nextRASP, rasp, delta); // if shape is not truncated, do so
      }
    } else if (action.type === "ITEM_DELVE") {
      Object.assign(nextRASP, rasp); // no state change
      if(rasp.shortId) {
        var nextFunc = () => this.toChild[rasp.shortId](action);
        if (this.toChild[rasp.shortId]) nextFunc(); // update child before propogating up
        else this.waitingOn = { nextRASP: nextRASP, nextFunc: nextFunc };
      }
    } else if (action.type === "SHOW_ITEM") {
      if (!this.props.items.some(item => item._id === action.item._id)) { // if the new item is not in the list
        this.props.items.push(action.item);
      }
      delta.shortId = action.item.id;
      delta.shape = 'open';
      delta.pathSegment = delta.shortId;
      Object.assign(nextRASP, rasp, delta);
    } else return null; // don't know this action, null so the default methods can have a shot at it
    logger.trace("PanelItems.actionToState return", { nextRASP })
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
  }

  mounted = [];  // we render items and store them in this array.  No need to rerender them every time
  //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

  render() {

    const { limit, skip, type, parent, items, count, user, emitter, rasp } = this.props;

    let title = 'Loading items', name, content, loadMore;

    let bgc = 'white';

      var buttons=type.buttons || ['Promote', 'Details', 'Harmony', 'Subtype'];
      console.info("PanelItems.render buttons:", buttons);



      content = items.map(item => {
          let shape = rasp.shape === 'open' && rasp.shortId === item.id ? 'open' : rasp.shape !== 'open' ? rasp.shape :  'truncated';
          //if(items.length===1 && rasp && rasp.shape==='truncated') shape='open';  // if there is only one item and in the list and the panel is 'truncated' then render it open
          var itemRASP = { shape: shape, depth: this.props.rasp.depth, toParent: this.toMeFromChild.bind(this, item.id) };  // inserting me between my parent and my child
          if (!this.mounted[item.id]) { // only render this once
            this.mounted[item.id] = (<ItemStore item={item} key={`item-${item._id}`}>
              <Item
                item={item}
                user={user}
                rasp={itemRASP}
                emitter={emitter}
                hideFeedback={this.props.hideFeedback}
                buttons={buttons}
                style={{ backgroundColor: bgc }}
              />
            </ItemStore>
            );
          }
          return (
            <Accordion active={(rasp.shape === 'open' && rasp.shortId === item.id) || rasp.shape !== 'open'} name='item' key={item._id +'-panel-item'}>
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



