'use strict';

import React from 'react';
import Panel from '../panel';
import panelType from '../../lib/proptypes/panel';
import ItemStore from '../store/item';
import FlipMove from 'react-flip-move';
import QSortFlipItem from '../qsort-flip-item';
import smoothScroll from '../../lib/app/smooth-scroll';
import Instruction from '../instruction';
import Color from 'color';
import Button from '../util/button';
import QSortButtonList from '../qsort-button-list';
import merge from 'lodash/merge';
import QVoteTotals from '../store/qvote-totals';
import Accordion from 'react-proactive-accordion';
import Item from '../item';
import Harmony from '../harmony';
import PanelHeading from '../panel-heading';
import { ReactActionStatePath, ReactActionStatePathClient } from 'react-action-state-path';
import union from 'lodash/union';
import RASPFocusHere from '../rasp-focus-here';


class QSortFinale extends React.Component {
    state = { type: null };

    constructor(props) {
        super(props);
        const { type } = props;
        if (typeof type === 'string' && typeof window !== 'undefined') {
            window.socket.emit('get listo type', [type], this.okGetListoType.bind(this))
        } else
            this.state.type=this.props.type;
    }

    okGetListoType(typeList) {
        if (typeList && typeList.length && typeList[0]._id === this.props.type)
            this.setState({ type: typeList[0] });
    }

    render() {
        //onsole.info("QSortFinale");
        if(!this.state.type) return null; // don't render until the type info has been filled in
        return (
            <QVoteTotals{...this.props} type={this.state.type} >
                <ReactActionStatePath >
                    <RASPFocusHere filterTypes={['COMPONENT_DID_MOUNT',{type: 'DESCENDANT_FOCUS', distance: 1}, {type: 'DESCENDANT_FOCUS', distance: 2}]} >
                        <PanelHeading items={[]} cssName={'syn-qsort-finale'} panelButtons={['Instruction']} >
                            <RASPQSortFinale />
                        </PanelHeading>
                    </RASPFocusHere>
                </ReactActionStatePath>
            </QVoteTotals>
        );
    }
}
export default QSortFinale;

class RASPQSortFinale extends ReactActionStatePathClient {

    motionDuration = 500; //500mSec

    currentTop = 0; //default scroll position
    scrollBackToTop = false;

    constructor(props) {
        super(props, 'shortId', 0);
        if (this.props.qbuttons) { this.QSortButtonList = this.props.qbuttons; }
        else { this.QSortButtonList = QSortButtonList; }
        this.createDefaults();
    }

