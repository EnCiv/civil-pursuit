'use strict';

import React              from 'react';
import Panel              from './panel';
import Loading            from './util/loading';
import Link               from './util/link';
import panelType          from '../lib/proptypes/panel';
import makePanelId        from '../lib/app/make-panel-id';
import Join               from './join';
import Accordion          from './util/accordion';
import Promote            from './promote';
import EvaluationStore    from './store/evaluation';
import ItemButtons        from './item-buttons';
import Icon               from './util/icon';
import Creator            from './creator';
import ItemStore          from '../components/store/item';
import Details            from './details';
import DetailsStore       from './store/details';
import EditAndGoAgain     from './edit-and-go-again';
import Harmony            from './harmony';
import TypeComponent      from './type-component';
import config             from '../../public.json';

class PanelItems extends React.Component {

  static propTypes  =   {
    panel           :   panelType
  };

  waitingOn=null;

  constructor(props){
    super(props);
    this.startedEmpty= !(this.props.panel && this.props.panel.items && this.props.panel.items.length);
    if(this.props.uim && this.props.uim.toParent) { 
      //this.props.uim.toParent({type: "SET_ACTION_TO_STATE", function: this.actionToState.bind(this) })
      this.props.uim.toParent({type: "SET_TO_CHILD", function: this.toMeFromParent.bind(this), name: "PanelItems", startedEmpty: this.startedEmpty, actionToState: this.actionToState.bind(this)});
    }
    if(props.panel && props.panel.type && props.panel.type.name && props.panel.type.name !== this.title) { this.title=props.panel.type.name; this.props.uim.toParent({type: "SET_TITLE", title: this.title});} // this is for pretty debugging
  }

  //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

  loadMore (e) {
    e.preventDefault();

    // window.Dispatcher.emit('get items', this.props.panel);
  }

  toggleCreator(){
    if(this.props.uim && this.props.uim.toParent) this.props.uim.toParent({type: "TOGGLE_CREATOR"});
  }

  toChild=[];  // toChild keeps track of the toChild func for each child item
  actionToState (action, uim) {
    var nextUIM={},delta={}; 
    if(action.type==="CHILD_SHAPE_CHANGED"){
      let ash=action.shape, ush=uim.shape;
      if(!action.shortId) logger.error("PanelItems.actionToState action without shortId", action)
      var ooview=false;
      if(this.props.panel && this.props.panel.type && this.props.panel.type.visualMethod && this.props.panel.type.visualMethod ==="ooview") ooview=true;

      if(action.distance===1) { //if this action is from an immediate child 
        if(action.shape === 'open' && action.shortId) { 
          delta.shortId=action.shortId;
          delta.pathPart=[action.shortId];
        } else {
          delta.pathPart=[];
          delta.shortId=null; // turn off the shortId
        } delta.shape = action.shape;
        Object.assign(nextUIM, uim, delta);
      }else{ // it's not my child that changed shape
        logger.trace("PanelItems.actionToState it's not my child that changed shape")
        if(ooview && ash==='open'){
          Object.assign(nextUIM, uim, {shape: 'collapsed', shortId: action.shortId});
        } else if (ooview && ash==='truncated') {
          Object.assign(nextUIM, uim, {shape: 'truncated', shortId: null});
        } else Object.assign(nextUIM, uim); // no change to shape
      }
    } else if(action.type==="TOGGLE_CREATOR"){
      if(uim.creator) {// it's on so toggle it off
        Object.assign(nextUIM,uim,{creator: false})
      } else { // it's off so toggle it on
        delta.creator=true;
        if(uim.shape!=='truncated'){ //if shape was not truncated 
          if(uim.shortId){//there is an item that's open
            this.toChild[uim.shortId]({type: "CHANGE_SHAPE", shape: 'truncated'});
            delta.shape='truncated';
            delta.shortId=null;
            delta.pathPart=['Creator'];
          }else{
            Object.assign(nextUIM,nextUIM,{shape: 'truncated'});
            delta.shape='truncated';
            delta.pathPart=[];
          }
        }
        Object.assign(nextUIM,uim,delta); // if shape is not truncated, do so
      }
    } else if(action.type==="OPEN_ITEM"){
      if(!this.props.panel.items.some(item=>item._id===action.item._id)){ // if the new item is not in the list
        this.props.panel.items.push(action.item);
      }
      delta.shortId=action.item.id;
      delta.shape='open';
      delta.pathPart=[delta.shortId];
      Object.assign(nextUIM,uim,delta);
      var nextFunc=()=>this.toChild[delta.shortId]({type: "CHANGE_SHAPE", shape: 'open'});
      if(this.toChild[delta.shortId]) setTimeout(nextFunc,0);
      else this.waitingOn={nextUIM: nextUIM, nextFunc: nextFunc};
    } else return null; // don't know this action, null so the default methods can have a shot at it
    logger.trace("PanelItems.actionToState return", {nextUIM})
    return nextUIM;
  }

