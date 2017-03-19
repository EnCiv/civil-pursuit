
'use strict';

import React                            from 'react';
import QHome                            from './qhome';
import PanelList                        from './panel-list';
import Subtype                          from './subtype';
import QSortItems                       from './qsort-items';
import QSortWhy                         from './qsort-why';
import QSortRefine                      from './qsort-refine';
import QSortReLook                      from './qsort-harmony';
import QSortFinale                      from './qsort-finale';
import LoginPanel                       from './login-panel';
import ProfilePanel                     from './profile-panel';

class TypeComponent extends React.Component{

    static components={
        'PanelList': PanelList,
        'QHome': QHome,
        'Subtype': Subtype,
        'QSortItems': QSortItems,
        'QSortWhy': QSortWhy,
        'QSortRefine': QSortRefine,
        'QSortReLook': QSortReLook,
        'LoginPanel': LoginPanel,
        'QSortFinale': QSortFinale,
        'ProfilePanel': ProfilePanel,        
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
        console.info("TypeComponent", this.props );
        return(<Component {...this.props} /> );
    }
}

export default TypeComponent;
