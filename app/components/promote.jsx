'use strict';

import React from 'react';
import Loading from './util/loading';
import PromoteBigScreenButtons from './promote-big-screen-buttons';
import FinishButton from './promote-finish-button';
import Item from './item';
import Feedback from './promote-feedback';
import Sliders from './sliders';
import Harmony from './harmony';
import Accordion from './util/accordion';
import DoubleWide from './util/double-wide';
import { EventEmitter } from 'events';
import TransitionOC from './util/transitionoc';

import { UserInterfaceManager, UserInterfaceManagerClient } from './user-interface-manager';


export default class Promote extends React.Component {
    render() {
        console.info("Promote above.render");
        return (
            <UserInterfaceManager {...this.props}>
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
        console.info("UIMPromote.constructor", this.props)
        this.transitionedOC = [];
        if(!(props.uim)) logger.error("UIMPromote uim missing");
    }

    //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    // this is where component specific actions are converted to component specific states
    //

    setPath(action) {
        const lookup = { l: 'left', r: 'right' }
        var side = action.part;
        var nextUIM = { shape: 'open', side: lookup[side], pathPart: [side] };
        return { nextUIM, setBeforeWait: false };  //setBeforeWait means set the new state and then wait for the key child to appear, otherwise wait for the key child to appear and then set the new state.
    }

    actionToState(action, uim) {
        logger.info("UIMPromote.actionToState", { action }, { uim });
        var nextUIM = {};
        if (action.type === "CHILD_SHAPE_CHANGED") {
            let delta = {};
            if (action.shape === 'open') delta.side = action.side; // action is to open, this side is going to be the open side
            else if (action.side === uim.side) delta.side = null; // if action is to truncate (not open), and it's from the side that's open then truncate this
            if (delta.side && uim.side && uim.side !== delta.side) this.toChild[uim.side]({ type: "CHANGE_STATE", shape: 'truncated' }); // if a side is going to be open, and it's not the side that is open, close the other side
            if (delta.side) delta.pathPart = [delta.side[0]]; // if a side is open, include it in the partPath
            else delta.pathPart = []; //otherwise no path part
            Object.assign(nextUIM, uim, delta);
            return nextUIM; // return the new state
        } else if (action.type === "CLEAR_EXPANDERS") {
            let delta = {};
            delta.side = null; // action is to open, this side is going to be the open side
            delta.pathPart = []; //otherwise no path part
            Object.assign(nextUIM, uim, delta);
            return nextUIM; // return the new state
        } else return null; // don't know the action type so let the default handler have it
    }

    //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

    voteEmitter = new EventEmitter();

    //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

    componentDidMount() {
        this.voteEmitter
            .on('next', this.next.bind(this))
            .on('promote', this.promote.bind(this));
    }

    //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

    next() {
        this.props.uim.toParent({ type: "CLEAR_EXPANDERS" })
        this.transitionedOC['left'].toggle(false);
        this.transitionedOC['right'].toggle(false);
        this.buttons = { event: 'next', position: null };
    }

    //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    promote(position) {
        this.props.uim.toParent({ type: "CLEAR_EXPANDERS" })
        this.buttons = { event: 'promote', position: position };
        if (position === 'left') { this.transitionedOC['right'].toggle(false); }
        if (position === 'right') { this.transitionedOC['left'].toggle(false); }
    }

    //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    componentWillUnmount() {
        this.voteEmitter
            .removeListener('next', this.next.bind(this))
            .removeListener('promote', this.promote.bind(this));
    }

    buttons = { event: null, position: null };
    slideClosed=[];

    slide(side, opened) {
      console.info("UIMPromotoe.slide",side, opened);
      const opposite={left: 'right', right: 'left'}, hiddenDuration=250;// hold closed position for 250mSec
        if (!opened) {
            if (this.buttons.event === 'promote') {
                this.props.emitter.emit('promote', this.buttons.position);
                this.buttons.event = 'null';
                this.slideClosed[side] = false;
                setTimeout(()=>{if(this.transitionedOC[side] && this.transitionedOC[side].toggle) this.transitionedOC[side].toggle(true)},hiddenDuration); // element might not exist later
            } else if (this.buttons.event === 'next' && this.slideClosed[opposite[side]]) { // if next and the other side is closed too
                this.props.emitter.emit('next');
                this.buttons.event = 'null';
                this.slideClosed[opposite[side]] = false;
                setTimeout(()=>{if(this.transitionedOC['left'] && this.transitionedOC['left'].toggle) this.transitionedOC['left'].toggle(true); if(this.transitionedOC['right'] && this.transitionedOC['right'].toggle)this.transitionedOC['right'].toggle(true)},hiddenDuration); //element might be deleted later
            } else {
                this.slideClosed[side] = true;
            }
        }
    }

    //**********************************************************

    render() {
        const { panel, show, cursor, limit, evaluation, left, right, emitter, panelEmitter, user, uim } = this.props;

        const hideFeedback = (panel && panel.type && panel.type.feedbackMethod) ? panel.type.feedbackMethod === 'hidden' : false;
        const evaluateQuestion= (panel && panel.type && panel.type.evaluateQuestion) ? panel.type.evaluateQuestion : "Which of these is most important for the community to consider?";
        const foo = ( ! left || ! right ) ? ( <div></div> ) : (<h5 className="text-center gutter solid">{ evaluateQuestion }</h5>)

        if(!(evaluation && evaluation.criterias)){
          return (
            <div>
              <Loading message="Loading evaluation" />
            </div>
          );
        }

        const renderFeedback = () => {
            if (!hideFeedback) {
                return (
                    [<Feedback className="gutter-top solid" />,
                    <Sliders criterias={evaluation.criterias} className="promote-sliders" />]
                );
            } else return null;
        }

        const renderSide = (side, item) => {
            return (
                <DoubleWide left={side === 'left'} right={side == 'right'} expanded={uim.side === side} >
                    <TransitionOC className={"promote slider " + side} ref={(comp) => { this.transitionedOC[side] = comp }} onChange={this.slide.bind(this, side)} active={true} >
                        <Item item={item} user={user} position={side} key={'item-' + side}
                            buttons={['Harmony']} className="whole-border" uim={{ shape: 'truncated', depth: uim.depth, toParent: this.toMeFromChild.bind(this, side) }}
                        />
                        {renderFeedback()}
                        <PromoteBigScreenButtons className="promote-big-button"
                            key={side + "buttons"}
                            item={item}
                            position={side}
                            emitter={this.voteEmitter}
                        />
                    </TransitionOC>
                </DoubleWide>
            );
        }

        return (
            <div>
                <header className="text-center gutter-bottom solid">
                    <h2>
                        <span className="cursor">{cursor}</span>
                        <span> of </span>
                        <span className="limit">{limit}</span>
                    </h2>
                    <h4>{evaluateQuestion}</h4>
                </header>
                <div className="solid">
                    <div className="solid clear">
                        {renderSide('left', left, right)}
                        {renderSide('right', right, left)}
                    </div>
                    <div className="solid clear" style={{ width: '100%' }}>
                        {foo}
                    </div>
                </div>
                <div className="gutter-top gutter-bottom solid">
                    <FinishButton
                        cursor={cursor}
                        limit={limit}
                        emitter={this.voteEmitter}
                    />
                </div>
            </div>
        );
    }
}
