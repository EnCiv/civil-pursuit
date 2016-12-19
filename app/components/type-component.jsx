
'use strict';

import React                            from 'react';
import PanelItems                       from './panel-items';
import QHome                            from './qhome';
import PanelList                        from './panel-list';

class TypeComponent extends React.Component{

    static components={
        'PanelItems': PanelItems,
        'QHome': QHome,
        'PanelList': PanelList
    }

    Component;

    constructor(props){
        super(props);
        if(this.props.component){
            Component=TypeComponent.components[this.props.componentType];
        } else {
            Component=PanelList;
        }
    }

    render(){
        return(<Component {...this.props} /> );

    }

}

export default TypeComponent;
