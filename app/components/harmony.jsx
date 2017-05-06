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

    this.leftId = null;
    this.rightId = null;

    if ( harmony.types && harmony.types.length ) {
      this.leftId = makePanelId( { type : harmony.types[0], parent : this.props.item._id });
      this.rightId = makePanelId( { type : harmony.types[1], parent : this.props.item._id });
    }

    if(this.props.uim && this.props.uim.toParent) { 
      this.props.uim.toParent({type: "SET_ACTION_TO_STATE", function: this.actionToState.bind(this) })
      this.props.uim.toParent({type: "SET_TO_CHILD", function: this.toMeFromParent.bind(this), name: "Harmony" })
    }

    this.toChild=[];
  }

//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
/***********
  componentWillReceiveProps (props) {
    if ( this.status === 'iddle' && props.active ) {
      this.status = 'ready';

      if ( props.panels ) {
        if ( ! props.panels[this.leftId] ) {

          window.Dispatcher.emit('get items', {
            type        :   props.item.harmony.types[0],
            parent      :   props.item
          });
        }

        if ( ! props.panels[this.rightId] ) {
          window.Dispatcher.emit('get items', {
            type        :   props.item.harmony.types[1],
            parent      :   props.item
          });
        }
      }
    }
  }
  *******/

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
          Object.assign(nextUIM, uim, {side: side}); // expand the side
        else { // the other side was open previously
          Object.assign(nextUIM, uim, {side: side}); // expand this side
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
            var {shape, side} = action.event.state.stateStack[this.props.uim.depth];
            if(shape==='open' && itemId && (action.event.state.stateStack.length > (this.props.uim.depth+1)) && this.toChild[side]) this.toChild[side](action); // send the action to the active child
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
    logger.info("UIMHarmony.toMeFromChild", side, action);

    if(action.type==="SET_TO_CHILD" ) { // child is passing up her func
      this.toChild[side] = action.function; // don't pass this to parent
    } else if(this.props.uim && this.props.uim.toParent) {
       action.side=side; // actionToState may need to know which child
       return(this.props.uim.toParent(action));
    }
  }


//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

  render () {
    const { active, item, user, uim } = this.props;

    const leftUIM={shape: 'truncated', depth: uim.depth, toParent: this.toMeFromChild.bind(this, 'left')};  // inserting me between my parent and my child
    const rightUIM={shape: 'truncated', depth: uim.depth, toParent: this.toMeFromChild.bind(this, 'right')};  // inserting me between my parent and my child

    let contentLeft = ( <Loading message="Loading" /> );

    let contentRight = ( <Loading message="Loading" /> );

      contentLeft = (
        <DoubleWide className="harmony-pro" left expanded={uim.side==='left'}>
          <PanelStore type={ item.harmony.types[0] } parent={ item } limit={this.props.limit}>
            <PanelItems user={ user } uim={leftUIM} hideFeedback = {this.props.hideFeedback}
            />
          </PanelStore>
        </DoubleWide>
      );

      contentRight = (
        <DoubleWide className="harmony-con" right expanded={uim.side==='right'} >
          <PanelStore type={ item.harmony.types[1] } parent={ item } limit={this.props.limit}>
            <PanelItems user={ user } uim={rightUIM} hideFeedback = {this.props.hideFeedback}/>
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