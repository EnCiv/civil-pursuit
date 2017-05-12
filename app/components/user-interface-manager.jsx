'use strict';

import React from 'react';
import ReactDOM from 'react-dom';
import ClassNames from 'classnames';
//import isEqual from 'lodash/isEqual';
import union from 'lodash/union';
//import cloneDeep from 'lodash/cloneDeep';
import shallowequal from 'shallowequal';


// for comparing UIM states, we use equaly.  If a property in two objects is logically false in both, the property is equal.  This means that undefined, null, false, 0, and '' are all the same.
// and we make a deep compare
var equaly=function(a,b){
            if(!a && !b) return true; //if both are false, they are the same
            let t=typeof a;
            if(t !== typeof b) return false; // if not falsy and types are not equal, they are not equal
            if(t === 'object') return union(Object.keys(a),Object.keys(b)).every(k=>equaly(a[k],b[k])); // they are both objects, break them down and compare them
            if(t === 'function') return true; //treat functions are equal no matter what they are
            if(a && b) return a==b; // if both are truthy are they equal
            return false;
        }


//Item Visual State - lets other components change the visual state of an item. 
// For example 'collapsed' is a visual state.  But as we grow the use of Item we find that there are more visual states and we even want to change the visual state of an item based on it's depth.

class UserInterfaceManager extends React.Component {

