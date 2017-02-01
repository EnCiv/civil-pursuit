'use strict';

import React from 'react';
import ReactDOM from 'react-dom';
import ClassNames from 'classnames';
import isEqual from 'lodash/isEqual';

//Item Visual State - lets other components change the visual state of an item. 
// For example 'collapsed' is a visual state.  But as we grow the use of Item we find that there are more visual states and we even want to change the visual state of an item based on it's depth.

class VisualState extends React.Component {

    state = { vs: {}};

    toChild=null;

    static vsDistance = { // state to be in based on child state and distance from the state change  null means don't change
        collapsed: ['collapsed', null ],  // not visible
        minified: ['minified', null],                      // a portion of the title or an icon is rendered
        title: ['title', null],                                  // just the title content is rendered
        truncated: ['truncated', null],               // rendered with text / infor truncated to fit in a standard height
        open: ['open', 'open', null ]                                           // everything is rendered
    }

    toMeFromChild(vs) {
 //       console.info("VisualState.toMeFromChild");
        if (vs.toChild) { this.toChild = vs.toChild }  // child is passing up her func
        if (vs.state) { // child is passing up her state and your distance from it starting at 0
            const vsDistance=VisualState.vsDistance;
            const distance=vs.distance || 0;
            let newState = null;
            if (vsDistance[vs.state]) {
                let last = Math.max(vsDistance[vs.state].length - 1, 0);
                newState = vsDistance[vs.state][Math.min(vs.distance,last)];
                if(!newState) newState=this.state.vs.state;
            } else { newState = vs.state } // if you don't know the state, just pass it on
            var changeState=Object.assign({}, this.state.vs, vs, {state: newState, distance: distance} );
            if(changeState.state !== this.state.vs.state)
            { // if the state has changed
                 this.setState({vs: changeState});
                 if(this.props.vs.toParent){
                     this.props.vs.toParent(Object.assign({},changeState,{distance: distance +1}))
                 }
            }
        }
    }


    toMeFromParent(vs) {
//        console.info("VisualState.toMeFromParent");
        if (vs) { // parent is giving you a new state
            if(isEqual(this.state.vs,vs)) return; // no need cause a render if equal
            this.setState({vs: Object.assign({}, this.state.vs, vs)});
        }
    }

    constructor(props) {
        super(props);
//        console.info("VisualState constructor");
        this.state.vs=Object.assign({}, 
            {   state: 'truncated',
            }, 
            this.props.vs,
            {    depth: (this.props.vs && this.props.vs.depth) ? this.props.vs.depth : 0,
                toParent: this.toMeFromChild.bind(this)
            }
        );
        this.toChild=null;
    }

    renderChildren() {
        return React.Children.map(this.props.children, child =>
            React.cloneElement(child, Object.assign({}, this.props, this.state))  //vs in state override vs in props
        );
    }

    componentDidMount(){
        if (this.props.vs.toParent) {
            this.props.vs.toParent(Object.assign({}, this.props.vs, {state: null}, { toChild: this.toMeFromParent.bind(this) }))
        } // give parent your func so you can get state changes 
    }

    /** 
        componentWillReceiveProps(newProps){
            const newState=newProps.vs.state || null;
            const distance = newProps.vs.distance || 0;
            var stateChange={vs: Object.assign({}, this.state.vs,  newProps.vs, {state: newState, distance: distance})}
            if(this.state.vs != stateChange.vs){
                this.setState(stateChange)
            }
        }
    **/


    //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

    render() {
        const children = this.renderChildren();
//        console.info("VisualState render");

        return (
            <section>
                {children}
            </section>
        );
    }
}

export default VisualState;

