'use strict';

import React from 'react';
import {ReactActionStatePathFilter} from 'react-action-state-path';

export default class ResultsFocusHere extends ReactActionStatePathFilter {
    actionFilters={
        "RESULTS": (action, delta) => {
            setTimeout(()=>Synapp.ScrollFocus(this.refs.top,500),500);
            return true;
        }
    }

    render(){
        const {children, ...lessProps}=this.props;
        return(
            <section ref="top">
                {React.Children.map(React.Children.only(children), child=>React.cloneElement(child, lessProps, child.props.children))}
            </section>
        );
    }
}
