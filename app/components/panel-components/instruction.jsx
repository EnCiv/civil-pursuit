'use strict';

import React from 'react';
import Icon from '../util/icon';
import Accordion from 'react-proactive-accordion';
import ClassNames from 'classnames';
import { ReactActionStatePathFilter } from 'react-action-state-path';

const visualMethods={
  default: { // default the instruction is visibile initially
    visible: (rasp)=>!rasp.instructionHidden,
    icon: (rasp)=>rasp.instructionHidden ? "envelope-o" : "envelope-open-o"
  },
  titleize: { // the instruction is not visibile initially
    visible: (rasp)=>rasp.instructionHidden,
    icon: (rasp)=>rasp.instructionHidden ? "envelope-open-o" : "envelope-o"
  }
}

exports.button = class PanelInstructionButton extends React.Component {
  constructor(props){
    super(props);
    let visMeth=this.props.visualMethod || this.props.type && this.props.type.visualMethod || 'default';
    if(!(this.vM= visualMethods[visMeth])) {
      console.error("PanelInstructionsButton.constructor visualMethod unknown:",visMeth)
      this.vM=visualMethods['default'];
    }
  }
  render() {
    const { rasp, type, position } = this.props;
    if (!type.instruction) return null; // no button if no instruction
    return (
      <div style={{right: position+'px'}} className={ClassNames(this.props.classNames, 'panel-instruction-button', (rasp.instructionHidden) ? '' : 'hint-open')} onClick={() => rasp.toParent({ type: "TOGGLE_INSTRUCTION" })} >
        <Icon icon={this.vM.icon(rasp)} /> 
      </div>
    );
  }
}

exports.panel = class PanelInstruction extends ReactActionStatePathFilter {
  constructor(props){
    super(props,'shortId', 1);  // need to set the keyField
    let visMeth=this.props.visualMethod || this.props.type && this.props.type.visualMethod || 'default';
    if(!(this.vM= visualMethods[visMeth])) {
      console.error("PanelInstructionsPanel.constructor visualMethod unknown:",visMeth)
      this.vM=visualMethods['default'];
    }
    this.width=512; // just a starting point
  }

  actionFilters = {
    "TOGGLE_INSTRUCTION": (action, delta) => { delta.instructionHidden = !this.props.rasp.instructionHidden; return false },
    "TOGGLE_INSTRUCTION_HINT": (action, delta) => { delta.instructionHint != this.props.rasp.instructionHint; return false },
    "DECENDANT_FOCUS": (action, delta) => { delta.instructionHidden = true; delta.instructionHint = false; return true; }
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
    var instructionClass = ClassNames("panel-instruction", this.props.className);

    return (
      <section className={instructionClass} ref={(el)=>this.setWidth(el)} >
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

        <div style={{right: (this.vM.visible(rasp) ? ((this.width/2)-window.Synapp.fontSize) : position)+'px'}} className={ClassNames(this.props.classNames, 'panel-instruction-hint', this.vM.visible(rasp) ? 'hint-visible' : 'hint-hidden')} ref="hint">
          <div className={ClassNames(this.props.classNames, 'panel-instruction-hint', (rasp.instructionHint) ? 'hint-open' : '')} onClick={() => rasp.toParent({ type: "TOGGLE_INSTRUCTION" })} >
            <Icon icon={this.vM.icon(rasp)} />
          </div>
        </div>
      </section>
    );
  }
}
