'use strict';

import React from 'react';
import config from '../../public.json';
import {ReactActionStatePath, ReactActionStatePathClient } from 'react-action-state-path';
import PanelHead from './panel-head';
import Item from './item';
import RASPPanelItems from './rasp-panel-items';
import ClassNames from 'classnames';

export default class PanelItems extends React.Component {
  render() {
    logger.trace("PanelItems render");
    return (
      <ReactActionStatePath {...this.props} >
        <PanelHead  cssName={'syn-panel-item'} >
          <RASPPanelItems />
        </PanelHead>
      </ReactActionStatePath>
    );
  }
}

class PanelHeading extends React.Component {
  render() {
    const {rasp, cssName, panel } = this.props;
    if(!(panel && panel.items && panel.items.length)) return null;

    const type= (typeof this.props.type === 'object' && this.props.type) || (panel && panel.type) || this.props.type || null;
    const style = Object.assign({}, { backgroundColor: 'white' }, this.props.style);
    const title=type.name;
    var {children, panelButtons, panelButtons = [], ...lessProps} = this.props;
    Object.assign(lessProps,{...panel});
    let name = cssName + '--' + (type._id || type);
    return (
      <section style={style} className={ClassNames(name, 'vs-' + rasp.shape, "syn-panel", cShape)} >
        <section className={ClassNames("syn-panel-heading", cShape, { 'no-heading': vShape === 'collapsed' })}>
          <h4 onClick={() => rasp.toParent({ type: "TOGGLE_FOCUS" })} key="title">
            {title}
          </h4>
          {panelButtons}
        </section>
        <section className={ClassNames("syn-panel-body", cShape)}>
          {React.Children.map(React.children.only(children), child=>React.cloneElement(child, lessProps, child.props.children))}
        </section>
      </section>
    );
  }
}
