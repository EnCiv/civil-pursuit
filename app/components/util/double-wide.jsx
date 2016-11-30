'use strict';

import React                    from 'react';
import ClassNames          from 'classnames';

class DoubleWide extends React.Component {
    
    closed(){
            if(this.props.onComplete) {this.props.onComplete();}
    }

    render () {
        var classes = ClassNames(this.props.className, "double-wide");
        if(this.props.left) { classes += 'left';}
        if(this.props.right) { classes += 'right'; }
        if(this.props.expanded) { classes +='expanded'; }
        if(this.props.closed) {
            classes += 'closed'; 
            if(this.props.onComplete){
                setTimeout(this.closed.bind(this), 500);
            }
        }
        return (
        <section className={classes} ref="double" onClick={this.onClick} >
            { this.props.children }
        </section>
        );
    }
}

export default DoubleWide;