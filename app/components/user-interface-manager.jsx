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
        //console.info("UserInterfaceManager.constructor", this.constructor.name, this.props.uim, this.props.initialUIM);
        this.toChild=null;
        this.childName='';
        this.childTitle='';
        if(!(this.props.uim && this.props.uim.toParent)){
            if(typeof UserInterfaceManager.nextId !== 'undefined') logger.error("UserInterfaceManager.constructor no parent, but not root!");
        }else{
            this.props.uim.toParent({type: "SET_TO_CHILD", function: this.toMeFromParent.bind(this), name: "UserInterfaceManager"});
        }
        // not an else of above because of the possibility that one might want to put a uim and toParent before the first component
        if(typeof UserInterfaceManager.nextId === 'undefined') { // this is the root UserInterfaceManager
             UserInterfaceManager.nextId= 0;
             UserInterfaceManager.topState=null;
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
        return {uim: Object.assign({},
                    {   shape: this.props.uim && this.props.uim.shape ? this.props.uim.shape : 'truncated',
                        depth: this.props.uim ? this.props.uim.depth : 0  // for debugging  - this is my depth to check
                    },
                    this.props.initialUIM
                )
        }
    }

    // handler for the window onpop state
    // only the root UserInterfaceManager will set this 
    // it works by recursively passing the ONPOPSTATE action to each child UIM component starting with the root
    onpopstate(event){
        logger.trace("UserInterfaceManager.onpopstate", this.id, {event})
        if(event.state && event.state.stateStack) {
            UserInterfaceManager.topState="ONPOPSTATE";
            this.toMeFromParent({type: "ONPOPSTATE", event: event});
            console.info("UserInterfaceManager.onpopsate: returned.")
            UserInterfaceManager.topState=null;
        }
    }

    toMeFromChild(action) {
        console.info("UserInterfaceManager.toMeFromChild", this.id, this.props.uim && this.props.uim.depth, this.childName, this.childTitle, action, this.state.uim);
        var  nextUIM={};
        if(!action.distance) action.distance=0; // action was from component so add distance
        if(action.distance < 0) {action.distance +=1; if(this.id) return this.props.uim.toParent(action); else return }
        if(action.type==="SET_TO_CHILD") { // child is passing up her func
            this.toChild = action.function;
            if(action.name) this.childName=action.name;
            if(action.actionToState) this.actionToState=action.actionToState; 
            if((typeof window !== 'undefined') && this.id===0 && UserInterfaceManager.pathPart.length ){ // this is the root and we are on the browser and there is at least one pathPart
                console.info("UserInterfaceManager.toMeFromChild will SET_PATH to",UserInterfaceManager.pathPart);
                setTimeout(()=>{
                    UserInterfaceManager.topState="SET_PATH";
                    this.toChild({type: "SET_PATH", part: UserInterfaceManager.pathPart.shift()});
                },0); // this starts after the return toChild so it completes.
            }
        } else if (action.type==="SET_ACTION_TO_STATE") { // child component passing action to state calculator
            this.actionToState = action.function;
        } else if (action.type==="GET_STATE") {
            // return the array of all UIM States from here to the beginning
            // it works by recursivelly calling GET_STATE from here to the beginning and then pusing the UIM state of each component onto an array
            // the top UIM state of the array is the root component, the bottom one is that of the UIM that inititated the call
            let thisUIM=Object.assign({}, this.state.uim);
            if((this.id===0)) { // return the uim state of the root  as an array of 1
                return [thisUIM]; 
            }
            else {
                var stack=this.props.uim.toParent({type: "GET_STATE", distance: action.distance+1});
                logger.trace("UserInterfaceManager.toMeFromChild:GET_STATE got",  this.id, stack);
                stack.push(thisUIM); // push this uim state to the uim state list and return it
                return stack;
            }
        }else if (action.type==="SET_STATE"){
            logger.trace("UserInterfaceManager.toMeFromChild SET_STATE", this.id, this.props.uim && this.props.uim.depth, action.nextUIM);
            this.setState({uim: Object.assign({},this.state.uim, action.nextUIM)});
        }else if (action.type==="SET_TITLE"){
            logger.trace("UserInterfaceManager.toMeFromChild SET_TITLE", this.id, this.props.uim && this.props.uim.depth, action.nextUIM);
            this.childTitle=action.title; // this is only for pretty debugging
        }else if (action.type==="CONTINUE_SET_PATH"){
            if(UserInterfaceManager.pathPart.length) {
                logger.trace("UserInterfaceManager.toMeFromChild CONTINUE to SET_PATH", this.id, this.props.uim && this.props.uim.depth, action.nextUIM);
                setTimeout(()=>action.function({type: 'SET_PATH', part: UserInterfaceManager.pathPart.shift()}),0);
            } else {
                logger.trace("UserInterfaceManager.toMeFromChild CONTINUE to SET_PATH last one", this.id, this.props.uim && this.props.uim.depth, this.state.uim);
                if(this.id!==0) this.props.uim.toParent({type: "SET_PATH_COMPLETE"}); else { console.info("UserInterfaceManager.toMeFromChild CONTINUE_SET_PATH updateHistory"); this.updateHistory()};
            }
        }else if (action.type==="SET_STATE_AND_CONTINUE"){
            if(UserInterfaceManager.pathPart.length) {
                logger.trace("UserInterfaceManager.toMeFromChild SET_STATE_AND_CONTINUE to SET_PATH", this.id, this.props.uim && this.props.uim.depth, action.nextUIM);
                this.setState({uim: Object.assign({},this.state.uim, action.nextUIM)},()=>action.function({type: 'SET_PATH', part: UserInterfaceManager.pathPart.shift()}));
            } else {
                logger.trace("UserInterfaceManager.toMeFromChild SET_STATE_AND_CONTINUE last one", this.id, this.props.uim && this.props.uim.depth, this.state.uim, action.nextUIM);
                this.setState({uim: Object.assign({},this.state.uim, action.nextUIM)}, ()=>{ if(this.id!==0) this.props.uim.toParent({type: "SET_PATH_COMPLETE"}); else { console.info("UserInterfaceManager.toMeFromChild  SET_STATE_AND_CONTINUE last one updateHistory");this.updateHistory()} });
            }
        }else if(action.type==="SET_PATH_COMPLETE") {
            if(this.id!==0) return this.props.uim.toParent({type: "SET_PATH_COMPLETE"});
            else {
                console.info("UserInterfaceManager.toMeFromChild SET PATH COMPLETED, updateHistory");
                UserInterfaceManager.topState=null;
                return this.updateHistory();
            }
        }else if(this.actionToState && ((nextUIM=this.actionToState(action, this.state.uim, "CHILD")))!==null) {
            if((this.state.uim.pathPart && this.state.uim.pathPart.length) && !(nextUIM.pathPart && nextUIM.pathPart.length)) {  // path has been removed
                console.info("UserInterfaceManger.toChildFromParent child changed state and path being removed so reset children", this.id, this.state.uim.pathPart.join('/'))
                if(this.toChild) this.toChild({type:"CLEAR_PATH"});
            } else if(!(this.state.uim.pathPart && this.state.uim.pathPart.length) && (nextUIM.pathPart && nextUIM.pathPart.length)) { // path being added
                console.info("UserInterfaceManger.toChildFromParent path being added", this.id, nextUIM.pathPart.join('/'))
            }                 
            if(this.id!==0 && !UserInterfaceManager.topState && !action.toBeContinued ){ // if this is not the root and this is not a root driven state change
                //if(equaly(this.state.uim,nextUIM)) return null; // nothing has changed so don't kick off a CHILD_SHAPE_CHANGED chain
                const distance= (action.type === "CHILD_SHAPE_CHANGED") ? action.distance+1 : 1; // 1 tells parent UIM it came from this UIM 
                this.setState({uim: nextUIM}, ()=>this.props.uim.toParent({type: "CHILD_SHAPE_CHANGED", shape: nextUIM.shape, distance: distance}));
            }else if(this.id!==0){
                this.setState({uim: nextUIM});
            } else { // this is the root, after changing shape, remind me so I can update the window.histor
                if(equaly(this.state.uim,nextUIM)) { console.info("UserInterfaceManager.toMeFromChild actionToState equaly updateHistory", action);this.updateHistory()} // updateHistory now!
                else this.setState({uim: nextUIM},()=>{ console.info("UserInterfaceManager.toMeFromChild actionToState setState updateHistory", action);this.updateHistory()}); // otherwise, set the state and let history update on componentDidUpdate
            }
        } 
        // these actions are overridden by the component's actonToState if either there is and it returns a newUIM to set (not null)
        else if(action.type ==="CHANGE_SHAPE"){  
            if(this.state.uim.shape!==action.shape){ // really the shape changed
                var nextUIM=Object.assign({}, this.state.uim, {shape: action.shape});
                if(this.id!==0 && !UserInterfaceManager.topState  && !action.toBeContinued ) {// if there's a parent to tell of the change and we are not inhibiting shape_changed
                    this.setState({uim: nextUIM}, ()=>this.props.uim.toParent({type: "CHILD_SHAPE_CHANGED", shape: action.shape, distance: 1})); 
                }if(this.id!==0){ // don't propogate a change
                    this.setState({uim: nextUIM});
                }else // this is the root, change state and then update history
                    this.setState({uim: nextUIM}, ()=>{ console.info("UserInterfaceManager.toMeFromChild CHANGE_SHAPE updateHistory");this.updateHistory()});
            } // no change, nothing to do
        } else if(action.type==="CHILD_SHAPE_CHANGED"){
            logger.trace("UserInterfaceManager.toMeFromChild CHILD_SHAPE_CHANGED not handled by actionToState",this.id, this.props.uim && this.props.uim.depth);
            if(this.id!==0) {   
                logger.trace("UserInterfaceManager.toMeFromChild CHILD_SHAPE_CHANGED not handled by actionToState not root",this.id, this.props.uim && this.props.uim.depth);
                this.props.uim.toParent({type: "CHILD_SHAPE_CHANGED", shape: this.state.uim.shape, distance: action.distance+1}); // pass a new action, not a copy including internal properties like itemId. This shape hasn't changed
            } else { // this is the root UIM, update history.state
                logger.trace("UserInterfaceManager.toMeFromChild CHILD_SHAPE_CHANGED not handled by actionToState at root",this.id, this.props.uim && this.props.uim.depth);
                setTimeout(()=>{ console.info("UserInterfaceManager.toMeFromChild CHILD_SHAPE_CHANGED default updateHistory");this.updateHistory()},0);
            }
        } else { // the action was not understood, send it up
            if(this.id) { action.distance+=1; return this.props.uim.toParent(action); }
            else return;
        }
        return null;
    }

    toMeFromParent(action) {
        console.info("UserInterfaceManager.toMeFromParent", this.id, this.props.uim && this.props.uim.depth, this.childName, this.childTitle, action, this.state.uim);
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
        } else if(this.actionToState && ((nextUIM=this.actionToState(action, this.state.uim, "PARENT"))!==null)){
            if(!equaly(this.state.uim, nextUIM)) { // really the shape changed
                if(this.id!==0 && !action.toBeContinued) {// if there's a parent to tell of the change
                    this.setState({uim: nextUIM}, ()=>this.props.uim.toParent({type: "CHILD_SHAPE_CHANGED", shape: action.shape, distance: 1}));
                }if(this.id!==0){
                    this.setState({uim: nextUIM}); // inhibit CHILD_SHAPE_CHANGED
                }else // no parent to tell of the change
                    this.setState({uim: nextUIM}, ()=>{ console.info("UserInterfaceManager.toMeFromParent CONTINUE_SET_PATH updateHistory");this.updateHistory()});
            } // no change, nothing to do
            return null;
        } else if(action.type==="CLEAR_PATH") {  // clear the path and reset the UIM state back to what the constructor would
            if(this.toChild) this.toChild(action); // clear children first
            this.setState(this.getDefaultState()); // after clearing thechildren clear this state
            return null;
        } else if(action.type==="RESET_SHAPE") {  // clear the path and reset the UIM state back to what the constructor would
            this.setState(this.getDefaultState()); //
            return null;
        }else if(action.type==="CHANGE_SHAPE"){ // change the shape if it needs to be changed
            nextUIM=Object.assign({},this.getDefaultState().uim,{shape: action.shape}); // 
            this.setState({uim: nextUIM});
            return null;
        }else if(action.type==="SET_PATH"){ // let child handle this one without complaint
            return this.toChild(action);
        }else {
            logger.error("UserInterfaceManager.toMeFromParent: Unknown Action",{action}, {state: this.state});
            return this.toChild(action);
        }   
    }

    updateHistory() {
        console.info("UserInterfaceManager.updateHistory",  this.id);
        if(typeof window === 'undefined') { logger.trace("UserInterfaceManager.updateHistory called on servr side, ignoring"); return; }
        if(this.id!==0) logger.error("UserInterfaceManager.updateHistory called but not from root", this.props.uim);
        var stateStack = { stateStack: this.toMeFromParent({ type: "GET_STATE" }) };  // recursively call me to get my state stack
        var curPath = stateStack.stateStack.reduce((acc, cur) => { // parse the state to build the curreent path
            if (cur.pathPart && cur.pathPart.length) acc.push(...cur.pathPart);
            return acc;
        }, []);
        curPath = (this.props.UIMRoot || '/h/') + curPath.join('/');
        if (curPath !== window.location.pathname) { // push the new state and path onto history
            logger.trace("UserInterfaceManager.toMeFromParent pushState", { stateStack }, { curPath });
            window.history.pushState(stateStack, '', curPath);
        } else { // update the state of the current history
            logger.trace("UserInterfaceManager.toMeFromParent replaceState", { stateStack }, { curPath });
            window.history.replaceState(stateStack, '', curPath); //update the history after changes have propogated among the children
        }
        return null;
    }

    componentDidUpdate(){
        console.info("UserInterfaceManager.componentDidUpdate", this.id, this.props.uim && this.props.uim.depth, this.childName, this.childTitle);
//        if((this.id===0) && UserInterfaceManager.pathPart.length===0) setTimeout(()=>{ console.info("UserInterfaceManager.componentDidUpdate updateHistory");this.updateHistory()},0); // only do this if the root, only if not processing a pathPart, and do it after the current queue has completed
    }

    /***  don't rerender if no change in state or props, use a logically equivalent check for state so that undefined and null are equivalent. Make it a deep compare in case apps want deep objects in their state ****/
    shouldComponentUpdate(newProps, newState) {
        if(!equaly(this.state,newState)) {console.info("UserInterfaceManager.shouldComponentUpdate yes state", this.id, this.props.uim && this.props.uim.depth, this.childName,  this.state,newState); return true;}
        if(!shallowequal(this.props, newProps)) {console.info("UserInterfaceManager.shouldComponentUpdate yes props", this.id, this.props.uim && this.props.uim.depth, this.childName, this.props, newProps); return true;}
        console.info("UserInterfaceManager.shouldComponentUpdate no", this.id, this.props.uim && this.props.uim.depth, this.childName,  this.props, newProps, this.state, newState);
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
        logger.trace("UserInterfaceManager render", this.id);

        return (
            <section>
                {children}
            </section>
        );
    }
}

