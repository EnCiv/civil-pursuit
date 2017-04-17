
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
    history=false;

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

        if(!this.history && this.props.panel && this.props.panel.type){
            let typeSId=this.props.panel.type.id || 'notypeid';
            let parentSId= this.props.panel.parent ? this.props.panel.parent.id || 'noparentid' : 'noparent';
            window.history.pushState({},"",window.location.pathname+'items/'+typeSId+'/'+parentSId+'/');
            this.history=true;
        }
  
        var Component;
        if(this.props.component){
            Component=TypeComponent.components[this.props.component];
        } else if(this.props.panel && this.props.panel.type && this.props.panel.type.component) {
            Component=TypeComponent.components[this.props.panel.type.component];
        } else {
            Component=Subtype;
        }
        logger.info("TypeComponent", this.props );
        return(<Component {...this.props} /> );
    }
}

export default TypeComponent;
