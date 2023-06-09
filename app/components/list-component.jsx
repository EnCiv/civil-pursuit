
'use strict';

import React                       from 'react';

class ListComponent extends React.Component{
    render(){
        const {children, Components, component, part, ...newProps}=this.props; // children to be discarded from newProps
        //logger.trace("ItemComponent", this.props );
        const cObj=Components[component];
        if(typeof cObj !== "object" ) logger.error("ItemComponent component not defined", {component, part});
        else {
            const Component = cObj[part];
            if(typeof Component !== "function" ) logger.error("ItemComponent part not defined", {component, part});
            else return(<Component {...newProps} /> );
        }
        return (null);
    }
}

export default ListComponent;
