'use strict';

import React from 'react';
import ReactDOM from 'react-dom';
import ClassNames from 'classnames';
import isEqual from 'lodash/isEqual';
import isEqualWith from 'lodash/isEqualWith';


//Item Visual State - lets other components change the visual state of an item. 
// For example 'collapsed' is a visual state.  But as we grow the use of Item we find that there are more visual states and we even want to change the visual state of an item based on it's depth.

class UserInterfaceManager extends React.Component {

    constructor(props) {
        super(props);
        logger.info("UserInterfaceManager constructor, parent:", this.props.uim);
        this.toChild=null;
        if(typeof UserInterfaceManager.path === 'undefined') { // this is the root UserInterfaceManager
             UserInterfaceManager.path= this.props.path || [];
             window.onpopstate=this.onpopstate.bind(this);
        }
        this.state=this.getDefaultState();
        if (this.props.uim && this.props.uim.toParent) {
            this.props.uim.toParent({type: "SET_TO_CHILD", function: this.toMeFromParent.bind(this), name: "UserInterfaceManager"});
        }
        logger.info("UserInterfaceManager constructor, state", this.state);
    }

    // consistently get the default state from multiple places
    getDefaultState(){
        return {uim: {
            shape: this.props.uim && this.props.uim.shape ? this.props.uim.shape : 'truncated',
            depth: this.props.uim ? this.props.uim.depth : 0,  // for debugging  - this is my depth to check
            name: (this.state && this.state.uim) && this.state.uim.name // this is for debugging the name or undefined
        }}
    }

    // handler for the window onpop state
    // only the root UserInterfaceManager will set this 
    // it works by recursively passing the ONPOPSTATE action to each child UIM component starting with the root
    onpopstate(event){
        logger.info("UserInterfaceManager.onpopstate", {event})
        if(event.state && event.state.stateStack) this.toMeFromParent({type: "ONPOPSTATE", event: event});
    }

    toMeFromChild(action) {
        logger.info("UserInterfaceManager.toMeFromChild",this.props.uim && this.props.uim.depth, action);
        if(!action.distance) action.distance=0; // action was from component so add distance
        if (action.type==="SET_TO_CHILD") { this.toChild = action.function; if(action.name) this.setState({uim: Object.assign({},this.state.uim,{name: action.name})}); return null; }  // child is passing up her func
        else if (action.type==="SET_ACTION_TO_STATE") {this.actionToState = action.function; return null;} // child component passing action to state calculator
        else if (action.type==="GET_STATE") {
            // return the array of all UIM States from here to the beginning
            // it works by recursivelly calling GET_STATE from here to the beginning and then pusing the UIM state of each component onto an array
            // the top UIM state of the array is the root component, the bottom one is that of the UIM that inititated the call
            logger.info("UserInterfaceManager.toMeFromChild:GET_STATE",{action}, {state: this.state});
            let thisUIM=Object.assign({}, this.state.uim);
            if(!(this.props.uim && this.props.uim.toParent)) { // return the uim state of the root  as an array of 1
                logger.info("UserInterfaceManaer GET_STATE at root",thisUIM);
                return [thisUIM]; 
            }
            else {
                var stack=this.props.uim.toParent({type: "GET_STATE", distance: action.distance+1});
                logger.info("UserInterfaceManager.toMeFromChild:GET_STATE got", stack);
                stack.push(thisUIM); // push this uim state to the uim state list and return it
                return stack;
            }
        }
        else if(this.actionToState) {
            var  nextUIM= this.actionToState(action,this.state.uim);
            if(nextUIM) {
                if((this.state.uim.pathPart && this.state.uim.pathPart.length) && !(nextUIM.pathPart && nextUIM.pathPart.length)) {  // path has been removed
                    if(this.toChild) this.toChild({type:"CLEAR_PATH"});
                    UserInterfaceManager.path.splice(nextUIM.pathDepth); // clear path after this point
                    nextUIM.pathDepth=-1;  // 0 would be valid, mark depth as invalid
                } else if(!(this.state.uim.pathPart && this.state.uim.pathPart.length) && (nextUIM.pathPart && nextUIM.pathPart.length)) { // path being added
                    var stateStack={stateStack: this.toMeFromChild({type: "GET_STATE"})};  // recursively call me to get my state stack
                    var oldPath='/'+UserInterfaceManager.path.join('/');
                    logger.info("UserInterfaceManager replaceState",{stateStack}, {oldPath});
                    window.history.replaceState(stateStack,'', oldPath);
                    nextUIM.pathDepth=UserInterfaceManager.path.length;
                    UserInterfaceManager.path.push(...nextUIM.pathPart);
                    var newPath='/'+UserInterfaceManager.path.join('/');
                    window.history.pushState({},"",newPath);
                } else { // pathPart and nexUI.pathpart are both have length
                    if(!isEqual(this.state.uim.pathPart,nextUIM.pathPart)) logger.error("can't change pathPart in the middle of a path", this.state.uim, nextUIM);
                }
                if(!isEqual(nextUIM,this.state.uim)){ // if anything in the state has changed
                    if(nextUIM.shape !== this.state.uim.shape) { // if the shape has changed (like a button or an ItemId)
                        if(this.props.uim && this.props.uim.toParent){
                            const distance= (action.type === "CHILD_SHAPE_CHANGED") ? action.distance+1 : 1;
                            this.setState({uim: nextUIM}, ()=>this.props.uim.toParent({type: "CHILD_SHAPE_CHANGED", shape: nextUIM.shape, distance: distance}));
                        } else
                            this.setState({uim: nextUIM});
                    } else
                        this.setState({uim: nextUIM});  // just update the state
                }else {
                    if(action.type === "CHILD_SHAPE_CHANGED" && this.props.uim && this.props.uim.toParent)
                        this.props.uim.toParent({type: "CHILD_SHAPE_CHANGED", shape: action.shape, distance: action.distance+1})
                }
                return null;
            }
        } 
        // these actions are overridden by the component's actonToState if either there isn't one or it returns a null next state
        if(action.type ==="CHANGE_SHAPE"){
            if(this.state.uim.shape!==action.shape){ // really the shape changed
                var nextUIM=Object.assign({}, this.state.uim, {shape: action.shape});
                if(this.props.uim && this.props.uim.toParent) {// if there's a parent to tell of the change
                    this.setState({uim: nextUIM}, ()=>this.props.uim.toParent({type: "CHILD_SHAPE_CHANGED", shape: action.shape, distance: 1}));
                }else // no parent to tell of the change
                    this.setState({uim: nextUIM});
            } // no change, nothing to do
        } else if(action.type==="CHILD_SHAPE_CHANGED"){
            if(this.props.uim && this.props.uim.toParent) this.props.uim.toParent({type: "CHILD_SHAPE_CHANGED", shape: action.shape, distance: action.distance+1}); // pass a new action, not a copy including internal properties like itemId
        }
        return null;
    }

