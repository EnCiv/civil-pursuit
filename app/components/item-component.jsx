
'use strict';

import React                       from 'react';
import Components                  from "./item-components/"

class ItemComponent extends React.Component{
    render(){
        const {children, component, part, ...newProps}=this.props; // children to be discarded from newProps
        logger.trace("ItemComponent", this.props );
        const cObj=Components[component];
        if(typeof cObj !== "object" ) logger.error("ItemComponent component not defined", {component, part});
        else {
            const Component = cObj[part];
            if(typeof Component !== "function" ) logger.trace("ItemComponent part not defined", {component, part});
            else return(<Component {...newProps} /> );
        }
        return (null);
    }
}

export default ItemComponent;
