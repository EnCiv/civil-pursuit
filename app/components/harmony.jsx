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

    this.status = 'iddle';

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
      if(action.shape==='open'){
        if(action.side === uim.side) // this side is already open so just pass it on
          Object.assign(nextUIM, uim); 
        else if(!uim.side) // no side was open previously
          Object.assign(nextUIM, uim, {side: action.side}); // expand the side
        else { // the other side was open previously
          Object.assign(nextUIM, uim, {side: action.side}); // expand this side
          this.toChild[uim.side]({type: "CHANGE_STATE", shape: 'truncated'}); // tell the other side to truncate
        }
      } else // whatever the new shape is, unexpand the expanded side
        if(action.side === uim.side )
          Object.assign(nextUIM,uim,{side: null});
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
    } else if(action.type==="SET_ACTION_TO_STATE"){
        logger.error("Harmony.toMeFromChild unexpected action", {action})
        return;
    } else if(this.props.uim && this.props.uim.toParent) {
       action.side=side; // actionToState may need to know which child
       return(this.props.uim.toParent(action));
    }
  }


//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

  render () {
    const { active, item, user, uim } = this.props;
    console.info("Harmony.render",this.props);

    const leftUIM={shape: 'truncated', depth: uim.depth, toParent: this.toMeFromChild.bind(this, 'left')};  // inserting me between my parent and my child
    const rightUIM={shape: 'truncated', depth: uim.depth, toParent: this.toMeFromChild.bind(this, 'right')};  // inserting me between my parent and my child

    let contentLeft = ( <Loading message="Loading" /> );

    let contentRight = ( <Loading message="Loading" /> );

      contentLeft = (
        <DoubleWide className="harmony-pro" left expanded={uim.side==='left'}>
          <PanelStore type={ item.harmony.types[0] } parent={ item } limit={this.props.limit}>
            <UserInterfaceManager user={ user } uim={leftUIM} hideFeedback = {this.props.hideFeedback}>
              <PanelItems />
            </UserInterfaceManager>
          </PanelStore>
        </DoubleWide>
      );

      contentRight = (
        <DoubleWide className="harmony-con" right expanded={uim.side==='right'} >
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