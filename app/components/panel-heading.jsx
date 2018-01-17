'use strict';

import React from 'react';
import ClassNames from 'classnames';
import Components from "./panel-components/";
import ListComponent from './list-component';
import smoothScroll from '../lib/app/smooth-scroll';

export default class PanelHeading extends React.Component {
  constructor(props){
    super(props);
    if(typeof window !== 'undefined')
      this.iconWidth=window.Synapp.fontSize*2;
    else
      this.iconWidth=13*2;
  }

  render() {
    const {rasp, cssName, panel } = this.props;

    const type= (typeof this.props.type === 'object' && this.props.type) || null;
    if(!type) return null;

    const style = Object.assign({}, { backgroundColor: 'white' }, this.props.style);
    const title=type.name;
    var {children, panelButtons = [], ...lessProps} = this.props;
    Object.assign(lessProps,{...panel}); // this is over riding 'type' that was calculating above
    let name = cssName + '--' + (type._id || type);
    const vShape=rasp ? rasp.shape : '';
    const cShape= vShape ? 'vs-'+vShape : '';

    // a button could be a string, or it could be an object which must have a property component
    var renderComponents = (part, button, position) => {
      if(typeof button==='string')
        return (<ListComponent Components={Components} {...lessProps} component={button} part={part} key={rasp.raspId + '-' + button} position={position} />);
      else if (typeof button==='object')
        return (<ListComponent Components={Components} {...lessProps} part={part} key={rasp.raspId + '-' + button.component} {...button} position={position} />);
    }

    return (
      <section style={style} className={ClassNames(name, 'vs-' + rasp.shape, "syn-panel", cShape)} ref="top">
        <section className={ClassNames("syn-panel-heading", cShape, { 'no-heading': vShape === 'collapsed' })}>
          <h4 onClick={() =>{ rasp.toParent({ type: "TOGGLE_FOCUS" }); }} key={rasp.raspId+"-title"}>
            {title}
          </h4>
          {panelButtons.map((button,i)=>renderComponents('button',button, (i+0.5)*this.iconWidth))}
        </section>
        <section className={ClassNames("syn-panel-body", cShape)}>
          {panelButtons.map((button,i)=>renderComponents('panel',button, (i+0.5)*this.iconWidth))}
          { lessProps.items ? React.Children.map(React.Children.only(children), child=>{
              var newProps=Object.assign({},lessProps);
              Object.keys(child.props).forEach(prop=>delete newProps[prop]);
              return React.cloneElement(child, newProps, child.props.children)
            }) : <div className="panel-heading-loading">{"Loading..."}</div>
          }
        </section>
      </section>
    );
  }
}


