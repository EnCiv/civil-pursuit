
'use strict';

import React                       from 'react';
import Components                  from "./item-components/"

class ItemComponent extends React.Component{
    render(){
        delete this.props.children; // do not pass children - causes stack overflow
        logger.trace("ItemComponent", this.props );
        const {component, part} = this.props;
        const cObj=Components[component];
        if(typeof cObj !== "object" ) logger.error("ItemComponent component not defined", {component, part});
        else {
            const Component = cObj[this.props.part];
            if(typeof Component !== "function" ) logger.error("ItemComponent part not defined", {component, part});
            else return(<Component {...this.props} /> );
        }
        return (null);
    }
}

export default ItemComponent;