export default UserInterfaceManager;

export class UserInterfaceManagerClient extends React.Component {

  constructor(props, keyField='key') {
    //console.info("UserInterfaceManagerClient.constructor", props, keyField);
    super(props);
    this.toChild = [];
    this.waitingOn=null;
    this.keyField=keyField;
    if(!this.props.uim) logger.error("UserInterfaceManagerClient no uim",this.constructor.name, this.props);
    if (this.props.uim.toParent) {
      this.props.uim.toParent({ type: "SET_TO_CHILD", function: this.toMeFromParent.bind(this), name: this.constructor.name, actionToState: this.actionToState.bind(this) })
    }else logger.error("UserInterfaceManagerClient no uim.toParent",this.props);
  }

  //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
  // this is a one to many pattern for the user interface manager,insert yourself between the UIM and each child
  // send all unhandled actions to the parent UIM
  //
  toMeFromChild(key, action) {
    logger.trace(" UserInterfaceManagerClient.toMeFromChild", this.props.uim.depth, key, action);
    if (action.type === "SET_TO_CHILD") { // child is passing up her func
      this.toChild[key] = action.function; // don't pass this to parent
      if (this.waitingOn) {
        if (this.waitingOn.nextUIM) {
          let nextUIM = this.waitingOn.nextUIM;
          if (key === nextUIM[this.keyField] && this.toChild[key]) {
            logger.trace("UserInterfaceManagerClient.toMeFromParent got waitingOn nextUIM", nextUIM);
            var nextFunc=this.waitingOn.nextFunc;
            this.waitingOn = null;
            if(nextFunc) setTimeout(nextFunc,0);
            else setTimeout(() => this.props.uim.toParent({ type: "SET_STATE_AND_CONTINUE", nextUIM: nextUIM, function: this.toChild[key] }), 0);
          }
        }
      }
    } else {
        action[this.keyField] = key; // actionToState may need to know the child's id
        var result =this.props.uim.toParent(action);
        // console.info(this.constructor.name, this.title, action,'->', this.props.uim);
        return result;
    }
  }

