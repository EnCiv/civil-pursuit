'use strict';

import React                    from 'react';
import ClassNames          from 'classnames';

class DoubleWide extends React.Component {
    
    closed(){
            if(this.props.onComplete) {this.props.onComplete();}
    }

    render () {
        var classes = ClassNames("double-wide", this.props.className);
        if(this.props.left) { classes.push('left');}
        if(this.props.right) { classes.push('right'); }
        if(this.props.expanded) { classes.push('expanded'); }
        if(this.props.closed) {
            classes.push('closed'); 
            if(this.props.onComplete){
                setTimeout(this.closed.bind(this), 500);
            }
        }
        return (
        <section className={itemClass}  ref="double">
            { this.props.children }
        </section>
        );
    }
}

export default DoubleWide;