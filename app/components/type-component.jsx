
'use strict';

import React                       from 'react';
import Components                  from "./type-components/";
import ReactActionStatePath        from "react-action-state-path";

class TypeComponent extends React.Component{
    render(){
        const component=this.props.component || (this.props.panel && this.props.panel.type && this.props.panel.type.component) || 'Subtype';
        var Component;
        var newProps={};

        if(typeof component === 'object'){
            Object.assign(newProps,this.props,component);
            Component=Components[component.component];
        } else {
            Object.assign(newProps,this.props);
            Component=Components[component];
        }
        if(newProps.component) delete newProps.component;

        logger.trace("TypeComponent", component, newProps );
        if(typeof Component === 'function') return(<Component {...newProps}/>);  //UIM passes props plus the UIM state to the child Component
        logger.error("TypeComponent component not defined", {component});
        return null;
    }
}

export default TypeComponent;