  //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
  // this is a one to many pattern for the user Interface Manager, handle each action  appropriatly
  //
  toMeFromParent(action) {
    logger.trace("UserInterfaceManagerClient.toMeFromParent", this.props.uim.depth, action);
    if (action.type === "ONPOPSTATE") {
      var { shape } = action.event.state.stateStack[this.props.uim.depth - 1];  // the button was passed to the parent UIManager by actionToState
      var key = action.event.state.stateStack[this.props.uim.depth - 1][this.keyField];
      if ((action.event.state.stateStack.length > (this.props.uim.depth))) {
        let sent = false;
        Object.keys(this.toChild).forEach(child => { // only child panels with UIM managers will have entries in this list. 
          if (child === key) { sent = true; this.toChild[child](action); }
          else this.toChild[child]({ type: "CLEAR_PATH" }); // only one button panel is open, any others are truncated (but inactive)
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
            this.waitingOn={nextUIM, nextFunc: ()=>this.props.uim.toParent({type: "CONTINUE_SET_PATH", function: this.toChild[key]})};
            this.props.uim.toParent({type: "SET_STATE", nextUIM});       
        } else {
          logger.trace("UserInterfaceManagerClient.toMeFromParent SET_PATH waitingOn", nextUIM);
          this.waitingOn = {nextUIM};
        }
      } else {
        this.props.uim.toParent({ type: 'SET_STATE_AND_CONTINUE', nextUIM: nextUIM, function: null });
      }
    } else logger.error("UserInterfaceManagerClient.toMeFromParent action type unknown not handled", action)
  }
}
