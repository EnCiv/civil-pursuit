'use strict';

import React                        from 'react';
import Loading                      from './util/loading';
import Row                          from './util/row';
import Column                       from './util/column';
import PanelItems                   from './panel-items';
import makePanelId                  from '../lib/app/make-panel-id';
import itemType                     from '../lib/proptypes/item';
import panelType                    from '../lib/proptypes/panel';
import PanelStore                   from './store/panel';
import DoubleWide                   from './util/double-wide';
import UserInterfaceManager         from './user-interface-manager';

export default class Harmony extends React.Component {
  render(){
    console.info("Harmony above.render");
    return(
    <UserInterfaceManager {...this.props}>
      <UIMHarmony />
     </UserInterfaceManager>
    )
  }
}

class UIMHarmony extends React.Component {

//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

  constructor (props) {
    super(props);

    const { harmony } = this.props.item;

    this.toChild=[];

    if(this.props.uim && this.props.uim.toParent) { 
      this.props.uim.toParent({type: "SET_ACTION_TO_STATE", function: this.actionToState.bind(this) })
      this.props.uim.toParent({type: "SET_TO_CHILD", function: this.toMeFromParent.bind(this), name: "Harmony" })
    }
  }

  //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
  // this is where component specific actions are converted to component specific states
  //

  actionToState(action,uim) {
    logger.info("UIMHarmony.actionToState", {action}, {uim});
    var nextUIM={};
    if(action.type==="CHILD_SHAPE_CHANGED"){
      let delta={};
      if(action.shape==='open') delta.side=action.side; // action is to open, this side is going to be the open side
      else if(action.side === uim.side) delta.side=null; // if action is to truncate (not open), and it's from the side that's open then truncate this
      if(delta.side && uim.side && uim.side!== delta.side) this.toChild[uim.side]({type: "CHANGE_STATE", shape: 'truncated'}); // if a side is going to be open, and it's not the side that is open, close the other side
      if(delta.side) delta.pathPart=[delta.side]; // if a side is open, include it in the partPath
      Object.assign(nextUIM, uim, delta);
      return nextUIM; // return the new state
    } else return null; // don't know the action type so let the default handler have it
  }

  //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
  // this is a one to many pattern for the user Interface Manager, handle each action  appropriatly
  //
    toMeFromParent(action) {
        logger.info("UIMHarmony.toMeFromParent", action);
        if (action.type==="ONPOPSTATE") {
            var {side} = action.event.state.stateStack[this.props.uim.depth];
            Object.keys(this.toChild).forEach(child=>{
              if(child===side) {sent=true; this.toChild[child](action);}
              else this.toChild[child]({type: "CHANGE_SHAPE", shape: 'truncated'}); // only one side panel is open, any others are truncated 
              if((action.event.state.stateStack.length > (this.props.uim.depth+1)) && !sent) logger.error("Harmony.toMeFromParent ONPOPSTATE more state but child not found",{depth: this.props.uim.depth}, {action});
            });
            return null;
        }else if(action.type==="GET_STATE"){
          side=this.props.uim.side||null;
          if(side && this.toChild[side]) return this.toChild[side](action); // pass the action to the child
          else return null; // end of the line
        } else if(action.type=="CLEAR_PATH") {  // clear the path and reset the UIM state back to what the const
          Object.keys(this.toChild).forEach(childSide=>{ // send the action to every child
            this.toChild[childSide](action)
          });
        } else if(action.type==="SET_PATH"){
          var side=action.part;
          var nextUIM={shape: 'open', side: side, pathPart: [side]};
          if(this.toChild[side]){
             logger.info("Harmony.toMeFromParent SET_STATE_AND_CONTINUE")
             this.props.uim.toParent({type: "SET_STATE_AND_CONTINUE", nextUIM: nextUIM, function: this.toChild[side]});
          } else {
            logger.info("PanelItems.toMeFromParent waitingOn",nextUIM);
            this.waitingOn={nextUIM};
          }
      } else logger.error("UIMHarmony.toMeFromParent action type unknown not handled", action)
    }

  //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
  // this is a one to many pattern for the user interface manager, yourself between the UIM and each child
  // send all unhandled actions to the parent UIM
  //
  toMeFromChild(side, action) {
    logger.info("UIMHarmony.toMeFromChild", {side}, {action});

    if(action.type==="SET_TO_CHILD" ) { // child is passing up her func
      this.toChild[side] = action.function; // don't pass this to parent
      if(this.waitingOn){
        if(this.waitingOn.action){
            let actn=this.waitingOn.action; // don't overload action
            logger.info("Harmony.toMeFromChild got waitingOn action", actn);
            this.waitingOn=null;
            setTimeout(()=>this.toChild[side](actn),0);
        }else if(this.waitingOn.nextUIM){
          let nextUIM=this.waitingOn.nextUIM;
            if(side===nextUIM.side && this.toChild[side]) { 
              logger.info("Harmony.toMeFromParent got waitingOn nextUIM", nextUIM);
              this.waitingOn=null;
              setTimeout(()=>this.props.uim.toParent({type: "SET_STATE_AND_CONTINUE", nextUIM: nextUIM, function: this.toChild[side] }),0);
            }
        }
      }
    } else if(this.props.uim && this.props.uim.toParent) {
       action.side=side; // actionToState may need to know which child
       return(this.props.uim.toParent(action));
    }
  }


//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

  render () {
    const { active, item, user, uim } = this.props;
    console.info("Harmony.render",this.props);

    const leftUIM={shape: 'truncated', depth: uim.depth, toParent: this.toMeFromChild.bind(this, 'L')};  // inserting me between my parent and my child
    const rightUIM={shape: 'truncated', depth: uim.depth, toParent: this.toMeFromChild.bind(this, 'R')};  // inserting me between my parent and my child

    let  contentLeft = (
        <DoubleWide className="harmony-pro" left expanded={uim.side==='L'}>
          <PanelStore type={ item.harmony.types[0] } parent={ item } limit={this.props.limit}>
            <UserInterfaceManager user={ user } uim={leftUIM} hideFeedback = {this.props.hideFeedback}>
              <PanelItems />
            </UserInterfaceManager>
          </PanelStore>
        </DoubleWide>
      );

    let contentRight = (
        <DoubleWide className="harmony-con" right expanded={uim.side==='R'} >
          <PanelStore type={ item.harmony.types[1] } parent={ item } limit={this.props.limit}>
            <UserInterfaceManager user={ user } uim={rightUIM} hideFeedback = {this.props.hideFeedback}>
              <PanelItems />
            </UserInterfaceManager>
          </PanelStore>
        </DoubleWide>
      );

    return (
      <section className={`item-harmony ${this.props.className}`}>
        { contentLeft }
        { contentRight }
      </section>
    );
  }
}


class HarmonyPanel extends React.Component{
  render(){
    console.info("HarmonyPanel.render", this.props);
    return(
      <UserInterfaceManager {...this.props} >
        <PanelItems />
      </UserInterfaceManager>
    )
  }
}
