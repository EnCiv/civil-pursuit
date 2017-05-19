'use strict';

import React from 'react';
import ReactDOM from 'react-dom';
import ClassNames from 'classnames';
import union from 'lodash/union';
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


//User Interface Manager - manages the state of react components that interact with each other and change state based user interactions and interactions between stateful components.
//Components communicate through the uim object, which is passed between them.  The basic component is
//uim={shape: a string representing a shape.  You can have any shapes you want, this is using 'truncated', 'open' and 'collapsed' but this can be upto the implementation.  But all components will need to understand these shapes
//     depth: the distance of the component from the root (first) component.
//     toParent: the function to call to send 'actions' to the parent function
//     each child component can add more properties to it's state, through the actionToState function
//     }
//
export class UserInterfaceManager extends React.Component {

    constructor(props) {
        super(props);
        logger.info("UserInterfaceManager constructor, parent:", this.props.uim);
        this.toChild=null;
        this.childName='';
        if(!(this.props.uim && this.props.uim.toParent)){
            if(typeof UserInterfaceManager.nextId !== 'undefined') logger.error("UserInterfaceManager.constructor no parent, but not root!");
        }else{
            this.props.uim.toParent({type: "SET_TO_CHILD", function: this.toMeFromParent.bind(this), name: "UserInterfaceManager"});
        }
        // not an else of above because of the possibility that one might want to put a uim and toParent before the first component
        if(typeof UserInterfaceManager.nextId === 'undefined') { // this is the root UserInterfaceManager
             UserInterfaceManager.nextId= 0;
             if(this.props.path && this.props.path !== '/'){
                UserInterfaceManager.pathPart= this.props.path.split('/');
                var root=(this.props.UIMRoot || '/h/').split('/');
                while(!UserInterfaceManager.pathPart[UserInterfaceManager.pathPart.length-1]) UserInterfaceManager.pathPart.pop(); // '/'s at the end translate to null elements, remove them
                while(!root[root.length-1]) root.pop(); // '/'s at the end translate to null elements, remove them
                if(root.some(part=>part!==UserInterfaceManager.pathPart.shift())) {logger.error("UserInterfaceManager.componentDidMount path didn't match props", root, UserInterfaceManager.pathPart )}
             }else UserInterfaceManager.pathPart=[];
             if(typeof window !== 'undefined'){ // if we are running on the browser
                window.onpopstate=this.onpopstate.bind(this);
                if(UserInterfaceManager.pathPart.length===0) setTimeout(()=>this.updateHistory(),0); // aftr things have settled down, update history for the first time
             }
        }
        this.id=UserInterfaceManager.nextId++; // get the next id
        this.state=this.getDefaultState();
    }

    // consistently get the default state from multiple places
    getDefaultState(){
        return {uim: {
            shape: this.props.uim && this.props.uim.shape ? this.props.uim.shape : 'truncated',
            depth: this.props.uim ? this.props.uim.depth : 0  // for debugging  - this is my depth to check
        }}
    }

    // handler for the window onpop state
    // only the root UserInterfaceManager will set this 
    // it works by recursively passing the ONPOPSTATE action to each child UIM component starting with the root
    onpopstate(event){
        logger.info("UserInterfaceManager.onpopstate", this.id, {event})
        if(event.state && event.state.stateStack) this.toMeFromParent({type: "ONPOPSTATE", event: event});
    }

