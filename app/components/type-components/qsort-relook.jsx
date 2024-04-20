'use strict';

import React from 'react';
import ItemStore from '../store/item';
import FlipMove from 'react-flip-move';
import smoothScroll from '../../lib/app/smooth-scroll';
import Color from 'color';
import QSortButtonList from '../qsort-button-list';
import QVoteLocal from '../store/qvote-local';
import Accordion          from 'react-proactive-accordion';
import Item from '../item';
import PanelHeading from '../panel-heading';
import { ReactActionStatePath, ReactActionStatePathClient, ReactActionStatePathFilter } from 'react-action-state-path';
import RASPFocusHere from '../rasp-focus-here';
import DoneItem from '../done-item';
import insertQVote from '../../api-wrapper/insert-qvote';

class QSortReLook extends React.Component {
    render() {
        //console.info("QSortReLook");
        return (
            <ReactActionStatePath {...this.props} >
                    <PanelHeading items={[]} cssName={'syn-qsort-relook'} panelButtons={['Instruction']} >
                        <QVoteLocal  >
                            <RASPQSortReLook />
                        </QVoteLocal>
                    </PanelHeading>
            </ReactActionStatePath>
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
        //console.info("QsortReLook.constructor",props);
        this.createDefaults();
    }

    //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    // 
    actionToState(action, rasp, source, defaultRASP, delta) {
        //find the section that the itemId is in, take it out, and put it in the new section
        var nextRASP={};
        if (action.type === "DESCENDANT_FOCUS" && (!action.button || action.button==='Harmony')) {  // any decendant focus action except a qsortbutton
            if (action.itemId) {
                delta.itemId = action.itemId;
                if(rasp.itemId){
                    if(rasp.itemId !== action.itemId){
                        this.toChild[rasp.itemId]({type: "RESET_SHAPE"});
                    }
                }
                if(this.toChild[action.itemId]) this.toChild[action.itemId]({type: "FOCUS_STATE"});
            }
        } else if(action.type === "DESCENDANT_UNFOCUS" && (action.distance===1 || action.distance===3)) {
            delta.itemId = null; // turn off the itemId
            var itemId;
            if((itemId=action.itemId) && this.toChild[itemId]) this.toChild[itemId]({type: "UNFOCUS_STATE", button: "Harmony"});
            this.mounted[itemId] && this.mounted[itemId].ref && setTimeout(()=>Synapp.ScrollFocus(this.mounted[itemId].ref,500),500); //scroll to here
        } else if(action.type==="TOGGLE_QBUTTON") {
            delta.itemId=null;
            if(rasp.itemId){
                this.toChild[rasp.itemId]({type: "RESET_SHAPE"});
            }
            //this browser may scroll the window down if the element being moved is below the fold.  Let the browser do that, but then scroll back to where it was.
            //this doesn't happen when moveing and object up, above the fold. 
            var doc = document.documentElement;
            this.currentTop = (window.pageYOffset || doc.scrollTop) - (doc.clientTop || 0);
            this.scrollBackToTop = true;
            this.props.toggle(action.itemId, action.button); // toggle the item in QSort store
            insertQVote({ item: action.itemId, criteria: action.button });
            delta.creator=false;
        } else if (action.type==="TOGGLE_CREATOR"){
            delta.creator= !rasp.creator;
        } else if (action.type==="RESET"){
            if(this.props.resetStore) this.props.resetStore();
            return null;
        } else if (action.type === "TOGGLE_FOCUS" && rasp.itemId) {
            delta.itemId = null;
        } else if (action.type === "TOGGLE_FOCUS" && !rasp.itemId) {
            this.queueUnfocus(action);
        } else if(Object.keys(delta).length){
            ; // do nothing but generate the nextRASP 
        } else
            return null;
        Object.assign(nextRASP, rasp, delta);
        nextRASP.shape=nextRASP.itemId ? 'open' : 'truncated';
        let {items, index} = this.props.shared;
        if(nextRASP.itemId) nextRASP.pathSegment=items[index[nextRASP.itemId]].id; // get the short id
        else nextRASP.pathSegment=null;
        return(nextRASP);
    }

    //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

    segmentToState(action, initialRASP) {
        let {items} = this.props.shared;
        var nextRASP={};
        var parts = action.segment.split(',');
        parts.forEach(part=>{
          if(part.length===5) items.some((item)=>item.id===part ? (nextRASP.itemId=item._id) : false);
          else console.error("QSortReLook.segmentToState unexpected part:", part);
        }) 
        if(nextRASP.pathSegment !== action.segment) console.error("QSortReLook.segmentToAction calculated path did not match",action.pathSegment, nextRASP.pathSegment )
        return { nextRASP, setBeforeWait: true }
    }

        // if the panel is done, say so
        isDone(props){
            return (
                !props.sections['unsorted'].length // if there are no unsorted items
                && !Object.keys(this.QSortButtonList).some(criteria=>{ // there is no some section[criteria] where
                    let max=this.QSortButtonList[criteria].max; 
                    if(max && props.sections[criteria] && (props.sections[criteria].length > max)) // there are more items than max 
                        return true; 
                    else 
                        return false;
                })
            )
        }
    //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

    onFlipMoveFinishAll() {
        if (this.scrollBackToTop) {
            this.scrollBackToTop = false;
            if(!this.isDone(this.props))
                setTimeout(() => { smoothScroll(this.currentTop, this.motionDuration * 1.5) }, 100);
        }
        if (this.props.onFinishAll) { return this.props.onFinishAll() }
    }

    //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~


    //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    mounted=[];

    render() {

        const { user, rasp, shared, type, sections } = this.props;
        const {items, index} = shared;
        const qbuttons=this.QSortButtonList

        const {createMethod="visible", promoteMethod="visible", feedbackMethod="visible"} = type;

        //console.info("RASPQSortReLook");

        const onServer = typeof window === 'undefined';

        var content = [], direction = [], loading = [], constraints=[];

        if (!Object.keys(index).length) {
            loading.push(
                <div key="loading" className="gutter text-center">Nothing here?</div>
            );
        } else {
            if (sections['unsorted'].length) { constraints.push(sections['unsorted'].length + ' to sort') }
            Object.keys(qbuttons).forEach((criteria) => {  // the order of the buttons matters, this as the reference. props.sections may have a different order because what's first in db.
                if (!sections[criteria]) { return; }
                let qb = qbuttons[criteria];
                if (qb.max) {
                    if (sections[criteria].length > qb.max) {
                        direction.push(
                            <div key="max" className='instruction-text' style={{ backgroundColor: Color(qb.color).darken(0.1) }}>
                                {qb.direction}
                            </div>
                        )
                        constraints.push(qb.direction);
                    }
                }
                sections[criteria].forEach(itemId => {
                    let item = items[index[itemId]];
                    let active=item._id===rasp.itemId; // this item is active
                    if(!this.mounted[item._id] || (this.mounted[item._id].criteria !== criteria) || (this.mounted[item._id].active !== active )) {
                        this.mounted[item._id]=(
                            {   content: 
                                <div ref={(ref)=>{ref && (this.mounted[item._id].ref=ref)}}>
                                    <ItemStore item={item} key={`item-${item._id}`}>
                                        <Item
                                            style={{ backgroundColor: qbuttons[criteria].color }}
                                            user={user}
                                            buttons={['QSortButtons', { component: 'Harmony', 
                                                                        visualMethod: 'titleize', 
                                                                        shape: 'title', 
                                                                        limit: 5, 
                                                                        hideFeedback: 
                                                                        feedbackMethod==='hidden', 
                                                                        createMethod: 'visible', 
                                                                        promoteMethod: 'visible', 
                                                                        active: (criteria === 'unsorted' || active)
                                                                        }]}
                                            qbuttons={qbuttons}
                                            rasp={ this.childRASP('truncated', item._id) }
                                        />
                                    </ItemStore>
                                </div>,
                                criteria: criteria,
                                active: active
                            }
                        );
                    }
                    content.push(
                        <Accordion active={(this.props.rasp.itemId && this.props.rasp.itemId===item._id) || !this.props.rasp.itemId} key={item._id} >
                            {this.mounted[item._id].content}
                        </Accordion>
                    );
                });
            });
            if (!constraints.length) {
                this.queueAction({type: "RESULTS", results: this.results});
            } else 
                this.queueAction({type: "ISSUES"});
        }
        return (
            <section id="syn-panel-qsort-harmony">
                {direction}
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
                <DoneItem 
                    constraints={constraints}
                    active={!constraints.length}
                    message={qbuttons['unsorted'].direction}
                    onClick={()=>rasp.toParent({ type: "NEXT_PANEL", results: this.results})}
                />
            </section>
        );
    }
}
