
'use strict';

import React                       from 'react';
import Components                  from "./type-components/";
import UserInterfaceManager        from "./user-interface-manager";

class TypeComponent extends React.Component{
    render(){
        const Component = this.props.component ? Components[this.props.component]
                        : (this.props.panel && this.props.panel.type && this.props.panel.type.component) ? Components[this.props.panel.type.component]
                        : Components.Subtype;

        logger.info("TypeComponent", this.props );
        return(<UserInterfaceManager {...this.props} > <Component /> </UserInterfaceManager> );  //UIM passes props plus the UIM state to the child Component
    }
}

export default TypeComponent;