    toMeFromChild(action) {
        logger.info("UserInterfaceManager.toMeFromChild", this.id, this.props.uim && this.props.uim.depth, this.childName, action);
        if(!action.distance) action.distance=0; // action was from component so add distance
        if(action.type==="SET_TO_CHILD") { // child is passing up her func
            this.toChild = action.function; 
            if(action.name) this.childName=action.name; 
            if((typeof window !== 'undefined') && this.id===0 && UserInterfaceManager.pathPart.length ){ // this is the root and we are on the browser and there is at least one pathPart
                logger.info("UserInterfaceManager.toMeFromChild will SET_PATH to",UserInterfaceManager.pathPart);
                setTimeout(()=>this.toChild({type: "SET_PATH", part: UserInterfaceManager.pathPart.shift()}),0); // this starts after the return toChild so it completes.
            }
            return null;
        } else if (action.type==="SET_ACTION_TO_STATE") { // child component passing action to state calculator
            this.actionToState = action.function; return null;
        } else if (action.type==="GET_STATE") {
            // return the array of all UIM States from here to the beginning
            // it works by recursivelly calling GET_STATE from here to the beginning and then pusing the UIM state of each component onto an array
            // the top UIM state of the array is the root component, the bottom one is that of the UIM that inititated the call
            let thisUIM=Object.assign({}, this.state.uim);
            if(!(this.props.uim && this.props.uim.toParent)) { // return the uim state of the root  as an array of 1
                return [thisUIM]; 
            }
            else {
                var stack=this.props.uim.toParent({type: "GET_STATE", distance: action.distance+1});
                logger.info("UserInterfaceManager.toMeFromChild:GET_STATE got",  this.id, stack);
                stack.push(thisUIM); // push this uim state to the uim state list and return it
                return stack;
            }
        }else if (action.type==="SET_STATE_AND_CONTINUE"){
            if(UserInterfaceManager.pathPart.length) {
                logger.info("UserInterfaceManager.toMeFromChild SET_STATE_AND_CONTINUE to SET_PATH", this.id, this.props.uim && this.props.uim.depth, action.nextUIM);
                this.setState({uim: Object.assign({},this.state.uim, action.nextUIM)},()=>action.function({type: 'SET_PATH', part: UserInterfaceManager.pathPart.shift()}));
            } else {
                logger.info("UserInterfaceManager.toMeFromChild SET_STATE_AND_CONTINUE last one", this.id, this.props.uim && this.props.uim.depth, this.state.uim, action.nextUIM);
                this.setState({uim: Object.assign({},this.state.uim, action.nextUIM)}, ()=>{ if(this.id!==0) this.props.uim.toParent({type: "SET_PATH_COMPLETE"}); else this.updateHistory() });
            }
            return null;
        }else if(action.type==="SET_PATH_COMPLETE") {
            if(this.id!==0) return this.props.uim.toParent({type: "SET_PATH_COMPLETE"});
            else return this.updateHistory();
        }else if(this.actionToState) {
            var  nextUIM= this.actionToState(action, this.state.uim);
            if(nextUIM) {
                if((this.state.uim.pathPart && this.state.uim.pathPart.length) && !(nextUIM.pathPart && nextUIM.pathPart.length)) {  // path has been removed
                    logger.info("UserInterfaceManger.toChildFromParent path being removed clear children", this.id, this.state.uim.pathPart.join('/'))
                    if(this.toChild) this.toChild({type:"CLEAR_PATH"});
                } else if(!(this.state.uim.pathPart && this.state.uim.pathPart.length) && (nextUIM.pathPart && nextUIM.pathPart.length)) { // path being added
                    logger.info("UserInterfaceManger.toChildFromParent path being added", this.id, nextUIM.pathPart.join('/'))
                } else { // pathPart and nexUI.pathpart are both have length
                    if(!equaly(this.state.uim.pathPart,nextUIM.pathPart)) logger.error("can't change pathPart in the middle of a path", this.state.uim, nextUIM);
                }
                
                if(this.props.uim && this.props.uim.toParent){
                    const distance= (action.type === "CHILD_SHAPE_CHANGED") ? action.distance+1 : 1;
                    this.setState({uim: nextUIM}, ()=>this.props.uim.toParent({type: "CHILD_SHAPE_CHANGED", shape: nextUIM.shape, distance: distance}));
                }else{ // this is the root, after changing shape, remind me so I can update the window.histor
                    if(equaly(this.state.uim,nextUIM)) setTimeout(()=>this.updateHistory(),0); // if no change update history
                    else this.setState({uim: nextUIM}); // otherwise, set the state and let history update on componentDidUpdate
                }
                return null;
            }else logger.info("UserInterfaceManager.toMeFromChild actionToState returned null");
        } else logger.error("UserInterfaceManager.toMeFromChild this.actionToState is missing"); 
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
            logger.info("UserInterfaceManager.toMeFromChild CHILD_SHAPE_CHANGED not handled by actionToState",this.id, this.props.uim &&  this.props.depth);
            if(this.id!==0) {   
                logger.info("UserInterfaceManager.toMeFromChild CHILD_SHAPE_CHANGED not handled by actionToState not root",this.id, this.props.uim &&  this.props.depth);
                this.props.uim.toParent({type: "CHILD_SHAPE_CHANGED", shape: action.shape, distance: action.distance+1}); // pass a new action, not a copy including internal properties like itemId
            } else { // this is the root UIM, update history.state
                logger.info("UserInterfaceManager.toMeFromChild CHILD_SHAPE_CHANGED not handled by actionToState at root",this.id, this.props.uim &&  this.props.depth);
                setTimeout(()=>this.updateHistory(),0);
            }
        }
        return null;
    }

    toMeFromParent(action) {
        logger.info("UserInterfaceManager.toMeFromParent", this.id, this.props.uim && this.props.uim.depth, this.childName, {action});
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
        logger.info("UserInterfaceManager.updateHistory",  this.id);
        if(typeof window === 'undefined') { logger.info("UserInterfaceManager.updateHistory called on servr side, ignoring"); return; }
        if(this.props.uim && this.props.uim.toParent) logger.error("UserInterfaceManager.updateHistory called but not from root", this.props.uim);
        var stateStack = { stateStack: this.toMeFromParent({ type: "GET_STATE" }) };  // recursively call me to get my state stack
        var curPath = stateStack.stateStack.reduce((acc, cur) => { // parse the state to build the curreent path
            if (cur.pathPart && cur.pathPart.length) acc.push(...cur.pathPart);
            return acc;
        }, []);
        curPath = (this.props.UIMRoot || '/h/') + curPath.join('/');
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
        logger.info("UserInterfaceManager.componentDidUpdate", this.id, this.props.uim && this.props.uim.depth, this.childName);
        if(!(this.props.uim && this.props.uim.toParent) && UserInterfaceManager.pathPart.length===0) setTimeout(()=>this.updateHistory(),0); // only do this if the root, only if not processing a pathPart, and do it after the current queue has completed
    }

    /***  don't rerender if no change in state or props, use a logically equivalent check for state so that undefined and null are equivalent. Make it a deep compare in case apps want deep objects in their state ****/
    shouldComponentUpdate(newProps, newState) {
        if(!equaly(this.state,newState)) {logger.trace("UserInterfaceManager.shouldComponentUpdate yes state", this.id, this.props.uim && this.props.uim.depth, this.childName,  this.state,newState); return true;}
        if(!shallowequal(this.props, newProps)) {logger.trace("UserInterfaceManager.shouldComponentUpdate yes props", this.id, this.props.uim && this.props.uim.depth, this.childName, this.props, newProps); return true;}
        logger.trace("UserInterfaceManager.shouldComponentUpdate no", this.id, this.props.uim && this.props.uim.depth, this.childName,  this.props, newProps, this.state, newState);
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
        logger.info("UserInterfaceManager render", this.id);

        return (
            <section>
                {children}
            </section>
        );
    }
}

