'use strict';

import React from 'react';
import {ReactActionStatePathFilter} from 'react-action-state-path';

export default class RASPFocusHere extends ReactActionStatePathFilter {
    top=null;

    setTop(ele){
        if(ele) this.top=ele;
    }

    focusHere(){
        setTimeout(()=>Synapp.ScrollFocus(this.top,500),500);
        return true;
    }

    focusHereMatch(match, action, delta) {
        if(Object.keys(match).every(key=>match[key]===action[key])){
            setTimeout(()=>Synapp.ScrollFocus(this.top,500),500);
        }
        return true;
    }

    componentWillMount(){
        if(this.props.filterTypes) this.props.filterTypes.forEach(filterType=>{
            if(typeof filterType==='string')
                this.props.rasp.toParent({type: "SET_ACTION_FILTER", filterType, name: this.constructor.name, function: this.focusHere.bind(this)});
            else if(typeof filterType==='object'){
                this.props.rasp.toParent({type: "SET_ACTION_FILTER", filterType: filterType.type, name: this.constructor.name, function: this.focusHereMatch.bind(this,filterType)});
            }
        });
    }

    componentDidMount(){
        if(this.props.filterTypes.some(action=>action==='COMPONENT_DID_MOUNT')) 
            setTimeout(()=>Synapp.ScrollFocus(this.top,500),500);
    }

    render(){
        const {children, ...lessProps}=this.props;
        return(
            <section ref={this.setTop.bind(this)}>
                {React.Children.map(React.Children.only(children), child=>React.cloneElement(child, lessProps, child.props.children))}
            </section>
        );
    }
}
