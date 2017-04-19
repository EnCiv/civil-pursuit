
'use strict';

import React                       from 'react';
import Components                  from "./type-components/"

class TypeComponent extends React.Component{
    render(){
        const Component = this.props.component ? Components[this.props.component]
                        : (this.props.panel && this.props.panel.type && this.props.panel.type.component) ? Components[this.props.panel.type.component]
                        : Components.Subtype;

        logger.info("TypeComponent", this.props );
        return(<Component {...this.props} /> );
    }
}

export default TypeComponent;