export default UserInterfaceManager;

export class UserInterfaceManagerClient extends React.Component {

  constructor(props, keyField) {
    super(props);
    logger.info("UserInterfaceManagerClient.constructor", props, this.props);
    this.toChild = [];
    this.keyField = keyField || 'key'; // the default key field, can be overridden by children to make their code easier to read
    if (this.props.uim.toParent) {
      this.props.uim.toParent({ type: 'SET_ACTION_TO_STATE', function: this.actionToState.bind(this) });
      this.props.uim.toParent({ type: "SET_TO_CHILD", function: this.toMeFromParent.bind(this), name: "Items" })
    }
  }

  //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
  // this is a one to many pattern for the user interface manager,insert yourself between the UIM and each child
  // send all unhandled actions to the parent UIM
  //
  toMeFromChild(key, action) {
    logger.info(" UserInterfaceManagerClient.toMeFromChild", this.props.uim && this.props.uim.depth, key, action);
    if (action.type === "SET_TO_CHILD") { // child is passing up her func
      this.toChild[key] = action.function; // don't pass this to parent
      if (this.waitingOn) {
        if (this.waitingOn.action) {
          let actn = this.waitingOn.action; // don't overload action
          logger.info("UserInterfaceManagerClient.toMeFromChild got waitingOn action", actn);
          this.waitingOn = null;
          setTimeout(() => this.toChild[key](actn), 0);
        } else if (this.waitingOn.nextUIM) {
          let nextUIM = this.waitingOn.nextUIM;
          if (key === nextUIM[this.keyField] && this.toChild[key]) {
            logger.info("UserInterfaceManagerClient.toMeFromParent got waitingOn nextUIM", nextUIM);
            this.waitingOn = null;
            setTimeout(() => this.props.uim.toParent({ type: "SET_STATE_AND_CONTINUE", nextUIM: nextUIM, function: this.toChild[key] }), 0);
          }
        }
      }
    } else if (this.props.uim && this.props.uim.toParent) {
        action[this.keyField] = key; // actionToState may need to know the child's id
        return (this.props.uim.toParent(action));
    }
  }