    constructor(props) {
        super(props);
        logger.info("UserInterfaceManager constructor, parent:", this.props.uim);
        this.toChild=null;
        if(typeof UserInterfaceManager.path === 'undefined') { // this is the root UserInterfaceManager
             UserInterfaceManager.path= this.props.path || [];
             this.path = this.props.rootPath || '/';
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
                    logger.info("UserInterfaceManger.toChildFromParent path being removed clear children", this.state.uim.pathPart.join('/'))
                    if(this.toChild) this.toChild({type:"CLEAR_PATH"});
                    //UserInterfaceManager.path.splice(nextUIM.pathDepth); // clear path after this point
                    //nextUIM.pathDepth=-1;  // 0 would be valid, mark depth as invalid
                } else if(!(this.state.uim.pathPart && this.state.uim.pathPart.length) && (nextUIM.pathPart && nextUIM.pathPart.length)) { // path being added
                    // var stateStack={stateStack: this.toMeFromChild({type: "GET_STATE"})};  // recursively call me to get my state stack
                    //var oldPath='/'+UserInterfaceManager.path.join('/');
                    //logger.info("UserInterfaceManager replaceState",{stateStack}, {oldPath});
                    //window.history.replaceState(stateStack,'', oldPath); // in the initial case this is the history, after that, it's an update
                    //nextUIM.pathDepth=UserInterfaceManager.path.length;
                    //UserInterfaceManager.path.push(...nextUIM.pathPart);
                    //var newPath='/'+UserInterfaceManager.path.join('/');
                    //var nextStack=cloneDeep(stateStack);
                    //stateStack.stateStack[nextStack.stateStack.length-1]=nextUIM; // replace the last UIM state with the new one
                    //window.history.pushState(stateStack,"",newPath);
                    logger.info("UserInterfaceManger.toChildFromParent path being added", nextUIM.pathPart.join('/'))
                } else { // pathPart and nexUI.pathpart are both have length
                    if(!equaly(this.state.uim.pathPart,nextUIM.pathPart)) logger.error("can't change pathPart in the middle of a path", this.state.uim, nextUIM);
                }
                
                if(this.props.uim && this.props.uim.toParent){
                    const distance= (action.type === "CHILD_SHAPE_CHANGED") ? action.distance+1 : 1;
                    this.setState({uim: nextUIM}, ()=>this.props.uim.toParent({type: "CHILD_SHAPE_CHANGED", shape: nextUIM.shape, distance: distance}));
                }else{ // this is the root, after changing shape, remind me so I can update the window.histor
                    this.setState({uim: nextUIM}, ()=>this.updateHistory());
                }
                //if(!equaly(nextUIM,this.state.uim)){ // if anything in the state has changed
                //    if(nextUIM.shape !== this.state.uim.shape && this.props.uim && this.props.uim.toParent) { // if the shape has changed and we are not the root
                //        const distance= (action.type === "CHILD_SHAPE_CHANGED") ? action.distance+1 : 1;
                //        this.setState({uim: nextUIM}, ()=>this.props.uim.toParent({type: "CHILD_SHAPE_CHANGED", shape: nextUIM.shape, distance: distance}));
                //    } else
                //        this.setState({uim: nextUIM});  // just update the state
                //}else {
                //    if(action.type === "CHILD_SHAPE_CHANGED" && this.props.uim && this.props.uim.toParent)
                //        this.props.uim.toParent({type: "CHILD_SHAPE_CHANGED", shape: action.shape, distance: action.distance+1})
                //}
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
                    this.setState({uim: nextUIM}, ()=>this.updateHistory());
            } // no change, nothing to do
        } else if(action.type==="CHILD_SHAPE_CHANGED"){
            if(this.props.uim && this.props.uim.toParent) this.props.uim.toParent({type: "CHILD_SHAPE_CHANGED", shape: action.shape, distance: action.distance+1}); // pass a new action, not a copy including internal properties like itemId
            else { // this is the root UIM, update history.state
                this.updateHistory();
            }
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
            }else if(this.toChild) this.toChild({type: "CLEAR_PATH"}); // at the end of the new state, deeper states should be reset
            this.setState({uim: action.event.state.stateStack[depth]});
            return null;
        } else if (action.type==="GET_STATE") {
            // return the array of all UIM States from the top down - with the top at 0 and the bottom at the end
            // it works by recursivelly calling GET_STATE from here to the end and then unshifting the UIM state of each component onto an array
            // the top UIM state of the array is the root component
            logger.info("UserInterfaceManager.toMeFromParent:GET_STATE",{action}, {state: this.state});
            let stack;
            if(!this.toChild) return [Object.assign({},this.state.uim)];
            else stack=this.toChild(action);
            if(stack) stack.unshift(Object.assign({},this.state.uim)); // if non-uim child is at the end, it returns null
            else stack=[Object.assign({},this.state.uim)];
            return stack;
        } else if(action.type==="CLEAR_PATH") {  // clear the path and reset the UIM state back to what the constructor would
            if(this.toChild) this.toChild(action); // clear children first
            this.setState(this.getDefaultState()); // after clearing thechildren clear this state
            return null;
        } else if(action.type==="RESET_SHAPE") {  // clear the path and reset the UIM state back to what the constructor would
            this.setState(this.getDefaultState()); // after clearing thechildren clear this state
            return null;
        }else if(action.type==="CHANGE_SHAPE"){ // change the shape if it needs to be changed
            Object.assign(nextUIM,this.getDefaultState().uim,{shape: action.shape}); // 
            this.setState({uim: nextUIM});
            return null;
        }else {
            logger.error("UserInterfaceManager.toMeFromParent: Unknown Action",{action}, {state: this.state});
            this.toChild(action);
            return null;
        }
    }

    updateHistory() {
        logger.info("UserInterfaceManager.updateHistory");
        if(this.props.uim && this.props.uim.toParent) logger.error("UserInterfaceManager.updateHistory called but not from root", this.props.uim);
        var stateStack = { stateStack: this.toMeFromParent({ type: "GET_STATE" }) };  // recursively call me to get my state stack
        var curPath = stateStack.stateStack.reduce((acc, cur) => { // parse the state to build the curreent path
            if (cur.pathPart && cur.pathPart.length) acc.push(...cur.pathPart);
            return acc;
        }, []);
        curPath = '/' + curPath.join('/');
        if (curPath !== window.location.pathname) { // push the new state and path onto history
            logger.info("UserInterfaceManager.toMeFromParent pushState", { stateStack }, { curPath });
            window.history.pushState(stateStack, '', curPath);
        } else { // update the state of the current history
            logger.info("UserInterfaceManager.toMeFromParent replaceState", { stateStack }, { curPath });
            window.history.replaceState(stateStack, '', curPath); //update the history after changes have propogated among the children
        }
        return null;
    }

    componentDidUpdate(){
        logger.info("UserInterfaceManager.componentDidUpdate");
        if(!(this.props.uim && this.props.uim.toParent)) this.updateHistory(); // only do this if the root
    }

    /***  don't rerender if no change in state, props don't matter if it didn't change the state. ****/
    shouldComponentUpdate(newProps, newState) {
        if(!equaly(this.state,newState)) {logger.info("UserInterfaceManager.shouldComponentUpdate yes state", this.props.uim && this.props.uim.depth, this.state,newState); return true;}
        if(!shallowequal(this.props, newProps)) {logger.info("UserInterfaceManager.shouldComponentUpdate yes props", this.props.uim && this.props.uim.depth, this.props, newProps); return true;}
        logger.info("UserInterfaceManager.shouldComponentUpdate no", this.props.uim && this.props.uim.depth, this.props, newProps, this.state, newState);
        return false;
    }

    renderChildren() {
        return React.Children.map(this.props.children, child =>
            React.cloneElement(child, Object.assign({}, this.props, 
                        {uim: Object.assign({}, this.state.uim, {depth: this.props.uim && this.props.uim.depth ? this.props.uim.depth +1 : 1, toParent: this.toMeFromChild.bind(this)})}  //uim in state override uim in props
        )));
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

