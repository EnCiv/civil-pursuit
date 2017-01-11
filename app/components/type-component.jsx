
'use strict';

import React                            from 'react';
import QHome                            from './qhome';
import PanelList                        from './panel-list';
import Subtype                          from './subtype';
import QSortItems                       from './qsort-items';
import QSortWhy                         from './qsort-why';
import QSortRefine                      from './qsort-refine';

class TypeComponent extends React.Component{

    static components={
        'PanelList': PanelList,
        'QHome': QHome,
        'Subtype': Subtype,
        'QSortItems': QSortItems,
        'QSortWhy': QSortWhy,
        'QSortRefine': QSortRefine
    }

    render(){
        var Component;
        if(this.props.component){
            Component=TypeComponent.components[this.props.component];
        } else if(this.props.panel && this.props.panel.type && this.props.panel.type.component) {
            Component=TypeComponent.components[this.props.panel.type.component];
        } else {
            Component=Subtype;
        }
        return(<Component {...this.props} /> );
    }
}

export default TypeComponent;
