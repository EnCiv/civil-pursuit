
'use strict';

import React                       from 'react';
import Components                  from "./item-components/"

class ItemComponent extends React.Component{
    render(){
        const Component = Components[this.props.component][this.props.part];
        logger.info("ItemComponent", this.props );
        return(<Component {...this.props} /> );
    }
}

export default TypeComponent;
