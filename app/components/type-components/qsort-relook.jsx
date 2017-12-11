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
import PanelHeading from '../panel-heading';
import { ReactActionStatePath, ReactActionStatePathClient, ReactActionStatePathFilter } from 'react-action-state-path';
import { QSortToggle } from './qsort-items';

class QSortReLook extends React.Component {
    render() {
        //onsole.info("QSortReLook");
        return (
            <ReactActionStatePath {...this.props} >
                <DescendantFocusHere>
                    <PanelHeading  cssName={'syn-qsort-relook'} >
                        <QVoteLocal  >
                            <RASPQSortReLook />
                        </QVoteLocal>
                    </PanelHeading>
                </DescendantFocusHere>
            </ReactActionStatePath>
        );
    }
}
export default QSortReLook;

class DescendantFocusHere extends ReactActionStatePathFilter {
    actionFilters={
        "DESCENDANT_FOCUS": (action, delta) => {
            setTimeout(()=>Synapp.ScrollFocus(this.refs.top,500),500);
            return true;
        }
    }

    render(){
        const {children, ...lessProps}=this.props;
        return(
            <section ref="top">
                {React.Children.map(React.Children.only(children), child=>React.cloneElement(child, lessProps, child.props.children))}
            </section>
        );
    }
}

class RASPQSortReLook extends ReactActionStatePathClient {

    motionDuration = 500; //500mSec

    currentTop = 0; //default scroll position
    scrollBackToTop = false;

    constructor(props) {
        super(props, 'itemId');  // itemId is the key for indexing to child RASP functions
        this.QSortButtonList=this.props.qbuttons || QSortButtonList;
        //onsole.info("QsortReLook.constructor",props);
        this.createDefaults();
    }

    //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    // 
    actionToState(action,rasp) {
        //find the section that the itemId is in, take it out, and put it in the new section
        var nextRASP={}, delta={};
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
            window.socket.emit('insert qvote', { item: action.itemId, criteria: action.button });
            delta.creator=false;
        } else if (action.type==="TOGGLE_CREATOR"){
            delta.creator= !rasp.creator;
        } else if (action.type==="RESET"){
            if(this.props.resetStore) this.props.resetStore();
            return null;
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

        const { user, rasp, shared, type, sections } = this.props;
        const {items, index} = shared;
        const qbuttons=this.props.qbuttons || this.QSortButtonList

        const {createMethod="visible", promoteMethod="visible", feedbackMethod="visible"} = type;

        //onsole.info("RASPQSortReLook");

        const onServer = typeof window === 'undefined';

        let content = [], direction = [], instruction = [], issues = 0, done = [], loading = [];

        if (!Object.keys(index).length) {
            loading.push(
                <div key="loading" className="gutter text-center">Nothing here?</div>
            );
        } else {
            if (sections['unsorted'].length) { issues++ }
            Object.keys(this.QSortButtonList).forEach((criteria) => {  // the order of the buttons matters, this as the reference. props.sections may have a different order because what's first in db.
                if (!sections[criteria]) { return; }
                let qb = this.QSortButtonList[criteria];
                if (qb.max) {
                    if (sections[criteria].length > qb.max) {
                        direction.push(
                            <div key="max" className='instruction-text' style={{ backgroundColor: Color(qb.color).darken(0.1) }}>
                                {qb.direction}
                            </div>
                        )
                        issues++;
                    }
                }
                sections[criteria].forEach(itemId => {
                    let item = items[index[itemId]];
                    let active=item._id===rasp.itemId; // this item is active
                    if(!this.mounted[item._id] || (this.mounted[item._id].criteria !== criteria) || (this.mounted[item._id].active !== active )) {
                        this.mounted[item._id]=(
                            {   content: 
                                <div style={{ backgroundColor: qbuttons[criteria].color }} ref={(ref)=>{ref && (this.mounted[item._id].ref=ref)}}>
                                    <ItemStore item={item} key={`item-${item._id}`}>
                                        <Item
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
                this.queueAction({type: "RESULTS", results: this.results});
            } else 
                this.queueAction({type: "ISSUES"});
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
