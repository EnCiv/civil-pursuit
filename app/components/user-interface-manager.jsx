'use strict';

import React from 'react';
import ReactDOM from 'react-dom';
import ClassNames from 'classnames';
import isEqual from 'lodash/isEqual';

//Item Visual State - lets other components change the visual state of an item. 
// For example 'collapsed' is a visual state.  But as we grow the use of Item we find that there are more visual states and we even want to change the visual state of an item based on it's depth.

class UserInterfaceManager extends React.Component {

    // return the array of all Visual States from here to the beginning
    // it works by recursivelly calling GET_STATE from here to the beginning and then pusing the UIM state of each component onto a array
    // the top UIM state of the array is the root component
    getState(newUIM){
        var nextUIM=Object.assign({},newUIM);
        if(this.props.uim && this.props.uim.toParent) {
            var result=this.props.uim.toParent({type: "GET_STATE"});
            logger.info("UserInterfaceManager.getState got", result);
            result.push(nextUIM);
            return result; // push this uim state to the uim state list and return it
        }
        else return([nextUIM]);
    }

    // handler for the window onpop state
    // only the root UserInterfaceManager will set this 
    // it works by recursively passing the ONPOPSTATE action to each child UIM component starting with the root
    onpopstate(event){
        logger.info("UserInterfaceManager.onopostate", {event})
        if(event.state && event.state.length) this.toMeFromParent({type: "ONPOPSTATE", event: event});
    }

    toMeFromChild(action) {
        logger.info("UserInterfaceManager.toMeFromChild",action);
        if (action.type==="SET_TO_CHILD") { this.toChild = action.function }  // child is passing up her func
        else if (action.type==="SET_ACTION_TO_STATE") {this.actionToState = action.function} // child component passing action to state calculator
        else if (action.type==="GET_STATE") {
            logger.info("UserInterfaceManager.toMeFromChild:GET_STATE",this.state.uim);
            if(!(this.props.uim && this.props.uim.toParent)) { // return the uim state of the root  as an array of 1
                var root=[Object.assign({}, this.state.uim)]; 
                logger.info("UserInterfaceManaer GET_STATE at root",root);
                return root; 
            }
            else {
                var result=this.props.uim.toParent({type: "GET_STATE"});
                logger.info("UserInterfaceManager.toMeFromChild:GET_STATE got", result);
                let nextUIM=Object.assign({},this.state.uim);
                result.push(nextUIM); // push this uim state to the uim state list and return it
                return result;
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
                    nextUIM.pathDepth=UserInterfaceManager.path.length;
                    UserInterfaceManager.path.push(...nextUIM.pathPart);
                } else { // pathPart and nexUI.pathpart are both have length
                    if(!isEqual(this.state.uim.pathPart,nextUIM.pathPart)) logger.error("can't change pathPart in the middle of a path", this.state.uim, nextUIM);
                }
                var stateStack={stateStack: this.getState(nextUIM)};
                var newPath= UserInterfaceManager.path.join('/');
                logger.info("UserInterfaceManager push history",{stateStack}, {newPath});
                window.history.pushState(stateStack,'', '/'+newPath);
                if(nextUIM.shape!==this.state.uim.shape && this.props.uim && this.props.uim.toParent)
                    this.setState({uim: nextUIM}, ()=>this.props.uim.toParent({type: "CHILD_SHAPE_CHANGED", shape: nextUIM.shape, distance: nextUIM.distance || 1}));
                else 
                    this.setState({uim: nextUIM});
                return;
            }
        }
        // these actions can be overridden by the component's actonToState
        if(action.type==="CHILD_SHAPE_CHANGED"){
            if(this.props.uim && this.props.uim.toParent) this.props.uim.toParent(Object.assign({}, action, {distance: action.distance+1}));
        }
    }


    toMeFromParent(action) {
        logger.info("UserInterfaceManager.toMeFromParent", action);
        var nextUIM;
        if (action.type==="ONPOPSTATE") {
            Object.assign(nextUIM,this.state.uim, action.event.state.stateStack[this.props.uim.depth]);
            var uiToChild = () => {if(action.event.state.stateStack.length > (this.props.uim.depth+1) && this.toChild) this.toChild({action});}
            if(isEqual(this.state.uim,nextUIM)){
                // no need to change state
                uiToChild();
            } else {
                // change the state and then pass to child
                this.setState(nextUIM, uiToChild);
            }
        } else if(action.type=="CLEAR_PATH") {  // clear the path and reset the UIM state back to what the const
            this.setState({uim: Object.assign({},
                this.state.uim, // preserve what's in the current uim state, that isn't overridden (external stuff perhaps)
                {shape: 'truncated'},
                this.props.uim,
                {   depth: (this.props.uim && this.props.uim.depth) ? this.props.uim.depth + 1 : 0
                },
                {pathPart: [], pathDepth: -1})}
                , ()=>{if(this.toChild) this.toChild(action)});
        } else if(action.type==="CHANGE_SHAPE"){
            this.setState({uim: Object.assign({},
                this.state.uim,
                {shape: action.shape}
            )});
        }else {
            this.toChild({action});
        }
    }

    constructor(props) {
        super(props);
        logger.info("UserInterfaceManager constructor, parent:", this.props.uim);
        this.toChild=null;
        if(typeof UserInterfaceManager.path === 'undefined') { // this is the root UserInterfaceManager
             UserInterfaceManager.path= this.props.path || [];
             window.onpopstate=this.onpopstate.bind(this);
        }
        this.state={uim: {
            shape: this.props.uim && this.props.uim.shape ? this.props.uim.shape : 'truncated',
            depth: this.props.uim ? this.props.uim.depth+1 : 0
        }};
        logger.info("UserInterfaceManager constructor, state", this.state);
    }

    renderChildren() {
        return React.Children.map(this.props.children, child =>
            React.cloneElement(child, Object.assign({}, this.props, {uim: Object.assign({}, this.state.uim, {toParent: this.toMeFromChild.bind(this)})}))  //uim in state override uim in props
        );
    }

    componentDidMount(){
        if (this.props.uim && this.props.uim.toParent) {
            this.props.uim.toParent({type: "SET_TO_CHILD", function: this.toMeFromParent.bind(this)});
        } // give parent your func so you can get state changes 
    }

/** 
    componentWillReceiveProps(newProps){
        props are the initial state only, prop changes are ignored after the component is constructed. 
        execpt - props will be checked again on a CLEAR_PATH action
    }
**/

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

