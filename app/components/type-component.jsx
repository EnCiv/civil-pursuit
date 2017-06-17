
'use strict';

import React                       from 'react';
import Components                  from "./type-components/";
import ReactActionStatePath        from "react-action-state-path";

class TypeComponent extends React.Component{
    render(){
        const {component}=this.props;
        const Component = component ? Components[component]
                        : (this.props.panel && this.props.panel.type && this.props.panel.type.component) ? Components[this.props.panel.type.component]
                        : Components.Subtype;

        logger.trace("TypeComponent", this.props );
        if(typeof Component === 'function') return(<ReactActionStatePath {...this.props} ><Component /></ReactActionStatePath> );  //UIM passes props plus the UIM state to the child Component
        logger.error("TypeComponent component not defined", {component});
        return null;
    }
}

export default TypeComponent;
