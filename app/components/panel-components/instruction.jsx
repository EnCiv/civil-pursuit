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
    const { rasp, type } = this.props;
    if (!type.instruction) return null; // no button if no instruction
    return (
      <div className={ClassNames(this.props.classNames, 'instruction-button-hint', (rasp.instructionHidden) ? '' : 'hint-open')} onClick={() => rasp.toParent({ type: "TOGGLE_INSTRUCTION" })} >
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
  }

  actionFilters = {
    "TOGGLE_INSTRUCTION": (action, delta) => { delta.instructionHidden = !this.props.rasp.instructionHidden; return false },
    "TOGGLE_INSTRUCTION_HINT": (action, delta) => { delta.instructionHint != this.props.rasp.instructionHint; return false },
    "DECENDANT_FOCUS": (action, delta) => { delta.instructionHidden = true; delta.instructionHint = false; return true; }
  }

  render() {
    const { rasp, type } = this.props;
    if (!type.instruction) return null;
    var instructionClass = ClassNames("instruction", this.props.className);

    return (
      <section className={instructionClass} >
        <Accordion
          onClick={() => rasp.toParent({ type: "TOGGLE_INSTRUCTION" })}
          active={this.vM.visible}
          text={true}
          onComplete={() => rasp.toParent({ type: "TOGGLE_INSTRUCTION_HINT" })}
        >
          <div className={ClassNames(this.props.classNames, "instruction-text")} >
            {type.instruction}
          </div>
        </Accordion>

        <div className={ClassNames(this.props.classNames, 'instruction-hint', this.vM.visible(rasp) ? 'hint-visible' : 'hint-hidden')}>
          <div className={ClassNames(this.props.classNames, 'instruction-hint', (rasp.instructionHint) ? 'hint-open' : '')} onClick={() => rasp.toParent({ type: "TOGGLE_INSTRUCTION" })} >
            <Icon icon={"envelope-open-o"} />
          </div>
        </div>
      </section>
    );
  }
}
