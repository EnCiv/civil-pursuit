'use strict';

import React from 'react';
import Icon               from './util/icon';
import Accordion          from './util/accordion';
import ClassNames          from 'classnames';

class Instruction extends React.Component {

  state = { truncated: false,
          };

  //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

  textHint() {
    this.setState({ hint: !this.state.truncated } );
  }

  //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

  readMore (e) {
    e.preventDefault();
   // e.stopPropagation();
        this.setState({truncated: !this.state.truncated});
  }

  //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

  render () {

    var instructionClass = ClassNames("instruction", this.props.className);

    return (
      <section className={instructionClass} >
        <Accordion 
                    className={ClassNames(this.props.classNames, "instruction-text")}
                    onClick={ this.readMore.bind(this) } 
                    active={ ! this.state.truncated } 
                    text={ true } 
                    onComplete={ this.textHint.bind(this) }
        >
        { this.props.children }
        </Accordion>
          <div className={ ClassNames(this.props.classNames,'instruction-hint', (this.state.truncated) ? 'hint-open' : '') } onClick={ this.readMore.bind(this) } >
              <Icon icon="envelope-open-o" />
          </div>
          <div className={ ClassNames(this.props.classNames,'instruction-hint', (this.state.truncated) ? 'hint-open' : '') } onClick={ this.readMore.bind(this) } >
              <Icon icon="envelope-o" />
          </div>
      </section>
    );
  }
}

export default Instruction;
