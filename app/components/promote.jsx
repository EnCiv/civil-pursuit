'use strict';

import React from 'react';
import Loading from './util/loading';
import Item from './item';
import Feedback from './promote-feedback';
import Sliders from './sliders';
import Harmony from './harmony';
import Accordion          from 'react-proactive-accordion';
import DoubleWide from './util/double-wide';
import TransitionOC from './util/transitionoc';
import Button from './util/button';
import Column from './util/column';

import { ReactActionStatePath, ReactActionStatePathClient } from 'react-action-state-path';


export default class Promote extends React.Component {
    initialRASP={ left: 0, right: 1, cursor: 1, side: ''};
    render() {
        return (
            <ReactActionStatePath {...this.props} initialRASP={this.initialRASP}>
                <RASPPromote />
            </ReactActionStatePath>
        )
    }
}


//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
class RASPPromote extends ReactActionStatePathClient {
    constructor(props) {
        super(props, 'side');
        //onsole.info("RASPPromote.constructor", this.props)
        this.transitionedOC = [];
        if(!(props.rasp)) logger.error("RASPPromote rasp missing");
    }

    static opposite={left: 'right', right: 'left'}

    //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    // this is where component specific actions are converted to component specific states
    //

    segmentToState(action, initialRASP) {
        const lookup = { l: 'left', r: 'right' }
        var parts = action.segment.split(',');
        var side = lookup[parts[0]] || '';  // if the first entry is not in lookup, the side is not set. 
        var nextRASP = Object.assign({}, action.initialRASP, { shape: 'open', side: side, pathSegment: null }); // always starts evaluation at the beginning if restoring a path
        return { nextRASP, setBeforeWait: false };  //setBeforeWait means set the new state and then wait for the key child to appear, otherwise wait for the key child to appear and then set the new state.
    }

    actionToState(action, rasp,source, initialRASP, delta) {
        logger.trace("RASPPromote.actionToState", { action }, { rasp });
        var nextRASP = {}, delta={};
        if (action.type === "DESCENDANT_FOCUS"){
            delta.side=action.side;
            if(rasp.side && (action.side!==rasp.side)) this.toChild[rasp.side]({ type: "CHANGE_STATE", shape: 'truncated' }); // if a side is going to be open, and it's not the side that is open, close the other side
        } else if(action.type==="DESCENDANT_UNFOCUS") {
            delta.side=null;
        } else if (action.type === "CLEAR_EXPANDERS") {
            delta.side = null; // action is to open, this side is going to be the open side
        } else if (action.type === "NEXT"){
          delta.cursor = rasp.cursor +1 ; 
          if ( delta.cursor < this.props.limit ) delta.cursor+=1; // can go forward a second one
          if ( delta.cursor <= this.props.limit) { // next evaluation
                delta.left = delta.cursor - 1;
                delta.right = delta.cursor;
                this.queueFocus(action);
          } else { // done with evaluations
            this.queueUnfocus(action);
          }
        } else if (action.type==="PROMOTE"){
          const cursor = rasp.cursor + 1;
          if ( cursor <= this.props.limit ) {
            delta.cursor=cursor;
            delta[RASPPromote.opposite[action.position]]=cursor;
            this.queueFocus(action);
          } else {
            const winner=this.props.items[rasp[action.position]]; // fetch the item indexed to by the winning position
            this.insertUpvotes(winner._id);
            //delta.cursor=cursor; do not increment cursor past limit
            this.queueUnfocus(action);
            if(winner._id === this.props.itemId){ // voted up the one we started with
                this.queueAction({type: "ITEM_DELVE", item: winner, distance: -1});
            } else { // voted up a different one
                this.qaction(()=>{
                    this.props.rasp.toParent({type: "SHOW_ITEM", item: winner, distance: -2, toBeContinued: true})
                    this.queueAction({type: "ITEM_DELVE", item: winner, distance: -2});
                },0);
                //setTimeout(()=>this.props.rasp.toParent({type: "FINISH_PROMOTE", winner: winner, distance: -1}),0);  // after the evaluation is done, the panel should go away
            }
          }
        } else if(Object.keys(delta).length) {
            ; // no need to do anything, but do continue to calculate nextRASP
        } else 
            return null; // don't know the action type so let the default handler have it
        let parts=[];
        if (delta.side) parts.push(delta.side[0]); // if a side is open, include it in the partPath
        if (delta.cursor) parts.push(delta.cursor);
        else parts.push(rasp.cursor);
        delta.pathSegment = parts.join(','); //otherwise no path part
        Object.assign(nextRASP, rasp, delta);
        return nextRASP; // return the new state
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
        this.props.rasp.toParent({ type: "CLEAR_EXPANDERS" });
        this.transitionedOC['left'].toggle(false);
        this.transitionedOC['right'].toggle(false);
        this.buttons = { event: 'next', position: null };
    }

