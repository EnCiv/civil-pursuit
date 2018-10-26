'use strict';

import React from 'react';
import Icon from '../util/icon';
import Accordion          from 'react-proactive-accordion';
import {ReactActionStatePathFilter} from 'react-action-state-path';
import Item from '../item'

exports.button = class PanelCreatorButton extends React.PureComponent {
    render(){
        const {createMethod, user, rasp, parent, panel, position, type}=this.props;
        let createValue= createMethod || (type.createMethod) || 'visible'; // passed in by props overrides what's in type
        createValue= (type.createMethod && (type.createMethod[type.createMethod.length-1]==='!') && type.createMethod.substring(0,type.createMethod.length-1)) || createValue;  // unless what's in type ends in !

        return (
            ((createValue==='hidden' || (typeof type !== "object")) && !(user && user.id && parent && parent.user && parent.user._id && (user.id == parent.user._id))) ? 
            null :
            <div style={{right: position+'px'}} className="panel-creator-button">
              <Icon
                  icon="plus"
                  className="toggle-creator"
                  onClick={()=>rasp.toParent({type: "TOGGLE_CREATOR"})}
                  key="plus"
              />
            </div>
        )
    }
}

exports.panel = class PanelCreator extends ReactActionStatePathFilter {
  constructor(props){
    super(props,'shortId', 0);
    this.mounted=false;
  }

  actionFilters={
    TOGGLE_CREATOR: (action, delta)=>{
      let rasp=this.props.rasp;
      if (rasp.creator)// it's on so toggle it off
        delta.creator=false;
      else { // it's off so toggle it on
        delta.creator = true;
        if (rasp.shortId) {//there is an item that's open
          rasp.toParent({ type: "RESET_SHAPE", shortId: rasp.shortId, direction: "DESCEND"});
          delta.shortId = null;
        }
      }
      if(delta.creator)
        this.queueFocus(action); 
      else 
        this.queueUnfocus(action)
      return false; // do not propagate this action
    },
    POST_ITEM: (action, delta)=>{
      let rasp=this.props.rasp;
      if(rasp.creator){
        delta.creator=false;
        this.queueUnfocus(action)
      }
      return true; // let this one propagate further
    }
  }

  render(){
    let bgc="white";
    var creator=null;
    const {rasp, type, parent}=this.props;
    if(this.mounted || (rasp && rasp.creator)){
      this.mounted=true;
      var item={type};
      if(parent)item.parent=parent;
      creator = (
          <Accordion
              active={(rasp && rasp.creator)}
              style={{ backgroundColor: bgc }}
          >
              <Item
                  rasp={{shape: 'edit', depth: rasp.depth, toParent: rasp.toParent }}
                  visualMethod="edit"
                  item={item}
                  buttons={["Post"]}
              />
          </Accordion>
      );
    }
    return creator;
  }
}
