
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

    render(){
        var Component;
        if(this.props.component){
            Component=TypeComponent.components[this.props.component];
        } else {
            Component=PanelList;
        }
        return(<Component {...this.props} /> );
    }
}

export default TypeComponent;