  //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
  // this is a one to many pattern for the user Interface Manager, handle each action  appropriatly
  //
  toMeFromParent(action) {
    logger.info("UserInterfaceManagerClient.toMeFromParent", this.props.uim && this.props.uim.depth, action);
    if (action.type === "ONPOPSTATE") {
      var { shape } = action.event.state.stateStack[this.props.uim.depth - 1];  // the button was passed to the parent UIManager by actionToState
      var key = action.event.state.stateStack[this.props.uim.depth - 1][this.keyField];
      if ((action.event.state.stateStack.length > (this.props.uim.depth))) {
        let sent = false;
        Object.keys(this.toChild).forEach(child => { // only child panels with UIM managers will have entries in this list. 
          if (child === key) { sent = true; this.toChild[child](action); }
          else this.toChild[child]({ type: "CHANGE_SHAPE", shape: shape === 'open' ? 'truncated' : shape }); // only one button panel is open, any others are truncated (but inactive)
        });
        if (key && !sent) logger.error("UserInterfaceManagerClient.toMeFromParent ONPOPSTATE more state but child not found", { depth: this.props.uim.depth }, { action });
      }
      return null;// this was the end of the line
    } else if (action.type === "GET_STATE") {
      key = this.props.uim[this.keyField] || null;
      if (key && this.toChild[key]) return this.toChild[key](action); // pass the action to the child
      else return null; // end of the line
    } else if (action.type === "CLEAR_PATH") {  // clear the path and reset the UIM state back to what the const
      Object.keys(this.toChild).forEach(child => { // send the action to every child
        this.toChild[child](action)
      });
    } else if (action.type === "SET_PATH") {
      const { nextUIM, setBeforeWait } = this.setPath(action);
      if (nextUIM[this.keyField]) {
        let key = nextUIM[this.keyField];
        if (this.toChild[key]) this.props.uim.toParent({ type: 'SET_STATE_AND_CONTINUE', nextUIM: nextUIM, function: this.toChild[key] }); // note: toChild of button might be undefined becasue ItemStore hasn't loaded it yet
        else if (setBeforeWait) {
          this.props.uim.toParent({
            type: 'SET_STATE_AND_CONTINUE', nextUIM: nextUIM, function: (action) => {
              if (this.toChild[this.props.uim[this.keyField]]) this.toChild[this.props.uim[this.keyField]](action)
              else this.waitingOn = action;
            }
          });
        } else {
          logger.info("UserInterfaceManagerClient.toMeFromParent SET_PATH waitingOn", nextUIM);
          this.waitingOn = nextUIM;
        }
      } else {
        this.props.uim.toParent({ type: 'SET_STATE_AND_CONTINUE', nextUIM: nextUIM, function: null });
      }
    } else logger.error("UserInterfaceManagerClient.toMeFromParent action type unknown not handled", action)
  }
}
