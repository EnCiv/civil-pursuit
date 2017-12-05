'use strict';

import React from 'react';
import {ReactActionStatePath, ReactActionStatePathClient } from 'react-action-state-path';
import PanelHead from './panel-head';
import Item from './item';
import ClassNames from 'classnames';
import RASPPanelItems from './rasp-panel-items';

import Components from "./panel-components/";
import ListComponent from './list-component';

export default class PanelItems extends React.Component {
  render() {
    logger.trace("PanelItems render");
    return (
      <ReactActionStatePath {...this.props} >
        <PanelHeading  cssName={'syn-panel-item'} panelButtons={['Creator','Instruction']}>
          <RASPPanelItems />
        </PanelHeading>
      </ReactActionStatePath>
    );
  }
}

class PanelHeading extends React.Component {
  render() {
    const {rasp, cssName, panel } = this.props;

    const type= (typeof this.props.type === 'object' && this.props.type) || (panel && panel.type) || this.props.type || null;
    if(!type) return null;

    const style = Object.assign({}, { backgroundColor: 'white' }, this.props.style);
    const title=type.name;
    var {children, panelButtons = [], ...lessProps} = this.props;
    Object.assign(lessProps,{...panel});
    let name = cssName + '--' + (type._id || type);
    const vShape=rasp ? rasp.shape : '';
    const cShape= vShape ? 'vs-'+vShape : '';

    // a button could be a string, or it could be an object which must have a property component
    var renderComponents = (part, button) => {
      if(typeof button==='string')
        return (<ListComponent Components={Components} {...lessProps} component={button} part={part} key={type._id + '-' + button} />);
      else if (typeof button==='object')
        return (<ListComponent Components={Components} {...lessProps}  part={part} key={item._id + '-' + button.component} {...button} />);
    }

    return (
      <section style={style} className={ClassNames(name, 'vs-' + rasp.shape, "syn-panel", cShape)} >
        <section className={ClassNames("syn-panel-heading", cShape, { 'no-heading': vShape === 'collapsed' })}>
          <h4 onClick={() => rasp.toParent({ type: "TOGGLE_FOCUS" })} key="title">
            {title}
          </h4>
          {panelButtons.map(button=>renderComponents('button',button))}
        </section>
        <section className={ClassNames("syn-panel-body", cShape)}>
          {panelButtons.map(button=>renderComponents('panel',button))}
          {React.Children.map(React.Children.only(children), child=>React.cloneElement(child, lessProps, child.props.children))}
        </section>
      </section>
    );
  }
}


