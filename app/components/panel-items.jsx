'use strict';

import React from 'react';
import Panel from './panel';
import panelType from '../lib/proptypes/panel';
import Accordion from './util/accordion';
import Icon from './util/icon';
import Creator from './creator';
import ItemStore from '../components/store/item';
import EditAndGoAgain from './edit-and-go-again';
import config from '../../public.json';
import {ReactActionStatePath, ReactActionStatePathClient } from 'react-action-state-path';
import Item from './item';

class PanelItems extends React.Component {
  render() {
    logger.trace("PanelItems render");
    return (
      <ReactActionStatePath {... this.props}>
        <RASPPanelItems />
      </ReactActionStatePath>
    );
  }
}

class RASPPanelItems extends ReactActionStatePathClient {

  static propTypes = {
    panel: panelType
  };

  constructor(props) {
    var raspProps = { rasp: props.rasp }; // do this to reduce name conflict and sometimes a loop
    super(raspProps, 'shortId');  // shortId is the key for indexing to child RASP functions
    if (props.panel && props.panel.type && props.panel.type.name && props.panel.type.name !== this.title) { this.title = props.panel.type.name; this.props.rasp.toParent({ type: "SET_TITLE", title: this.title }); } // this is for pretty debugging
  }

  //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

  loadMore(e) {
    e.preventDefault();

    // window.Dispatcher.emit('get items', this.props.panel);
  }

  toggleCreator() {
    if (this.props.rasp && this.props.rasp.toParent) this.props.rasp.toParent({ type: "TOGGLE_CREATOR" });
  }

  actionToState(action, rasp) {
    var nextRASP = {}, delta = {};
    if (action.type === "CHILD_SHAPE_CHANGED") {
      let ash = action.shape, ush = rasp.shape;
      if (!action.shortId) logger.error("PanelItems.actionToState action without shortId", action)
      var ooview = false;
      if (this.props.panel && this.props.panel.type && this.props.panel.type.visualMethod && this.props.panel.type.visualMethod === "ooview") ooview = true;

      if (action.distance === 1) { //if this action is from an immediate child 
        if (action.shape === 'open' && action.shortId) {
          delta.shortId = action.shortId;
        } else {
          delta.shortId = null; // turn off the shortId
        } delta.shape = action.shape;
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
          } else {
            Object.assign(nextRASP, nextRASP, { shape: 'truncated' });
            delta.shape = 'truncated';
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
      if (!this.props.panel.items.some(item => item._id === action.item._id)) { // if the new item is not in the list
        this.props.panel.items.push(action.item);
      }
      delta.shortId = action.item.id;
      delta.shape = 'open';
      Object.assign(nextRASP, rasp, delta);
    } else return null; // don't know this action, null so the default methods can have a shot at it
    logger.trace("PanelItems.actionToState return", { nextRASP });
    var parts=[];
    const shapeToC={truncated: 't', open: 'o', title: 'l', collapsed: 'c'};
    if(nextRASP.shortId) {
      parts.push(nextRASP.shortId);
      parts.push(shapeToC[nextRASP.shape]);
    }
    if(nextRASP.creator) parts.push('cr');
    nextRASP.pathSegment=parts.join(',');
    return nextRASP;
  }

  // set the state from the pathSegment. 
  // the shortId is the path segment
  segmentToState(action) {
    const cToShape={t: 'truncated', o: 'open', l: 'title', c: 'collapsed' };
    var nextRASP={shape: 'truncated', pathSegment: action.segment};
    var parts=action.segment.split(',');
    let count=parts.length;
    parts.forEach(part=>{
      if(part.length>2) {nextRASP.shortId=part; count--}
      else if(part.length===2) {nextRASP.creator=true; count--}
      else if(cToShape[part]) {nextRASP.shape=cToShape[part]; count--}
    })
    if(count) console.error("RASPPanelItems.segmentToState parts left over", count, parts );
    return { nextRASP, setBeforeWait: true }
  }

  // this is just for debugging, to make the trace output easier to follow - associate the panel name to the output
  componentWillReceiveProps(newProps) {
    if (newProps.panel && newProps.panel.type && newProps.panel.type.name && newProps.panel.type.name !== this.title) { this.title = newProps.panel.type.name; this.props.rasp.toParent({ type: "SET_TITLE", title: this.title }); } // this is for pretty debugging
  }

  mounted = [];  // we render items and store them in this array.  No need to rerender them every time
  //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

  render() {

    const { panel, count, user, emitter, rasp } = this.props;

    let title = 'Loading items', name, loaded = false, content, loadMore,
      type, parent, creator;

    let bgc = 'white';

    if (panel) {
      loaded = true;

      type = panel.type;
      parent = panel.parent;

      title = type.name;

      var buttons=type.buttons || ['Promote', 'Details', 'Harmony', 'Subtype'];
      console.info("PanelItems.render buttons:", buttons);

      if (!panel.items.length && !(panel.type && panel.type.createMethod === 'hidden')) {
        content = (
          <div className={`syn-panel-gutter text-center vs-${rasp.shape}`}>
            <a href="#" onClick={this.toggleCreator.bind(this)} className="click-to-create">
              Click the + to be the first to add something here
            </a>
          </div>
        );
      }

      else {
        content = panel.items
          .map(item => {
            let shape = rasp.shape === 'open' && rasp.shortId === item.id ? 'open' : rasp.shape !== 'open' ? rasp.shape :  'truncated';
            //if(panel.items.length===1 && rasp && rasp.shape==='truncated') shape='open';  // if there is only one item and in the list and the panel is 'truncated' then render it open
            var itemRASP = { shape: shape, depth: this.props.rasp.depth, toParent: this.toMeFromChild.bind(this, item.id) };  // inserting me between my parent and my child
            if (!this.mounted[item.id]) { // only render this once
              this.mounted[item.id] = (<ItemStore item={item} key={`item-${item._id}`}>
                <Item
                  item={item}
                  user={user}
                  panel={panel}
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

        const { skip, limit } = panel;

        const end = skip + limit;

        //       if ( count > limit ) {
        //         loadMore = (
        //           <h5 className="gutter text-center">
        //             <a href="#" onClick={ this.loadMore.bind(this) }>Show more</a>
        //           </h5>
        //         );
        //       }
      }


      creator = (
        <Accordion
          active={(rasp && rasp.creator)}
          style={{ backgroundColor: bgc }}
        >
          <Creator
            type={type}
            parent={parent}
            toggle={this.toggleCreator.bind(this)}
          />
        </Accordion>
      );
    }

    return (
      <Panel
        rasp={rasp}
        heading={[
          (<h4>{title}</h4>), (type && type.createMethod == "hidden" && !(user && user.id && parent && parent.user && parent.user._id && (user.id == parent.user._id))) ? (null) :
            (
              <Icon
                icon="plus"
                className="toggle-creator"
                onClick={this.toggleCreator.bind(this)}
              />
            )
        ]}
      >
        {creator}
        {content}
        {loadMore}
      </Panel>
    );
  }
}

export default PanelItems;
export { PanelItems };