  //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
  // this is a one to many pattern for the user Interface Manager, handle each action  appropriatly
  //
  toMeFromParent(action) {
      logger.trace("PanelItems.toMeFromParent", this.props.uim && this.props.uim.depth, action);
      if (action.type==="ONPOPSTATE") {
          var {shape, shortId} = action.event.state.stateStack[this.props.uim.depth-1]; // the shape of my UIMManager
          if(action.event.state.stateStack.length > (this.props.uim.depth)){
            let sent=false;
            Object.keys(this.toChild).forEach(child=>{
              if(child===shortId) {sent=true; this.toChild[child](action)}
              else this.toChild[child]({type: "CHANGE_SHAPE", shape: shape === 'open' ? 'truncated' : shape}); 
              // panel list open: one child is open, all the others are collapsed, if truncated: all children are truncated. if collapsed: all children are collapsed
            })
            if(shortId && !sent) logger.error("PanelItems.toMeFromParent ONPOPSTATE child not found",{depth: this.props.uim.depth}, {action});
          }
          return null;// child has been updated, now UIM can set state for me
      } else if(action.type==="GET_STATE"){
        let shortId=this.props.uim.shortId || null;
        if(shortId && this.toChild[shortId]) return this.toChild[this.props.uim.shortId](action); // pass the action to the child
        else return null; // end of the line
      } else if(action.type==="CLEAR_PATH") {  // clear the path and reset the UIM state back to what the const
        Object.keys(this.toChild).forEach(child=>{ // send the action to every child
          this.toChild[child](action)
        });
      } else if(action.type==="SET_PATH"){
          var shortId=action.part;
          var nextUIM={shape: 'open', shortId: shortId, pathPart: [shortId]};
          if(this.toChild[shortId]){
             logger.trace("PanelItems.toMeFromParent SET_STATE_AND_CONTINUE")
             return this.props.uim.toParent({type: "SET_STATE_AND_CONTINUE", nextUIM: nextUIM, function: this.toChild[shortId]});
          } else {
            logger.trace("PanelItems.toMeFromParent waitingOn",nextUIM);
            this.waitingOn={nextUIM: nextUIM, nextFunc: ()=>this.props.uim.toParent({type: "CONTINUE_SET_PATH", function: this.toChild[shortId]})}
            return this.props.uim.toParent({type: "SET_STATE", nextUIM: nextUIM}); // set the state, but don't really conitune until waitingOn is satisfied
          }
      } else logger.error("PanelItems.toMeFromParent action type unknown not handled", action)
  }