    actionToState(action, rasp, source, initialRASP, delta) {
        var nextRASP = {};
        //onsole.info("RASPQSortFinale.actionToState", ...arguments);
        if (action.type === "DESCENDANT_FOCUS" && action.distance > 0) {
            if (!action.shortId) logger.error("RASPQFortFinale.actionToState action without shortId", action);
            if (action.shortId) {
                delta.shortId = action.shortId;
                delta.shape = 'open';
                if (rasp.shortId) {
                    if (rasp.shortId !== action.shortId) {
                        this.toChild[rasp.shortId]({ type: "RESET_SHAPE" });
                    }
                }
            }
        } else if (action.type === "DESCENDANT_UNFOCUS" && (action.distance === 1 || action.distance==3)) {
            delta.shortId = null; // turn off the shortId
        } else if (action.type === "RESET") {
            if (this.props.resetStore) this.props.resetStore();
            return null;
        } else if (action.type === "TOGGLE_FOCUS" && rasp.shortId) {
            delta.shortId = null;
        } else if (action.type === "TOGGLE_FOCUS" && !rasp.shortId) {
            this.queueUnfocus(action);
        } else if (action.type==="UNFOCUS_STATE") {
            delta.shortId = null;
        } else if (action.type==="FOCUS_STATE") {
            if(action.shortId && this.toChild[action.shortId]) delta.shortId=action.shortId;
        } else if (Object.keys(delta).length) {
            ; // no need to do anything, it's been done. But do continue on to calculating the nextRASP
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
        var nextRASP = { shape: 'truncated', pathSegment: action.segment };
        var shortId = action.segment;
        if (!shortId) console.error("PanelItems.segmentToState no shortId found");
        else {
            nextRASP.shape = 'open';
            nextRASP.shortId = shortId;
        }
        return { nextRASP, setBeforeWait: false }
    }

    onFlipMoveFinishAll() {
        if (this.scrollBackToTop) {
            this.scrollBackToTop = false;
            setTimeout(() => { smoothScroll(this.currentTop, this.motionDuration * 1.5) }, 100);
        }
        if (this.props.onFinishAll) { return this.props.onFinishAll() }
    }

    shouldComponentUpdate(newProps){
        if(union(Object.keys(this.props.rasp),Object.keys(newProps.rasp)).some(key=>{
            if(['toParent','depth','raspId','creator','instruction'].includes(key)) return false;  // ignore these attributes.
            return(this.props.rasp[key]!==newProps.rasp[key])
        })) return true;
        if(this.props.finale != newProps.finale) {console.info("QSortFinaly.shouldComponentUpdate finale changed"); return true};
        return false;
    }
    //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

    render() {
        const { user, rasp, shared, type } = this.props;
        const items = shared.items;
        const { createMethod = "visible", promoteMethod = "visible", feedbackMethod = 'visible' } = type;

        //onsole.info("QSortFinale");
        const onServer = typeof window === 'undefined';
        let content = [], direction = [], instruction = [], issues = 0, done = [], loading = [];

        if (!Object.keys(this.props.finale).length) {
            loading.push(
                <div key="loading" className="gutter text-center">
                    <p>Loading ...</p>
                </div>
            );
        } else {
            this.props.finale.forEach(qobj => {
                var qbuttonTotals = [];
                Object.keys(this.QSortButtonList).forEach(button => qbuttonTotals[button] = Object.assign({}, this.QSortButtonList[button], { total: qobj[button] || 0 }));
                var item = items[qobj.index];
                let active = rasp.shortId ? rasp.shortId === item.id ? true : false : true;
                content.push(
                    {
                        user: user,
                        item: item,
                        buttons: [
                            { component: 'QSortButtons', qbuttons: qbuttonTotals },
                            {   component: 'Harmony', 
                                visualMethod: 'titleize', 
                                shape: 'title', 
                                limit: 5, 
                                hideFeedback: feedbackMethod==='hidden', 
                                createMethod: 'visible', 
                                promoteMethod: 'visible', 
                                active: active,
                                buttonName: 'Disect'
                            }
                        ],
                        qbuttons: qbuttonTotals,
                        id: item._id,
                        rasp: this.childRASP('truncated', item.id),
                        active: active,
                        createMethod: createMethod,
                        promoteMethod: promoteMethod,
                        hideFeedback: feedbackMethod === 'hidden'
                    }
                );
            });
        }

        return (
            <section id="syn-panel-qsort-finale">
                {direction}
                {done}
                <div key="flip-list" style={{ position: 'relative', display: 'block' }}>
                    <div className="qsort-flip-move-articles">
                        {content.map(article => <QSortFlipItemHarmony {...article} key={article.id} />)}
                    </div>
                </div>
                {loading}
                {done}
            </section>
        );
    }
}


class QSortFlipItemHarmony extends React.Component {
    render() {
        const { active, item, qbuttons, ...otherProps } = this.props;
        return (
            <Accordion active={active} name='item' key={item._id + '-qsort-finale'} style={{ backgroundColor: qbuttons['unsorted'].color }}>
                <ItemStore item={item} key={`item-${item._id}`}>
                    <Item {...otherProps} />
                </ItemStore>
            </Accordion>
        );
    }
}