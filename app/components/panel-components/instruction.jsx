'use strict';

import React from 'react';
import Icon               from '../util/icon';
import Accordion          from 'react-proactive-accordion';
import ClassNames          from 'classnames';

exports.panel = class PanelInstruction extends React.Component {

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

  hide(){
      this.setState({truncated: true});
  }

  show(){
      this.setState({truncated: false});
  }

  componentDidMount(){
    if(this.props.toParent){
      this.props.toParent({hide: this.hide.bind(this)});
    }
  }

  render () {

    var instructionClass = ClassNames("instruction", this.props.className);

    return (
      <section className={instructionClass} >
        <Accordion
          onClick={this.readMore.bind(this)}
          active={!this.state.truncated}
          text={true}
          onComplete={this.textHint.bind(this)}
          >
          <div className={ClassNames(this.props.classNames, "instruction-text")} >
            {this.props.children}
          </div>
        </Accordion>

        <div className={ClassNames(this.props.classNames, 'instruction-hint', (!this.state.truncated) ? 'hint-visible' : 'hint-hidden')}>
          <div className={ClassNames(this.props.classNames, 'instruction-hint', (this.state.truncated) ? 'hint-open' : '')} onClick={this.readMore.bind(this)} >
            <Icon icon="envelope-open-o" />
          </div>
          <div className={ClassNames(this.props.classNames, 'instruction-hint', (!this.state.truncated) ? 'hint-closed' : '')} onClick={this.readMore.bind(this)} >
            <Icon icon="envelope-o" />
          </div>
        </div>
      </section>
    );
  }
}
