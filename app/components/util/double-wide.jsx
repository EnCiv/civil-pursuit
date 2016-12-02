'use strict';

import React                    from 'react';
import ClassNames          from 'classnames';

class DoubleWide extends React.Component {
    
    state={raised: false, expanded: false}

    closed(){
            if(this.props.onComplete) {this.props.onComplete();}
    }

    componentWillReceiveProps(newProps){
        if(!this.props.expanded && newProps.expanded){
            this.setState({raised: true});
        }else if(this.props.expanded && !newProps.expanded){
            this.setState({expanded: false});
        }
    }

    componenetDidUpdate() {
        if(this.state.raised && this.props.expanded && !this.state.expanded ){
            this.setState({expanded: true});
        }else if(this.state.raised && ! this.props.expanded && !this.state.expanded) {
            setTimeout(this.contracted.bind(this), 500);
        }
    }

    contracted(){
        this.setState({raised: false});
    }


    render () {
        var classes = ClassNames( 
            this.props.className, 
            'double-wide',
            {   
                'left': this.props.left,
                'right': this.props.right,
                'raised': this.state.raised,
                'expanded': this.state.expanded,
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