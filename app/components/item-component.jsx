
'use strict';

import React                       from 'react';
import Components                  from "./item-components/"

class ItemComponent extends React.Component{
    render(){
        var newProps=Object.assign(this.props);
        delete newProps.children;
        logger.trace("ItemComponent", this.props );
        const {component, part} = this.props;
        const cObj=Components[component];
        if(typeof cObj !== "object" ) logger.error("ItemComponent component not defined", {component, part});
        else {
            const Component = cObj[newProps.part];
            if(typeof Component !== "function" ) logger.trace("ItemComponent part not defined", {component, part});
            else return(<Component {...newProps} /> );
        }
        return (null);
    }
}

export default ItemComponent;
