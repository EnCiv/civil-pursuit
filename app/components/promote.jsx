'use strict';

import React from 'react';
import Loading from './util/loading';
import Item from './item';
import Feedback from './promote-feedback';
import Sliders from './sliders';
import Harmony from './harmony';
import Accordion from './util/accordion';
import DoubleWide from './util/double-wide';
import { EventEmitter } from 'events';
import TransitionOC from './util/transitionoc';
import Button from './util/button';
import Column from './util/column';

import { UserInterfaceManager, UserInterfaceManagerClient } from './user-interface-manager';


export default class Promote extends React.Component {
    static initialUIM={ left: 0, right: 1, cursor: 1, side: ''};
    render() {
        return (
            <UserInterfaceManager {...this.props} initialUIM={Promote.initialUIM}>
                <UIMPromote />
            </UserInterfaceManager>
        )
    }
}


//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
class UIMPromote extends UserInterfaceManagerClient {
    constructor(props) {
        var uimProps = { uim: props.uim };
        super(uimProps, 'side');
        //console.info("UIMPromote.constructor", this.props)
        this.transitionedOC = [];
        if(!(props.uim)) logger.error("UIMPromote uim missing");
    }

    static opposite={left: 'right', right: 'left'}

    //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    // this is where component specific actions are converted to component specific states
    //

    setPath(action) {
        const lookup = { l: 'left', r: 'right' }
        var parts = action.part.split(',');
        var side = lookup[parts[0]] || '';  // if the first entry is not in lookup, the side is not set. 
        var nextUIM = Object.assign({}, Promote.initialUIM, { shape: 'open', side: side, pathPart: [] }); // always starts evaluation at the beginning if restoring a path
        return { nextUIM, setBeforeWait: false };  //setBeforeWait means set the new state and then wait for the key child to appear, otherwise wait for the key child to appear and then set the new state.
    }

    actionToState(action, uim) {
        logger.trace("UIMPromote.actionToState", { action }, { uim });
        var nextUIM = {}, delta={};
        if (action.type === "CHILD_SHAPE_CHANGED") {
            if (action.shape === 'open') delta.side = action.side; // action is to open, this side is going to be the open side
            else if (action.side === uim.side) delta.side = null; // if action is to truncate (not open), and it's from the side that's open then truncate this
            if (delta.side && uim.side && uim.side !== delta.side) this.toChild[uim.side]({ type: "CHANGE_STATE", shape: 'truncated' }); // if a side is going to be open, and it's not the side that is open, close the other side
        } else if (action.type === "CLEAR_EXPANDERS") {
            delta.side = null; // action is to open, this side is going to be the open side
        } else if (action.type === "NEXT"){
          delta.cursor = uim.cursor +1 ; 
          if ( delta.cursor < this.props.limit ) delta.cursor+=1; // can go forward a second one
          if ( delta.cursor <= this.props.limit) { // next evaluation
                delta.left = delta.cursor - 1;
                delta.right = delta.cursor;
          } else { // done with evaluations
              //Promote.initialUIM;  don't change left and right - it will cause a rerender and don't remove path it will cause a clear path delta=Promote.initialUIM;
              setTimeout(()=>this.props.uim.toParent({type: "CHANGE_SHAPE", shape: 'truncated', distance: -1}),0);  // after the evaluation is done, the panel should go away
          }
        } else if (action.type==="PROMOTE"){
          const cursor = uim.cursor + 1;
          if ( cursor <= this.props.limit ) {
            delta.cursor=cursor;
            delta[UIMPromote.opposite[action.position]]=cursor;
          } else {
            const winner=this.props.items[uim[action.position]]; // fetch the item indexed to by the winning position
            this.insertUpvotes(winner._id);
            delta.cursor=cursor; //Promote.initialUIM;  don't change left and right - it will cause a rerender and don't remove path it will cause a clear path
            if(winner._id === this.props.item._id){ // voted up the one we started with
                setTimeout(()=>this.props.uim.toParent({type: "ITEM_DELVE", distance: -1}),0);
            } else { // voted up a different one
                setTimeout(()=>{
                    this.props.uim.toParent({type: "SHOW_ITEM", item: winner, distance: -2, toBeContinued: true})
                    setTimeout(()=>this.props.uim.toParent({type: "ITEM_DELVE", distance: -2}),1000); // needs to go to the panel above this item
                },0);
                //setTimeout(()=>this.props.uim.toParent({type: "FINISH_PROMOTE", winner: winner, distance: -1}),0);  // after the evaluation is done, the panel should go away
            }
          }
        } else return null; // don't know the action type so let the default handler have it
        let parts=[];
        if (delta.side) parts.push(delta.side[0]); // if a side is open, include it in the partPath
        if (delta.cursor) parts.push(delta.cursor);
        else parts.push(uim.cursor);
        delta.pathPart = [parts.join(',')]; //otherwise no path part
        Object.assign(nextUIM, uim, delta);
        return nextUIM; // return the new state
    }

    //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    // update the number of views of each item, 
    // the number of times the winning item was promoted
    // and insert an upvote of 0 or 1 for the winner, from this user.
    //
    insertUpvotes(winningItemId) {
      const upvotes = [];
      const items = this.props.items;
      if (this.props.items && this.props.items.length) {
        var itm;
        for (itm in items) {
          let id=items[itm]._id
          window.socket.emit('add view', id);
          if (id === winningItemId) {
            upvotes.push({item: id, value: 1 });
            window.socket.emit('promote', id);
          } else {
            upvotes.push({item: id, value: 0 });
          }
        }
        window.socket.emit('insert upvote', upvotes);
      }
    }