    //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    promote(position) {
        this.props.rasp.toParent({ type: "CLEAR_EXPANDERS" })
        this.buttons = { event: 'promote', position: position };
        this.transitionedOC[RASPPromote.opposite[position]].toggle(false);
    }

    //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

    buttons = { event: null, position: null }; // after the user pushes the button, we need to rember the event and position until after the slide closes.
    slideClosed=[]; //keep track of the sides as they close, make sure both sides are closed if 'next' before continuing

    slide(side, opened) {
      //onsole.info("RASPPromote.slide",side, opened);
      const hiddenDuration=250;// hold closed position for 250mSec
        if (!opened) {
            if (this.buttons.event === 'promote') {
                this.props.rasp.toParent({type: "PROMOTE", position: this.buttons.position})
                this.buttons.event = 'null';
                this.slideClosed[side] = false;
                setTimeout(()=>{if(this.transitionedOC[side] && this.transitionedOC[side].toggle) this.transitionedOC[side].toggle(true)},hiddenDuration); // element might not exist later
            } else if (this.buttons.event === 'next' && this.slideClosed[RASPPromote.opposite[side]]) { // if next and the other side is closed too
                this.props.rasp.toParent({type: "NEXT"});
                this.buttons.event = 'null';
                this.slideClosed[RASPPromote.opposite[side]] = false;
                setTimeout(()=>{if(this.transitionedOC['left'] && this.transitionedOC['left'].toggle) this.transitionedOC['left'].toggle(true); if(this.transitionedOC['right'] && this.transitionedOC['right'].toggle)this.transitionedOC['right'].toggle(true)},hiddenDuration); //element might be deleted later
            } else {
                this.slideClosed[side] = true;
            }
        }
    }

    //**********************************************************

    render() {
        const { item, hideFinish, limit, items, criterias, user, rasp } = this.props;
        //onsole.info(this.constructor.name,"RASPPromote.render",this.props);

        if(!(items && items.length && criterias && criterias.length)){
          return (
            <div>
              <Loading message="Loading evaluation" />
            </div>
          );
        }

        const hideFeedback = this.props.hideFeedback || ((item && item.type && item.type.feedbackMethod) ? item.type.feedbackMethod === 'hidden' : false);
        const evaluateQuestion= (item && item.type && item.type.evaluateQuestion) ? item.type.evaluateQuestion : "Which of these is most important for the community to consider?";
        const foo = ( ! items[rasp.left] || ! items[rasp.right] ) ? ( <div></div> ) : (<h5 className="text-center gutter solid">{ evaluateQuestion }</h5>)

        const renderSide = (side, item) => {
            const renderFeedback = () => {
                if (!hideFeedback) {
                    return (
                        [<Feedback itemId={item._id} user={user} className="gutter-top solid" key={'feedback-'+item._id+'-'+side} />,
                        <Sliders itemId={item._id} user={user} criterias={criterias} className="promote-sliders"  key={'slider-'+item._id+'-'+side}/>]
                    );
                } else return null;
            }

            const renderPromoteButton = () => {
              if ( ! item ) { return ( <div></div> ); }
              else return (
                <Column span="50" className={ `promote-${side} promote-item-${side}` } >
                  <Button block className= "gutter-bottom promote-item-button" id={ `promote-item-button-${this.props._id}` } onClick={ this.promote.bind(this,side)} key={'promote-'+side}>
                    { item.subject }
                  </Button>
                </Column>
              );
            }

            return (
                <DoubleWide left={side === 'left'} right={side === 'right'} expanded={rasp.side === side} >
                    <TransitionOC className={"promote slider " + side} ref={(comp) => { this.transitionedOC[side] = comp }} onChange={this.slide.bind(this, side)} active={true} >
                        <Item item={item} user={user} position={side} key={'item-' + side}
                            buttons={['Harmony']} className="whole-border" rasp={{ shape: 'truncated', depth: rasp.depth, toParent: this.toMeFromChild.bind(this, side) }}
                        />
                        {renderFeedback()}
                        {renderPromoteButton()}
                    </TransitionOC>
                </DoubleWide>
            );
        }

        const renderFinishButton = (cursor, limit) => {
            return (
                <Accordion active={!(hideFinish && cursor===limit)}>
                    <Button block onClick={this.next.bind(this)} className="finish-evaluate">
                        <b>{cursor === limit ? 'Finish' : 'Neither'}</b>
                    </Button>
                </Accordion>
            );
        }

        return (
            <div>
                <header className="text-center gutter-bottom solid">
                    <h2>
                        <span className="cursor">{rasp.cursor}</span>
                        <span> of </span>
                        <span className="limit">{limit}</span>
                    </h2>
                    <h4>{evaluateQuestion}</h4>
                </header>
                <div className="solid">
                    <div className="solid clear">
                        {renderSide('left', items[rasp.left])}
                        {renderSide('right', items[rasp.right])}
                    </div>
                    <div className="solid clear" style={{ width: '100%' }}>
                        {foo}
                    </div>
                </div>
                <div className="gutter-top gutter-bottom solid">
                    {renderFinishButton(rasp.cursor,limit)}
                </div>
            </div>
        );
    }
}
