'use strict';

import React from 'react';
import Panel from '../panel';
import panelType from '../../lib/proptypes/panel';
import QSortButtons from '../qsort-buttons';
import ItemStore from '../store/item';
import FlipMove from 'react-flip-move';
import QSortFlipItem from '../qsort-flip-item';
import smoothScroll from '../../lib/app/smooth-scroll';
import Instruction from '../instruction';
import Color from 'color';
import Button           from '../util/button';
import QSortButtonList from '../qsort-button-list';
import merge from 'lodash/merge';
import QVoteTotals from '../store/qvote-totals';
import Accordion from  '../util/accordion';
import Item    from '../item';
import Harmony              from '../harmony';
import PanelHead from '../panel-head';
import {ReactActionStatePath, ReactActionStatePathClient} from 'react-action-state-path';


class QSortFinale extends React.Component{
    render (){
        console.info("QSortFinale");
        return(
            <QVoteTotals {...this.props} >
                <PanelHead cssName={'syn-qsort-finale'} >
                    <ReactActionStatePath>
                        <RASPQSortFinale/>
                    </ReactActionStatePath>
                </PanelHead>
            </QVoteTotals>
        );
    }
}
export default QSortFinale;

class RASPQSortFinale extends ReactActionStatePathClient {

    motionDuration = 500; //500mSec

    currentTop = 0; //default scroll position
    scrollBackToTop = false;

    constructor(props){
        super(props, 'shortId', 1);
        if(this.props.qbuttons){ this.QSortButtonList = this.props.qbuttons; }
        else { this.QSortButtonList=QSortButtonList; }
    }

    actionToState(action, rasp, source, initialRASP) {
        var nextRASP = {}, delta = {};
        console.info("RASPQSortFinale.actionToState", ...arguments);
        if (action.type === "CHILD_SHAPE_CHANGED") {
            if (!action.shortId) logger.error("RASPQFortFinale.actionToState action without shortId", action);
            if (action.distance === 1) { //if this action is from an immediate child 
                if (action.shape === 'open' && action.shortId) {
                    delta.shortId = action.shortId;
                    if (rasp.shortId) {
                        if (rasp.shortId !== action.shortId) {
                            this.toChild[rasp.shortId]({ type: "RESET_SHAPE" });
                        }
                    }
                } else {
                    if (rasp.shortId) this.toChild[rasp.shortId]({ type: "RESET_SHAPE" });
                    delta.shortId = null; // turn off the shortId
                }
            }
        } else
            return null;
        Object.assign(nextRASP, rasp, delta);
        if (nextRASP.shortId) nextRASP.shape = 'open';
        else nextRASP.shape = initialRASP.shape;
        if (nextRASP.shape === 'open') nextRASP.pathSegment = nextRASP.shortId;
        else nextRASP.pathSegment = null;
        return nextRASP;
    }

    // set the state from the pathSegment. 
    // the shortId is the path segment
    segmentToState(action) {
        var nextRASP={shape: 'truncated', pathSegment: action.segment};
        var shortId = action.segment;
        if(!shortId) console.error("PanelItems.segmentToState no shortId found");
        else {
            nextRASP.shape='open'; 
            nextRASP.shortId=shortId;
        }
        return { nextRASP, setBeforeWait: false }
    }

    onFlipMoveFinishAll() {
        if (this.scrollBackToTop) {
            this.scrollBackToTop = false;
            setTimeout(() => { smoothScroll(this.currentTop, this.motionDuration * 1.5) }, 100);
        }
        if(this.props.onFinishAll){return this.props.onFinishAll()}
    }

    //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

    render() {
        const { user, emitter, rasp, shared } = this.props;
        const items=shared.items;

        console.info("QSortFinale");
        const onServer = typeof window === 'undefined';
        let content = [], direction = [], instruction = [], issues = 0, done = [], loading=[];

        if (!Object.keys(this.props.finale).length) {
            loading.push(
                <div className="gutter text-center">
                    <p>Loading ...</p>
                </div>
            );
        } else {
            this.props.finale.forEach(qobj => {
                var qbuttonTotals=[];
                Object.keys(this.QSortButtonList).forEach(button => qbuttonTotals[button]=Object.assign({},QSortButtonList[button],{total: qobj[button] || 0}) );
                var item = items[qobj.index];
                let active = rasp.shortId ? rasp.shortId === item.id ? true : false : true;
                let shape = 'truncated';
                content.push(
                    {
                        user: user,
                        item: item,
                        buttons: [{component: 'QSortButtons', qbuttons: qbuttonTotals},'Harmony'],
                        qbuttons: qbuttonTotals,
                        id: item._id,
                        rasp: {shape: shape, depth: rasp.depth, toParent: this.toMeFromChild.bind(this,item.id)},
                        active: active
                    }
                );
            });
        }

        return (
            <section id="syn-panel-qsort-finale">
                {direction}
                {done}
                <div style={{ position: 'relative', display: 'block'}}>
                    <div className="qsort-flip-move-articles">
                        { content.map(article => <QSortFlipItemHarmony {...article} key={article.id} />) }
                    </div>
                </div>
                {loading}
            </section>
        );
    }
}

//                            <FlipMove duration={this.motionDuration} onFinishAll={this.onFlipMoveFinishAll.bind(this)} disableAllAnimations={onServer}>
//                            </FlipMove>

class QSortFlipItemHarmony extends React.Component {
    constructor(props){
        super(props)
        console.info("QSortFlipItemHarmony.constructor",props);
    }
    render() {
        const { qbuttons, buttons, item, user, rasp, active } = this.props;
        return (
            <Accordion active={active} name='item' key={item._id + '-qsort-finale'} style={{ backgroundColor: qbuttons['unsorted'].color }}>
                <ItemStore item={item} key={`item-${item._id}`}>
                    <Item
                        user={user}
                        buttons={buttons}
                        rasp={rasp}
                    />
                </ItemStore>
            </Accordion>
        );
    }
}