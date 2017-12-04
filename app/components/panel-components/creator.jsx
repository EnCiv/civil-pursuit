'use strict';

import React from 'react';
import ButtonGroup from '../util/button-group';
import Button from '../util/button';
import Icon from '../util/icon';
import Accordion          from 'react-proactive-accordion';
import Creator from '../creator';
import {ReactActionStatePathFilter} from 'react-action-state-path';

exports.button = class PanelCreatorButton extends React.PureComponent {
    render(){
        const {createMethod, user, parent}=this.props;
        const type= (typeof this.props.type === 'object' && this.props.type) || (panel && panel.type) || this.props.type || null;
        let createValue= createMethod || (type && type.createMethod) || 'visible'; // passed in by props overrides what's in type
        createValue= (type && type.createMethod && (type.createMethod[type.createMethod.length-1]==='!') && type.createMethod.substring(0,type.createMethod.length-1)) || createValue;  // unless what's in type ends in !

        return (
            ((createValue==='hidden' || (typeof type !== "object")) && !(user && user.id && parent && parent.user && parent.user._id && (user.id == parent.user._id))) ? 
            null :
            <Icon
                icon="plus"
                className="toggle-creator"
                onClick={()=>rasp.toParent({type: "TOGGLE_CREATOR"})}
                key="plus"
            />
        )
    }
}

exports.panel = class PanelCreator extends ReactActionStatePathFilter {
  constructor(props){
    super(props,'shortId', 1);
    this.mounted=false;
  }

  actionFilters={
    TOGGLE_CREATOR: (action, delta)=>{
      if (rasp.creator)// it's on so toggle it off
        delta.creator=false;
      else { // it's off so toggle it on
        delta.creator = true;
        if (rasp.shortId) {//there is an item that's open
          this.props.rasp.toParent({ type: "RESET_SHAPE", shortId: rasp.shortId, direction: "DESCEND"});
          delta.shortId = null;
        }
      }
      if(delta.creator)
        this.queueFocus(action); 
      else 
        this.queueUnfocus(action)
      return false; // do not propogate this action
    }
  }

  render(){
    let bgc="white";
    var creator=null;
    if(this.mounted || (rasp && rasp.creator)){
      this.mounted=true;
      creator = (
          <Accordion
              active={(rasp && rasp.creator)}
              style={{ backgroundColor: bgc }}
          >
              <Creator
                  type={type}
                  parent={parent}
                  toggle={()=>rasp.toParent({ type: "TOGGLE_CREATOR" })}
              />
          </Accordion>
      );
    }
    return 
      <section>
        {creator}
        {React.Children.map(React.Children.only(children), child=>React.cloneElement(child, lessProps, child.props.children))}
      </section>
  }
}
