'use strict';

import React from 'react';
import Icon from '../util/icon';
import Accordion from 'react-proactive-accordion';
import ClassNames from 'classnames';
import { ReactActionStatePathFilter } from 'react-action-state-path';

// a 4 state transition machine that starts at 'undefined' because that will be the initial value after construction, but the finish state is null, and null is also a start state. 
const Transition ={
  [undefined]: 'forward',
  [null]: 'forward',
  forward: 'finish',
  finish: 'backward',
  backward: null
}

// default and ooview, the instruction starts out open, but in titleize, the instruction starts out closed.
const visualMethods={
  default: {
     visible: {
      [undefined]: true,
      [null]: true,
      forward: false,
      finish: false,
      backward: true
     },
    shape: {
      [undefined]: 'open',
      [null]: 'open',
      forward: 'closing',
      finish: 'closed',
      backward: 'opening'
    },
    buttonIcon: {
      [undefined]: "envelope-open-o",
      [null]: "envelope-open-o",
      forward: 'envelope-open-o',
      finish: 'envelope-o',
      backward: "envelope-open-o"
    },
    panelIcon: {
      [undefined]: "envelope-open-o",
      [null]: "envelope-open-o",
      forward: 'envelope-open-o',
      finish: null,
      backward: "envelope-open-o"
    },
    unFocus: {
      [undefined]: 'finish',
      [null]: 'finish',
      forward: 'finish',
      finish: 'finish',
      backward: 'finish'
    }
  },
  titleize: {
    visible: {
      [undefined]: false,
      [null]: false,
      forward: true,
      finish: true,
      backward: false
    },
    shape: {
      [undefined]: 'closed',
      [null]: 'closed',
      forward: 'opening',
      finish: 'open',
      backward: 'closing'
    },
    buttonIcon: {
      [undefined]: "envelope-o",
      [null]: "envelope-o",
      forward: 'envelope-open-o',
      finish: 'envelope-open-o',
      backward: "envelope-open-o"
    },
    panelIcon: {
      [undefined]: null,
      [null]: null,
      forward: 'envelope-open-o',
      finish: 'envelope-open-o',
      backward: "envelope-open-o"
    },
    unFocus: {
      [undefined]: null,
      [null]: null,
      forward: null,
      finish: null,
      backward: null
    }
  }
}

visualMethods.ooview=visualMethods.default;


exports.button = class PanelInstructionButton extends React.Component {
  constructor(props){
    super(props);
    let visMeth=this.props.visualMethod || this.props.type && this.props.type.visualMethod || 'default';
    if(!visualMethods[visMeth]){
      console.error("PanelInstructionsButton.constructor visualMethod unknown:",visMeth);
      visMeth='default';
    }
    this.vM={}
    Object.keys(visualMethods[visMeth]).forEach(meth=>this.vM[meth]=(rasp)=>visualMethods[visMeth][meth][rasp.instruction]);
  }
  render() {
    const { rasp, type, position } = this.props;
    if (!type.instruction) return null; // no button if no instruction
    return (
      <div style={{right: position+'px'}} className={ClassNames(this.props.classNames, 'panel-instruction-button', (rasp.instructionHidden) ? '' : 'hint-open')} onClick={() => rasp.toParent({ type: "TOGGLE_INSTRUCTION" })} key='instruction'>
        <Icon icon={this.vM.buttonIcon(rasp)} /> 
      </div>
    );
  }
}

exports.panel = class PanelInstruction extends ReactActionStatePathFilter {
  constructor(props){
    super(props,'shortId', 1);  // need to set the keyField
    let visMeth=this.props.visualMethod || this.props.type && this.props.type.visualMethod || 'default';
    if(!visualMethods[visMeth]){
      console.error("PanelInstructionsButton.constructor visualMethod unknown:",visMeth);
      visMeth='default';
    }
    this.vM={}
    Object.keys(visualMethods[visMeth]).forEach(meth=>this.vM[meth]=(rasp)=>visualMethods[visMeth][meth][rasp.instruction]);
    this.width=512; // just a starting point
  }

  actionFilters = {
    "TOGGLE_INSTRUCTION": (action, delta) => { 
      let inst=this.props.rasp.instruction; 
      if(!inst || inst==='finish') 
        delta.instruction = Transition[this.props.rasp.instruction]; 
        return false 
    },
    "TOGGLE_INSTRUCTION_HINT": (action, delta) => { 
      let inst=this.props.rasp.instruction; 
      if(inst==='forward' || inst==='backward') 
        delta.instruction = Transition[this.props.rasp.instruction]; 
      return false 
    },
    "DESCENDANT_FOCUS": (action, delta) => { if(action.distance >0 ) delta.instruction = this.vM.unFocus(this.props.rasp); return true; },
    "NEXT_PANEL": (action, delta) => {if(action.distance >0 ) delta.instruction = this.vM.unFocus(this.props.rasp); return true; }
  }

  setWidth(el){
    if(!el) return;
    this.width=el.getBoundingClientRect().width;
    if(this.vM.visible(this.props.rasp))
      this.refs.hint.style.right=(this.width/2-window.Synapp.fontSize)+'px';
  }

  render() {
    const { rasp, type, position } = this.props;
    if (!type.instruction) return null;

    return (
      <section className={ClassNames("panel-instruction", this.props.className)} ref={(el)=>this.setWidth(el)} key="instruction" >
        <Accordion
          onClick={() => rasp.toParent({ type: "TOGGLE_INSTRUCTION" })}
          active={this.vM.visible(rasp)}
          text={true}
          onComplete={() => rasp.toParent({ type: "TOGGLE_INSTRUCTION_HINT" })}
        >
          <div className={ClassNames(this.props.classNames, "panel-instruction-text")} >
            {type.instruction}
          </div>
        </Accordion>

        <div  style={{right: (this.vM.visible(rasp) ? ((this.width/2)-window.Synapp.fontSize) : position)+'px'}}
              className={ClassNames(this.props.classNames, 'panel-instruction-hint', this.vM.shape(rasp))} 
              onClick={() => rasp.toParent({ type: "TOGGLE_INSTRUCTION" })} 
              ref="hint"
        >
          <Icon icon={this.vM.panelIcon(rasp)} />
        </div>
      </section>
    );
  }
}
