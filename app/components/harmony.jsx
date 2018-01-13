'use strict';

import React from 'react';
import Loading from './util/loading';
import Row from './util/row';
import Column from './util/column';
import PanelItems from './panel-items';
import makePanelId from '../lib/app/make-panel-id';
import itemType from '../lib/proptypes/item';
import panelType from '../lib/proptypes/panel';
import PanelStore from './store/panel';
import DoubleWide from './util/double-wide';
import { ReactActionStatePath, ReactActionStatePathClient } from 'react-action-state-path';

var other={L: 'R', R: 'L'};

export default class Harmony extends React.Component {
  render() {
    //onsole.info("Harmony above.render");
    return (
      <ReactActionStatePath {...this.props}>
        <RASPHarmony />
      </ReactActionStatePath>
    )
  }
}

class RASPHarmony extends ReactActionStatePathClient {

  //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

  constructor(props) {
    super(props, 'side', 0);
    let visMeth = this.props.visualMethod || (this.props.item && this.props.item.type && this.props.item.type.visualMethod) || (this.props.type && this.props.type.visualMethod) || 'default';
    if (!(this.vM = this.visualMethods[visMeth])) {
      console.error("RASPHarmony.constructor visualMethod unknown:", visMeth)
      this.vM = this.visualMethods['default'];
    }
    //onsole.info("RASPHarmony.constructor", this.props)
  }

  //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
  // this is where component specific actions are converted to component specific states
  //

  segmentToState(action, initialRASP) {
    var nextRASP={};
    var parts = action.segment.split(',');
    parts.forEach(part=>{
      if(part==='L') nextRASP.side='L';
      if(part==='R') nextRASP.side='R';
      if(part==='d') nextRASP.decendantFocus=true;
      else console.error("PanelItems.segmentToState unexpected part:", part);
    })
    this.vM.deriveRASP(nextRASP,initialRASP);
    if(nextRASP.pathSegment !== action.segment) console.error("Harmony.segmentToAction calculated path did not match",action.pathSegment, nextRASP.pathSegment )
    return { nextRASP, setBeforeWait: false };  //setBeforeWait means set the new state and then wait for the key child to appear, otherwise wait for the key child to appear and then set the new state.
  }

  actionToState(action, rasp, source, initialRASP, delta) {
    if (this.debug) console.info("RASPHarmony.actionToState", ...arguments);
    var nextRASP = {};

    if (this.vM.actionToState(action, rasp, source, initialRASP, delta)) {
      ; //then do nothing - it's been done if (action.type==="DESCENDANT_FOCUS") {
    } else if(Object.keys(delta).length) {
      ; // no need to do anything, but do continue to calculate nextRASP
    } else
      return null; // don't know this action, null so the default methods can have a shot at it

    Object.assign(nextRASP, rasp, delta);
    this.vM.deriveRASP(nextRASP, initialRASP)
    return nextRASP;
  }

  deriveRASP = (rasp, initialRASP) => {
    if (rasp.side || rasp.focus) rasp.shape = 'open'
    else rasp.shape = initialRASP.shape;
    // calculate the pathSegment and return the new state
    let parts = [];
    if (rasp.side) parts.push(rasp.side);
    if (rasp.decendantFocus) parts.push('d');
    if (rasp.focus) parts.push('f');
    rasp.pathSegment = parts.join(',');
  }

