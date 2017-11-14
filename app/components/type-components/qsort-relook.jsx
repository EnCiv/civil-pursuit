'use strict';

import React from 'react';
import Panel from '../panel';
import panelType from '../../lib/proptypes/panel';
import ItemStore from '../store/item';
import FlipMove from 'react-flip-move';
import QSortFlipItem from '../qsort-flip-item'
import smoothScroll from '../../lib/app/smooth-scroll';
import Instruction from '../instruction';
import Color from 'color';
import Button from '../util/button';
import QSortButtonList from '../qsort-button-list';
import merge from 'lodash/merge';
import QVoteLocal from '../store/qvote-local';
import Accordion          from 'react-proactive-accordion';
import Item from '../item';
import Harmony from '../harmony';
import PanelHead from '../panel-head';
import { ReactActionStatePath, ReactActionStatePathClient } from 'react-action-state-path';
import { QSortToggle } from './qsort-items';

class QSortReLook extends React.Component {
    render() {
        //onsole.info("QSortReLook");
        return (
            <PanelHead {...this.props} cssName={'syn-qsort-relook'} >
                <QVoteLocal  >
                    <ReactActionStatePath>
                        <RASPQSortReLook />
                    </ReactActionStatePath>
                </QVoteLocal>
            </PanelHead>
        );
    }
}
export default QSortReLook;

class RASPQSortReLook extends ReactActionStatePathClient {

    motionDuration = 500; //500mSec

    currentTop = 0; //default scroll position
    scrollBackToTop = false;

    constructor(props) {
        super(props, 'itemId');  // itemId is the key for indexing to child RASP functions
        this.QSortButtonList=this.props.qbuttons || QSortButtonList;
        //onsole.info("QsortReLook.constructor",props);
    }

    //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    // 
    actionToState(action,rasp) {
        //find the section that the itemId is in, take it out, and put it in the new section
        var nextRASP={}, delta={};
        if (action.type === "DECENDANT_FOCUS") {
            if (!action.itemId) logger.error("RASPQFortRelook.actionToState action without itemId", action);
            if (action.itemId) {
                delta.itemId = action.itemId;
                delta.shape='open';
                if(rasp.itemId){
                    if(rasp.itemId !== action.itemId){
                        this.toChild[rasp.itemId]({type: "RESET_SHAPE"});
                    }
                }
            } 
        } else if(action.type === "DECENDANT_UNFOCUS" && action.distance===1) {
            delta.itemId = null; // turn off the itemId
            delta.shape = 'truncated';
        } else if(action.type==="TOGGLE_QBUTTON") {
            //this browser may scroll the window down if the element being moved is below the fold.  Let the browser do that, but then scroll back to where it was.
            //this doesn't happen when moveing and object up, above the fold. 
            var doc = document.documentElement;
            this.currentTop = (window.pageYOffset || doc.scrollTop) - (doc.clientTop || 0);
            this.scrollBackToTop = true;
            this.props.toggle(action.itemId, action.button); // toggle the item in QSort store
            window.socket.emit('insert qvote', { item: action.itemId, criteria: action.button });
            delta.creator=false;
        } else if (action.type==="TOGGLE_CREATOR"){
            delta.creator= !rasp.creator;
        } else return null;
        Object.assign(nextRASP, rasp, delta);
        //if(nextRASP.shape==='open') nextRASP.pathSegment=items[this.shared.index[nextRASP.itemId].id; 
        //else nextRASP.pathSegment=null;
        return(nextRASP);
    }

    //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

    onFlipMoveFinishAll() {
        if (this.scrollBackToTop) {
            this.scrollBackToTop = false;
            setTimeout(() => { smoothScroll(this.currentTop, this.motionDuration * 1.5) }, 100);
        }
        if (this.props.onFinishAll) { return this.props.onFinishAll() }
    }

    //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~


    //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    mounted=[];

    render() {

        const { user, rasp, shared, type } = this.props;
        const items=shared.items;
        const qbuttons=this.props.qbuttons || this.QSortButtonList

        const {createMethod="visible", promoteMethod="visible", feedbackMethod="visible"} = type;

        //onsole.info("RASPQSortReLook");

        const onServer = typeof window === 'undefined';

        let content = [], direction = [], instruction = [], issues = 0, done = [], loading = [];

        if (!Object.keys(this.props.index).length) {
            loading.push(
                <div key="loading" className="gutter text-center">Nothing here?</div>
            );
        } else {
            if (this.props.sections['unsorted'].length) { issues++ }
            Object.keys(this.QSortButtonList).forEach((criteria) => {  // the order of the buttons matters, this as the reference. props.sections may have a different order because what's first in db.
                if (!this.props.sections[criteria]) { return; }
                let qb = this.QSortButtonList[criteria];
                if (qb.max) {
                    if (this.props.sections[criteria].length > qb.max) {
                        direction.push(
                            <div key="max" className='instruction-text' style={{ backgroundColor: Color(qb.color).darken(0.1) }}>
                                {qb.direction}
                            </div>
                        )
                        issues++;
                    }
                }
                this.props.sections[criteria].forEach(itemId => {
                    let item = items[this.props.index[itemId]];
                    if(!this.mounted[item._id] || this.mounted[item._id].criteria !== criteria){
                        this.mounted[item._id]=(
                            {   content: 
                                <div key={item._id} style={{ backgroundColor: qbuttons[criteria].color }} key={item._id}>
                                    <ItemStore item={item} key={`item-${item._id}`}>
                                        <Item
                                            user={user}
                                            buttons={['QSortButtons', { component: 'Harmony', visualMethod: 'titleize', shape: 'title', limit: 5, hideFeedback: feedbackMethod==='hidden', createMethod: 'visible', promoteMethod: 'visible', active: criteria === 'unsorted' }]}
                                            qbuttons={qbuttons}
                                            rasp={ this.childRASP('truncated', item._id) }
                                        />
                                    </ItemStore>
                                </div>,
                                criteria: criteria
                            }
                        );
                    }
                    content.push(this.mounted[item._id].content);
                });
            });
            if (!issues) {
                done.push(
                    <div key="instruction" className='instruction-text'>
                        {this.QSortButtonList['unsorted'].direction}
                        <Button small shy
                            onClick={()=>rasp.toParent({ type: "NEXT_PANEL", results: this.results})}
                            className="qsort-done"
                            style={{ backgroundColor: Color(this.QSortButtonList['unsorted'].color).negate(), color: this.QSortButtonList['unsorted'].color, float: "right" }}
                        >
                            <span className="civil-button-text">{"next"}</span>
                        </Button>
                    </div>
                );
                this.qaction(()=>rasp.toParent({ type: "RESULTS", results: this.results}),0);
            } else 
                this.qaction(()=>rasp.toParent({ type: "ISSUES"}),0);
        }
        return (
            <section id="syn-panel-qsort-harmony">
                {direction}
                {done}
                <div key="flip-list" style={{
                    position: 'relative',
                    display: 'block',
                }}>
                    <div className="qsort-flip-move-articles">
                        <FlipMove duration={this.motionDuration} onFinishAll={this.onFlipMoveFinishAll.bind(this)} disableAllAnimations={onServer}>
                            {content}
                        </FlipMove>
                    </div>
                </div>
                {loading}
            </section>
        );
    }
}
