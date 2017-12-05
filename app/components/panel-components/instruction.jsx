'use strict';

import React from 'react';
import Icon               from '../util/icon';
import Accordion          from 'react-proactive-accordion';
import ClassNames          from 'classnames';
import ReactActionStatePathFilter from 'react-action-state-path';

exports.button = class PanelInstructionButton extends React.Component {
    render(){
        const {rasp, type}=this.props;
        if(!type.instruction) return null; // no button if no instruction
        return (
            <div className={ClassNames(this.props.classNames, 'instruction-hint', (rasp.instructionHidden) ? '' : 'hint-open')} onClick={()=>rasp.toParent({type: "TOGGLE_INSTRUCTION"})} >
                <Icon icon="envelope-open-o" />
            </div>
        );
    }
}

exports.panel = class PanelInstruction extends ReactActionStatePathFilter {

    actionFilters = {
        "TOGGLE_INSTRUCTION": (action, delta) => { delta.instructionHidden = !delta.instructionHidden; return false },
        "TOGGLE_INSTRUCTION_HINT": (action, delta) => { delta.instruction_hint != delta.instructionHint; return false },
        "DECENDANT_FOCUS": (action, delta) => { delta.instructionHidden = true; delta.instructionHint = false; return true; }
    }

  render () {
    const {rasp, type}=this.props;
    if(!type.instruction) return null;
    var instructionClass = ClassNames("instruction", this.props.className);

    return (
      <section className={instructionClass} >
        <Accordion
          onClick={()=>rasp.toParent({type: "TOGGLE_INSTRUCTION"})}
          active={!rasp.instructionHidden}
          text={true}
          onComplete={()=>rasp.toParent({type: "TOGGLE_INSTRUCTION_HINT"})}
          >
          <div className={ClassNames(this.props.classNames, "instruction-text")} >
            {type.instruction}
          </div>
        </Accordion>

        <div className={ClassNames(this.props.classNames, 'instruction-hint', (!rasp.instructionHint) ? 'hint-visible' : 'hint-hidden')}>
          <div className={ClassNames(this.props.classNames, 'instruction-hint', (rasp.instructionHint) ? 'hint-open' : '')} onClick={()=>rasp.toParent({type: "TOGGLE_INSTRUCTION"})} >
            <Icon icon="envelope-open-o" />
          </div>
          <div className={ClassNames(this.props.classNames, 'instruction-hint', (!rasp.instructionHint) ? 'hint-closed' : '')} onClick={()=>rasp.toParent({type: "TOGGLE_INSTRUCTION"})} >
            <Icon icon="envelope-o" />
          </div>
        </div>
      </section>
    );
  }
}
