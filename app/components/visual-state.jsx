'use strict';

import React from 'react';
import ReactDOM from 'react-dom';
import ClassNames from 'classnames';

//Item Visual State - lets other components change the visual state of an item. 
// For example 'collapsed' is a visual state.  But as we grow the use of Item we find that there are more visual states and we even want to change the visual state of an item based on it's depth.

class VisualState extends React.Component {

    state = { vs: {state: null, distance: 0 }};

    toChild=null;

    static vsDistance = { // state to be in based on child state and distance from the state change  null means don't change
        collapsed: ['collapsed', null ],  // not visible
        minified: ['minified', null],                      // a portion of the title or an icon is rendered
        title: ['title', null],                                  // just the title content is rendered
        truncated: ['truncated', null],               // rendered with text / infor truncated to fit in a standard height
        open: ['open', 'open', null ]                                           // everything is rendered
    }

    toMeFromChild(vs) {
    console.info("VisualState.toMeFromChild", vs);
    const vsDistance=VisualState.vsDistance;
    const distance=vs.distance || 0;
    let newState = null;
        if (vs.toChild) { this.toChild = vs.toChild }  // child is passing up her func
        if (vs.state) { // child is passing up her state and your distance from it starting at 0
            if (vsDistance[vs.state]) {
                let last = Math.max(vsDistance[vs.state].length - 1, 0);
                newState = vsDistance[vs.state][Math.min(vs.distance,last)];
                if(!newState) newState=this.state.vs.state;
            } else { newState = vs.state } // if you don't know the state, just pass it on
            if ( newState && (this.state.vs.state !== newState)) { // if the state has changed
                 this.setState({vs: {state: newState, distance: vs.distance, toParent: this.state.vs.toParent}});
                }
            }
        }
    }

    toMeFromParent(vs) {
        if (vs.state) { // parent is giving you a new state
            if(this.state.vs.state !== vs.state) this.setState({vs: {state: vs.state, distance: 0, toParent: this.state.vs.toParent}});
        }
    }

    constructor(props) {
        super(props);
        console.info("VisualState constructor", props);
        if (this.props.vs.state) { this.state.vs.state = this.props.vs.state }  // set the initial state
        if (this.props.vs.depth) { this.state.vs.depth = vs.depth + 1 }
        this.state.vs.toParent = this.toMeFromChild.bind(this);
        this.toChild=null;
        

    }

    renderChildren() {
        return React.Children.map(this.props.children, child =>
            React.cloneElement(child, Object.assign({}, this.props, this.state))  //vs in state override vs in props
        );
    }

    componentDidMount(){
        if (this.props.vs.toParent) {
            this.props.vs.toParent({ toChild: this.toMeFromParent.bind(this) })
        } // give parent your func so you can get state changes
    }

    componentWillReceiveProps(newProps){
        if(this.props.vs.state != newProps.vs.state){
            if (this.props.vs.toParent) {
                this.setState({vs: {state: newState}}, () => {this.props.vs.toParent({state: newState, distance: 0} )})
            } else { this.setState({vs: {state: newState}});}
        }
    }


    //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

    render() {
        const children = this.renderChildren();
        console.info("VisualState render", this.props, this.state);

        return (
            <section>
                {children}
            </section>
        );
    }
}

export default VisualState;