  //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
  // this is a one to many pattern for the user interface manager, yourself between the UIM and each child
  // send all unhandled actions to the parent UIM
  //
  toMeFromChild(shortId, action) {
    logger.trace("PanelItems.toMeFromChild", this.props.panel && this.props.panel.type && this.props.panel.type.name, this.props.uim && this.props.uim.depth, shortId, action, this.props.uim);

    if(action.type==="SET_TO_CHILD" ) { // child is passing up her func
      this.toChild[shortId] = action.function; // don't pass this to parent
        if(this.waitingOn){
          let nextUIM=this.waitingOn.nextUIM;
          if(shortId===nextUIM.shortId && this.toChild[shortId]) { 
            logger.trace("PanelItems.toMeFromParent got waitingOn nextUIM", nextUIM);
            var nextFunc=this.waitingOn.nextFunc;
            this.waitingOn=null;
            setTimeout(nextFunc ,0);
          }
        }
    } else if(action.type==="CHILD_SHAPE_CHANGED" && this.props.uim.shortId && this.props.uim.shortId !== shortId){
      // if it's a shape_change about a child that is not the open one, then filter it out
      return;
    } else {
       action.shortId=shortId; // actionToState may need to know the child's id
       return(this.props.uim.toParent(action));
    }
  }

  componentWillReceiveProps(newProps){
        if(newProps.panel && newProps.panel.type && newProps.panel.type.name && newProps.panel.type.name !== this.title) {  this.title=newProps.panel.type.name; this.props.uim.toParent({type: "SET_TITLE", title: this.title});} // this is for pretty debugging
  }

  mounted=[];
  //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

  render () {

    const { panel, count, user, emitter, uim } = this.props;

    let title = 'Loading items', name, loaded = false, content, loadMore,
      type, parent, creator;

    let bgc='white';

    if ( panel ) {
      loaded = true;

      type = panel.type;
      parent = panel.parent;

      title = type.name;

      if ( ! panel.items.length && ! ( panel.type && panel.type.createMethod==='hidden') ) {
        content = (
          <div className={`syn-panel-gutter text-center vs-${uim.shape}`}>
            <a href="#" onClick={ this.toggleCreator.bind(this) } className="click-to-create">
              Click the + to be the first to add something here
            </a>
          </div>
        );
      }

      else {
        content = panel.items
          .map(item => {
            let shape= uim.shape==='open' && uim.shortId===item.id ? 'open' : 'truncated';
            //if(panel.items.length===1 && uim && uim.shape==='truncated') shape='open';  // if there is only one item and in the list and the panel is 'truncated' then render it open
            var itemUIM={shape: shape, depth: this.props.uim.depth, toParent: this.toMeFromChild.bind(this, item.id)};  // inserting me between my parent and my child
            if(!this.mounted[item.id]){ // only render this once
              this.mounted[item.id]=(<ItemStore item={ item } key={ `item-${item._id}` }>
                  <Item
                    item    =   { item }
                    user    =   { user }
                    panel = { panel }
                    uim = { itemUIM }
                    emitter = {emitter}
                    hideFeedback = {this.props.hideFeedback}
                    buttons={['Promote','Details','Harmony','Subtype']}
                    style   = {{backgroundColor: bgc}}
                  />
                </ItemStore>
              );
            }
            return (
              <Accordion active={(uim.shape==='open' && uim.shortId===item.id) || uim.shape==='truncated'} name='item'>
                { this.mounted[item.id] }
              </Accordion>
            );
          });

        const { skip, limit } = panel;

        const end = skip + limit;

 //       if ( count > limit ) {
 //         loadMore = (
 //           <h5 className="gutter text-center">
 //             <a href="#" onClick={ this.loadMore.bind(this) }>Show more</a>
 //           </h5>
 //         );
 //       }
      }


      creator = (
        <Accordion
          active    =   { (uim && uim.creator) }
          style   = {{backgroundColor: bgc}}
          >
          <Creator
            type    =   { type }
            parent  =   { parent }
            toggle  =   { this.toggleCreator.bind(this) }
            />
        </Accordion>
      );
    }

    return (
        <Panel
          uim = {uim}
          heading     =   {[
            ( <h4>{ title }</h4> ), ( type && type.createMethod=="hidden" && !(user && user.id && parent && parent.user && parent.user._id && (user.id == parent.user._id) )) ? (null) : 
            (
              <Icon
                icon        =   "plus"
                className   =   "toggle-creator"
                onClick     =   { this.toggleCreator.bind(this) }
              />
            )
          ]}
          >
          { creator }
          { content }
          { loadMore }
        </Panel>
    );
  }
}

export default PanelItems;
export {PanelItems};

import Item from './item';