  //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
  visualMethods = {
    default: {
      // the shape to give a child, when it is initially mounted
      childShape: (side) => {
        let rasp = this.props.rasp;
        return rasp.shape === 'open' ? 'truncated' : rasp.shape;
      },
      // visualMethod for the child
      childVisualMethod: () => this.props.visualMethod,  // pass it on

      // process actions for this visualMethod
      actionToState: (action, rasp, source, initialRASP, delta) => {
        if (action.type === "DESCENDANT_FOCUS") {
          delta.side = action.side; // action is to open, this side is going to be the open side
        } else if (action.type==="DESCENDANT_UNFOCUS" && (action.distance===1 || action.distance===2)) {
            delta.side= null; 
            if (rasp.side && action.side === rasp.side) {
              this.toChild[rasp.side]({ type: "RESET_STATE" });  // CHANGE_SHAPE ?
            }
        } else
          return false;
        return true;
      },
      // derive shape and pathSegment from the other parts of the RASP
      deriveRASP: this.deriveRASP
    },
    titleize: {
      // the shape to give a child, when it is initially mounted
      childShape: (side) => {
        let rasp = this.props.rasp;
        return rasp.shape === 'open' ? 'truncated' : rasp.shape;
      },
      // visualMethod for the child
      childVisualMethod: () => this.props.visualMethod,  // pass it on

      // process actions for this visualMethod
      actionToState: (action, rasp, source, initialRASP, delta) => {
        if (action.type === "FOCUS_STATE") {
          delta.focus=true;
          if(!rasp.focus){
            this.toChild['L']({ type: "FOCUS_STATE" });
            this.toChild['R']({ type: "FOCUS_STATE" });
          }
        } else if(action.type==="UNFOCUS_STATE"){
          delta.focus=false;
          delta.side=null;
          if(rasp.focus){
            this.toChild['L']({ type: "UNFOCUS_STATE" });
            this.toChild['R']({ type: "UNFOCUS_STATE" });
          }
        } else if (action.type === "DESCENDANT_FOCUS") {
          if(action.distance===1 || action.distance===2){
            if(!rasp.focus ){
              delta.focus=true;
              this.toChild[other[action.side]]({ type: "FOCUS_STATE" });
              this.queueAction({type: "SET_BUTTON", button: "Harmony"});
            }
            delta.side=action.side; 
          } 
        } else if (action.type === "DESCENDANT_UNFOCUS") {
          if(action.distance===1){
            if(rasp.side) {
              this.toChild[rasp.side]({type: "FOCUS_STATE"}); // the panel should stay focused
              action.type="NOP"; // this action should stop propogating.  This does not seem to be the elegant way to do that
            } else if(rasp.focus) {
              delta.focus=false;
              this.toChild[other[action.side]]({ type: "UNFOCUS_STATE" })
              this.queueAction({type: "UNFOCUS_STATE"}); //{type: "RESET_BUTTON", button: "Harmony"});
            }
          }else if(action.distance===2){
            ;
          }else if(action.distance===3){ // unfocus child was promote
            if(rasp.focus) {
              delta.focus=false;
              this.toChild[action.side]({ type: "UNFOCUS_STATE" });
              this.toChild[other[action.side]]({ type: "UNFOCUS_STATE" })
              this.queueAction({type: "UNFOCUS_STATE"}); //{type: "RESET_BUTTON", button: "Harmony"});
            }
          }
          delta.side=null;
        } else
          return false;
        return true;
      },
      // derive shape and pathSegment from the other parts of the RASP
      deriveRASP: this.deriveRASP
    }
  }


    //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

    render() {
      const { active, item, rasp, ...otherProps } = this.props;
      //onsole.info("Harmony.render", this.props);


      let contentLeft = (
        <DoubleWide className="harmony-pro" left expanded={rasp.side === 'L'} key={item._id + '-left'}>
          <PanelStore type={item.harmony.types[0]} parent={item} >
            <PanelItems {...otherProps} visualMethod={this.vM.childVisualMethod()} rasp={this.childRASP(this.vM.childShape('L'), 'L')} />
          </PanelStore>
        </DoubleWide>
      );

      let contentRight = (
        <DoubleWide className="harmony-con" right expanded={rasp.side === 'R'} key={item._id + '-right'} >
          <PanelStore type={item.harmony.types[1]} parent={item} >
            <PanelItems {...otherProps} visualMethod={this.vM.childVisualMethod()} rasp={this.childRASP(this.vM.childShape('R'), 'R')} />
          </PanelStore>
        </DoubleWide>
      );

      return (
        <section className={`item-harmony ${this.props.className}`}>
          {contentLeft}
          {contentRight}
        </section>
      );
    }
  }
