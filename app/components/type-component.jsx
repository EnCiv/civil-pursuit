
'use strict';

import React                            from 'react';
import * as components                  from "./type-components/*"


class TypeComponent extends React.Component{
    history=false;

/**
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

**/
    render(){
        console.info("TypeComponent",components);

        if(!this.history && this.props.panel && this.props.panel.type){
            let typeSId=this.props.panel.type.id || 'notypeid';
            let parentSId= this.props.panel.parent ? this.props.panel.parent.id || 'noparentid' : 'noparent';
            window.history.pushState({},"",window.location.pathname+'items/'+typeSId+'/'+parentSId+'/');
            this.history=true;
        }
  
        var Component;
        if(this.props.component){
            Component=components[this.props.component];
        } else if(this.props.panel && this.props.panel.type && this.props.panel.type.component) {
            Component=components[this.props.panel.type.component];
        } else {
            Component=components.Subtype;
        }
        logger.info("TypeComponent", this.props );
        return(<Component {...this.props} /> );
    }
}

export default TypeComponent;
