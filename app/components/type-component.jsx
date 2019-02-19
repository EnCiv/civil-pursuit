
'use strict';

import React                       from 'react';
import Components                  from "./type-components/";

class TypeComponent extends React.Component{
    static attributes(component){
        let Component;
        if(typeof component === 'object'){
            Component=Components[component.component];
            if(typeof Component === 'object')
                return Component.attributes;
            else 
                return {};
        } else {
            Component=Components[component];
            if(typeof Component === 'object')
                return Component.attributes;
            else return {};
        }
    }
    render(){
        const component=this.props.component || (this.props.panel && this.props.panel.type && this.props.panel.type.component) || 'Subtype';
        var Component;
        var newProps={};

        if(typeof component === 'object'){
            Object.assign(newProps,this.props,component);
            Component=Components[component.component];
            if(typeof Component === 'object')
                Component=Component.default;
        } else {
            Object.assign(newProps,this.props);
            Component=Components[component];
            if(typeof Component === 'object')
                Component=Component.default;
        }
        if(newProps.component) delete newProps.component;

        //logger.trace("TypeComponent", component, newProps );
        if(typeof Component === 'function') return(<Component {...newProps}/>);  //UIM passes props plus the UIM state to the child Component
        logger.error("TypeComponent component not defined", {component});
        return null;
    }
}

export default TypeComponent;