    toMeFromParent(action) {
        logger.info("UserInterfaceManager.toMeFromParent", this.props.uim && this.props.uim.depth, {action});
        var nextUIM={};
        if (action.type==="ONPOPSTATE") {
            let depth=(this.props.uim && this.props.uim.depth) ? this.props.uim.depth : 0;
            /* debug only */ if(action.event.state.stateStack[depth].depth !== depth) logger.error("UserInterfaceManager.toMeFromParent ONPOPSTATE stateStack depth not equal to depth",action.event.state.stateStack[depth],depth); // debugging info
            if(action.event.state.stateStack.length > (depth+1)){
                if(this.toChild) this.toChild(action);
                else logger.error("UserInterfaceManager.toMeFromParent ONPOPSTATE more stack but no toChild", {action}, {uim: this.props.uim});
            }
            this.setState({uim: action.event.state.stateStack[depth]});
            return null;
        } else if(action.type==="CLEAR_PATH") {  // clear the path and reset the UIM state back to what the constructor would
            if(this.toChild) this.toChild(action); // clear children first
            this.setState(this.getDefaultState()); // after clearing thechildren clear this state
            return null;
        } else if(action.type==="RESET_SHAPE") {  // clear the path and reset the UIM state back to what the constructor would
            this.setState(this.getDefaultState()); // after clearing thechildren clear this state
            return null;
        }else if(action.type==="CHANGE_SHAPE"){ // change the shape if it needs to be changed
            Object.assign(nextUIM,this.getDefaultState().uim,{shape: action.shape}); // 
            if(!isEqualWith(this.state.uim,nextUIM,(a,b)=>a==b)){  //undefined values in nextState are equivelent to this.state values that are null
            // don't set the state and cause a rerender if it hasn't changed
                this.setState({uim: nextUIM});
            }
        }else {
            this.toChild(action);
        }
    }

    renderChildren() {
        return React.Children.map(this.props.children, child =>
            React.cloneElement(child, Object.assign({}, this.props, 
                        {uim: Object.assign({}, this.state.uim, {depth: this.props.uim && this.props.uim.depth ? this.props.uim.depth +1 : 1, toParent: this.toMeFromChild.bind(this)})}  //uim in state override uim in props
        )));
    }

    /***  don't rerender if no change in state, props don't matter if it didn't change the state. ****/
    shouldComponentUpdate(newProps, newState) {
        logger.info("UserInterfaceManager.shouldComponentUpdate",this.state,newState);
    if (!isEqualWith(this.state,newState,(a,b)=>a==b)) return true;
    return false;
    }

    //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

    render() {
        const children = this.renderChildren();
        logger.info("UserInterfaceManager render");

        return (
            <section>
                {children}
            </section>
        );
    }
}

export default UserInterfaceManager;

