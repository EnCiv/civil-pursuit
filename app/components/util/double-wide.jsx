'use strict';

import React                    from 'react';
import ClassNames          from 'classnames';

class DoubleWide extends React.Component {
    
    closed(){
            if(this.props.onComplete) {this.props.onComplete();}
    }

    render () {
        var classes = ClassNames( 
            this.props.className, 
            'double-wide',
            {   
                'left': this.props.left,
                'right': this.props.right,
                'expanded': this.props.expanded,
                'closed': this.props.closed
            } );
        if(this.props.closed) {
            if(this.props.onComplete){
                setTimeout(this.closed.bind(this), 500);
            }
        }
        return (
            <section className={classes} onClick={this.props.onClick} >
                { this.props.children }
            </section>
        );
    }
}

export default DoubleWide;