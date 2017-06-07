'use strict';

import React from 'react';
import Panel from './panel';
import Loading from './util/loading';
import Link from './util/link';
import panelType from '../lib/proptypes/panel';
import makePanelId from '../lib/app/make-panel-id';
import Join from './join';
import Accordion from './util/accordion';
import Promote from './promote';
import EvaluationStore from './store/evaluation';
import ItemButtons from './item-buttons';
import Icon from './util/icon';
import Creator from './creator';
import ItemStore from '../components/store/item';
import Details from './details';
import DetailsStore from './store/details';
import EditAndGoAgain from './edit-and-go-again';
import Harmony from './harmony';
import TypeComponent from './type-component';
import config from '../../public.json';
import { UserInterfaceManagerClient } from './user-interface-manager';
import Item from './item';

class PanelItems extends UserInterfaceManagerClient {

  static propTypes = {
    panel: panelType
  };

  constructor(props) {
    var uimProps = { uim: props.uim }; // do this to reduce name conflict and sometimes a loop
    super(uimProps, 'shortId');  // shortId is the key for indexing to child UIM functions
    if (props.panel && props.panel.type && props.panel.type.name && props.panel.type.name !== this.title) { this.title = props.panel.type.name; this.props.uim.toParent({ type: "SET_TITLE", title: this.title }); } // this is for pretty debugging
  }

  //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

  loadMore(e) {
    e.preventDefault();

    // window.Dispatcher.emit('get items', this.props.panel);
  }

  toggleCreator() {
    if (this.props.uim && this.props.uim.toParent) this.props.uim.toParent({ type: "TOGGLE_CREATOR" });
  }

  actionToState(action, uim) {
    var nextUIM = {}, delta = {};
    if (action.type === "CHILD_SHAPE_CHANGED") {
      let ash = action.shape, ush = uim.shape;
      if (!action.shortId) logger.error("PanelItems.actionToState action without shortId", action)
      var ooview = false;
      if (this.props.panel && this.props.panel.type && this.props.panel.type.visualMethod && this.props.panel.type.visualMethod === "ooview") ooview = true;

      if (action.distance === 1) { //if this action is from an immediate child 
        if (action.shape === 'open' && action.shortId) {
          delta.shortId = action.shortId;
          delta.pathSegment = action.shortId;
        } else {
          delta.pathSegment = null;
          delta.shortId = null; // turn off the shortId
        } delta.shape = action.shape;
        Object.assign(nextUIM, uim, delta);
      } else { // it's not my child that changed shape
        logger.trace("PanelItems.actionToState it's not my child that changed shape")
        if (ooview && ash === 'open') {
          Object.assign(nextUIM, uim, { shape: 'collapsed', shortId: action.shortId });
        } else if (ooview && ash === 'truncated') {
          Object.assign(nextUIM, uim, { shape: 'truncated', shortId: null });
        } else Object.assign(nextUIM, uim); // no change to shape
      }
    } else if (action.type === "TOGGLE_CREATOR") {
      if (uim.creator) {// it's on so toggle it off
        Object.assign(nextUIM, uim, { creator: false })
      } else { // it's off so toggle it on
        delta.creator = true;
        if (uim.shape !== 'truncated') { //if shape was not truncated 
          if (uim.shortId) {//there is an item that's open
            this.toChild[uim.shortId]({ type: "CHANGE_SHAPE", shape: 'truncated' });
            delta.shape = 'truncated';
            delta.shortId = null;
            delta.pathSegment = 'Creator';
          } else {
            Object.assign(nextUIM, nextUIM, { shape: 'truncated' });
            delta.shape = 'truncated';
            delta.pathSegment = null;
          }
        }
        Object.assign(nextUIM, uim, delta); // if shape is not truncated, do so
      }
    } else if (action.type === "ITEM_DELVE") {
      Object.assign(nextUIM, uim); // no state change
      if(uim.shortId) {
        var nextFunc = () => this.toChild[uim.shortId](action);
        if (this.toChild[uim.shortId]) nextFunc(); // update child before propogating up
        else this.waitingOn = { nextUIM: nextUIM, nextFunc: nextFunc };
      }
    } else if (action.type === "SHOW_ITEM") {
      if (!this.props.panel.items.some(item => item._id === action.item._id)) { // if the new item is not in the list
        this.props.panel.items.push(action.item);
      }
      delta.shortId = action.item.id;
      delta.shape = 'open';
      delta.pathSegment = delta.shortId;
      Object.assign(nextUIM, uim, delta);
    } else return null; // don't know this action, null so the default methods can have a shot at it
    logger.trace("PanelItems.actionToState return", { nextUIM })
    return nextUIM;
  }

  // set the state from the pathSegment. 
  // the shortId is the path segment
  setPath(action) {
    var nextUIM={shape: 'truncated', pathSegment: action.segment};
    var shortId = action.segment;
    if(!shortId) console.error("PanelItems.setPath no shortId found");
    else {
      nextUIM.shape='open'; nextUIM.shortId=shortId 
    }
    return { nextUIM, setBeforeWait: true }
  }

  // this is just for debugging, to make the trace output easier to follow - associate the panel name to the output
  componentWillReceiveProps(newProps) {
    if (newProps.panel && newProps.panel.type && newProps.panel.type.name && newProps.panel.type.name !== this.title) { this.title = newProps.panel.type.name; this.props.uim.toParent({ type: "SET_TITLE", title: this.title }); } // this is for pretty debugging
  }

  mounted = [];  // we render items and store them in this array.  No need to rerender them every time
  //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

  render() {

    const { panel, count, user, emitter, uim } = this.props;

    let title = 'Loading items', name, loaded = false, content, loadMore,
      type, parent, creator;

    let bgc = 'white';

    if (panel) {
      loaded = true;

      type = panel.type;
      parent = panel.parent;

      title = type.name;

      if (!panel.items.length && !(panel.type && panel.type.createMethod === 'hidden')) {
        content = (
          <div className={`syn-panel-gutter text-center vs-${uim.shape}`}>
            <a href="#" onClick={this.toggleCreator.bind(this)} className="click-to-create">
              Click the + to be the first to add something here
            </a>
          </div>
        );
      }

      else {
        content = panel.items
          .map(item => {
            let shape = uim.shape === 'open' && uim.shortId === item.id ? 'open' : 'truncated';
            //if(panel.items.length===1 && uim && uim.shape==='truncated') shape='open';  // if there is only one item and in the list and the panel is 'truncated' then render it open
            var itemUIM = { shape: shape, depth: this.props.uim.depth, toParent: this.toMeFromChild.bind(this, item.id) };  // inserting me between my parent and my child
            if (!this.mounted[item.id]) { // only render this once
              this.mounted[item.id] = (<ItemStore item={item} key={`item-${item._id}`}>
                <Item
                  item={item}
                  user={user}
                  panel={panel}
                  uim={itemUIM}
                  emitter={emitter}
                  hideFeedback={this.props.hideFeedback}
                  buttons={['Promote', 'Details', 'Harmony', 'Subtype']}
                  style={{ backgroundColor: bgc }}
                />
              </ItemStore>
              );
            }
            return (
              <Accordion active={(uim.shape === 'open' && uim.shortId === item.id) || uim.shape === 'truncated'} name='item' key={item._id +'-panel-item'}>
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
          active={(uim && uim.creator)}
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
        uim={uim}
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