    //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

    next() {
        this.props.uim.toParent({ type: "CLEAR_EXPANDERS" });
        this.transitionedOC['left'].toggle(false);
        this.transitionedOC['right'].toggle(false);
        this.buttons = { event: 'next', position: null };
    }

    //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    promote(position) {
        this.props.uim.toParent({ type: "CLEAR_EXPANDERS" })
        this.buttons = { event: 'promote', position: position };
        this.transitionedOC[UIMPromote.opposite[position]].toggle(false);
    }

    //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

    buttons = { event: null, position: null }; // after the user pushes the button, we need to rember the event and position until after the slide closes.
    slideClosed=[]; //keep track of the sides as they close, make sure both sides are closed if 'next' before continuing

    slide(side, opened) {
      console.info("UIMPromote.slide",side, opened);
      const hiddenDuration=250;// hold closed position for 250mSec
        if (!opened) {
            if (this.buttons.event === 'promote') {
                this.props.uim.toParent({type: "PROMOTE", position: this.buttons.position})
                this.buttons.event = 'null';
                this.slideClosed[side] = false;
                setTimeout(()=>{if(this.transitionedOC[side] && this.transitionedOC[side].toggle) this.transitionedOC[side].toggle(true)},hiddenDuration); // element might not exist later
            } else if (this.buttons.event === 'next' && this.slideClosed[UIMPromote.opposite[side]]) { // if next and the other side is closed too
                this.props.uim.toParent({type: "NEXT"});
                this.buttons.event = 'null';
                this.slideClosed[UIMPromote.opposite[side]] = false;
                setTimeout(()=>{if(this.transitionedOC['left'] && this.transitionedOC['left'].toggle) this.transitionedOC['left'].toggle(true); if(this.transitionedOC['right'] && this.transitionedOC['right'].toggle)this.transitionedOC['right'].toggle(true)},hiddenDuration); //element might be deleted later
            } else {
                this.slideClosed[side] = true;
            }
        }
    }

    //**********************************************************

    render() {
        const { panel, show, limit, items, criterias, panelEmitter, user, uim } = this.props;
        //console.info(this.constructor.name,"UIMPromote.render",this.props);

        if(!(items && items.length && criterias && criterias.length)){
          return (
            <div>
              <Loading message="Loading evaluation" />
            </div>
          );
        }

        const hideFeedback = (panel && panel.type && panel.type.feedbackMethod) ? panel.type.feedbackMethod === 'hidden' : false;
        const evaluateQuestion= (panel && panel.type && panel.type.evaluateQuestion) ? panel.type.evaluateQuestion : "Which of these is most important for the community to consider?";
        const foo = ( ! items[uim.left] || ! items[uim.right] ) ? ( <div></div> ) : (<h5 className="text-center gutter solid">{ evaluateQuestion }</h5>)

        const renderSide = (side, item) => {
            const renderFeedback = () => {
                if (!hideFeedback) {
                    return (
                        [<Feedback itemId={item._id} user={user} className="gutter-top solid" />,
                        <Sliders itemId={item._id} user={user} criterias={criterias} className="promote-sliders" />]
                    );
                } else return null;
            }

            const renderPromoteButton = () => {
              if ( ! item ) { return ( <div></div> ); }
              else return (
                <Column span="50" className={ `promote-${side} promote-item-${side}` } >
                  <Button block className= "gutter-bottom promote-item-button" id={ `promote-item-button-${this.props._id}` } onClick={ this.promote.bind(this,side)}>{ item.subject }</Button>
                </Column>
              );
            }

            return (
                <DoubleWide left={side === 'left'} right={side === 'right'} expanded={uim.side === side} >
                    <TransitionOC className={"promote slider " + side} ref={(comp) => { this.transitionedOC[side] = comp }} onChange={this.slide.bind(this, side)} active={true} >
                        <Item item={item} user={user} position={side} key={'item-' + side}
                            buttons={['Harmony']} className="whole-border" uim={{ shape: 'truncated', depth: uim.depth, toParent: this.toMeFromChild.bind(this, side) }}
                        />
                        {renderFeedback()}
                        {renderPromoteButton()}
                    </TransitionOC>
                </DoubleWide>
            );
        }

        const renderFinishButton = (cursor, limit) => {
          return (
            <Button block onClick={ this.next.bind(this) } className="finish-evaluate">
              <b>{ cursor === limit ? 'Finish' : 'Neither' }</b>
            </Button>
          );
        }

        return (
            <div>
                <header className="text-center gutter-bottom solid">
                    <h2>
                        <span className="cursor">{uim.cursor}</span>
                        <span> of </span>
                        <span className="limit">{limit}</span>
                    </h2>
                    <h4>{evaluateQuestion}</h4>
                </header>
                <div className="solid">
                    <div className="solid clear">
                        {renderSide('left', this.props.items[uim.left])}
                        {renderSide('right', this.props.items[uim.right])}
                    </div>
                    <div className="solid clear" style={{ width: '100%' }}>
                        {foo}
                    </div>
                </div>
                <div className="gutter-top gutter-bottom solid">
                    {renderFinishButton(uim.cursor,limit)}
                </div>
            </div>
        );
    }
}
