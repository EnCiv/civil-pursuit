'use strict';

import React from 'react';
import panelType from '../../lib/proptypes/panel';
import ItemStore from '../store/item';
import FlipMove from 'react-flip-move';
import QSortFlipItem from '../qsort-flip-item'
import smoothScroll from '../../lib/app/smooth-scroll';
import Color from 'color';
import Button           from '../util/button';
import Creator            from '../creator';
import Accordion          from 'react-proactive-accordion';
import Icon               from '../util/icon';
import PanelStore from '../store/panel';
import QVoteStore from '../store/qvote';
import {ReactActionStatePath, ReactActionStatePathClient} from 'react-action-state-path';
import PanelHead from '../panel-head';
import {QSortToggle} from './qsort-items';
import TypeComponent from '../type-component';


const RuleButtonList = {
    unsorted: {
        name: 'unsorted',
        color: '#ffffff',
        title: {
            active: "Agreed!",
            inactive: "Agree with this rule of engagement"
        },
        direction: 'Great! You have completed this step. You can review your choices or continue to the next step.'
    },
    agree: {
        name: 'agree',
        color: '#e0e0ff',
        title: {
            active: "Agreed",
            inactive: "Agree with this rule of engagement"
        }
    },
}

export class RuleList extends React.Component {
    render(){
        //logger.info("RuleList.render", this.props);
        return(
            <PanelStore parent={this.props.item}
                        type={this.props.type || (this.props.panel && this.props.panel.type)}
                        limit={20}
            >
                <QVoteStore {...this.props}>
                    <ReactActionStatePath>
                        <PanelHead  cssName={'syn-rule-list'} >
                            <RASPRuleList />
                        </PanelHead>
                    </ReactActionStatePath>
                </QVoteStore>
            </PanelStore>
        );
    }
}

export class RASPRuleList extends ReactActionStatePathClient {

    motionDuration = 500; //500mSec

    currentTop = 0; //default scroll position
    scrollBackToTop = false;

    state={typeList: []}

    constructor(props){
        super(props, 'itemId');  // itemId is the key for indexing to child RASP functions
        this.QSortButtonList=this.props.qbuttons || RuleButtonList;
        //onsole.info("RASPRuleList.constructor", props);
        if (typeof window !== 'undefined' && this.props.type.harmony) 
        window.socket.emit('get listo type', this.props.type.harmony, this.okGetListoType.bind(this));
        this.createDefaults();
    }

    okGetListoType(typeList) {
        this.setState({ typeList: typeList });
        this.componentWillReceiveProps(this.props);
    }
    //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    // 
    actionToState(action,rasp) {
        //find the section that the itemId is in, take it out, and put it in the new section
        var nextRASP={}, delta={};
        if(action.type==="TOGGLE_QBUTTON") {
            //this browser may scroll the window down if the element being moved is below the fold.  Let the browser do that, but then scroll back to where it was.
            //this doesn't happen when moveing and object up, above the fold. 
            this.neededInputAtStart=true;
            var doc = document.documentElement;
            this.currentTop = (window.pageYOffset || doc.scrollTop) - (doc.clientTop || 0);
            this.scrollBackToTop = true;
            this.props.toggle(action.itemId, action.button); // toggle the item in QSort store
            window.socket.emit('insert qvote', { item: action.itemId, criteria: action.button });
            delta.creator=false;
            this.queueFocus(action);
        } else if (action.type==="TOGGLE_CREATOR"){
            delta.creator= !rasp.creator;
            this.queueAction({type: delta.creator ? "DESCENDANT_FOCUS" : "DESCENDANT_UNFOCUS"});
        } else if (action.type==="REDIRECT"){
            delta.shape='redirect';
            delta.itemId='redirect';
            this.queueFocus(action);
        } else return null;
        Object.assign(nextRASP, rasp, delta);
        if(nextRASP.itemId==='redirect') nextRASP.pathSegment='r';
        return(nextRASP);
    }

    segmentToState(action,initialRASP){
        var nextRASP={}, delta={};
        if(action.segment==='r') delta.itemId="redirect"
        Object.assign(nextRASP,initialRASP,delta);
        if(nextRASP.itemId==='redirect') nextRASP.pathSegment='r';
        return {nextRASP, setBeforeWait: true}
    }

    onFlipMoveFinishAll() {
        if (this.scrollBackToTop) {
            this.scrollBackToTop = false;
            setTimeout(() => { smoothScroll(this.currentTop, this.motionDuration * 1.5) }, 100);
        }
        if(this.props.onFinishAll){return this.props.onFinishAll()}
    }

    neededInputAtStart=false;

    componentWillReceiveProps(newProps){
        if(!newProps.rasp.itemId!=='redirect' && this.state.typeList.length && newProps.sections['unsorted'].length===0 && newProps.sections['agree'].length && !this.neededInputAtStart)
            this.props.rasp.toParent({type: "REDIRECT"});
    }

    //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

    render() {
        //onsole.info("RASPRuleList.render");

        const { count, user, rasp, items, type, parent, panel, ...otherProps } = this.props;

        const onServer = typeof window === 'undefined';

        let articles = [], creator,
            direction = [], instruction = [], issues = 0, done = [], loading=[];

        if(rasp.itemId==='redirect' && this.state.typeList.length) {
            const newPanel = {
                parent: panel.parent,
                type: this.state.typeList[0],
                skip: panel.skip || 0,
                limit: panel.limit || config['navigator batch size'],
            };
            return (
                    <TypeComponent  { ...otherProps } user={user} rasp={this.childRASP('truncated','redirect')} component={this.state.typeList[0].component} panel={newPanel} key='syn-panel-rule-redirected' />
            )
        } else if (!Object.keys(this.props.index).length) {
            loading.push(
                <div className="gutter text-center" key="loading">
                    {"loading ..."}
                </div>
            );
        } else {
            if (this.props.sections['unsorted'].length) { issues++ }  
            Object.keys(this.QSortButtonList).forEach((criteria) => {  // the order of the buttons matters, this as the reference. props.sections may have a different order because what's first in db.
                if(!this.props.sections[criteria]){ return; }
                let qb = this.QSortButtonList[criteria];
                if (qb.max) {
                    if (this.props.sections[criteria].length > qb.max) {
                        direction.push(
                            <div className='instruction-text' style={{ backgroundColor: Color(qb.color).darken(0.1) }} key="instruction">
                                {qb.direction}
                            </div>
                        )
                        issues++;
                    }
                }
                this.props.sections[criteria].forEach(itemId => {
                    let item = items[this.props.index[itemId]];
                    articles.push(
                        {
                            sectionName: criteria,
                            qbuttons: this.QSortButtonList,
                            user: user,
                            item: item,
                            id: item._id,
                            rasp: {shape: 'truncated', depth: rasp.depth, button: criteria, toParent: this.toMeFromChild.bind(this,item._id)}
                        }
                    );
                });
            });
            if(!issues) {
                done.push(
                    <div className='instruction-text' key="done">
                        {this.QSortButtonList['unsorted'].direction}
                        <Button small shy
                            onClick={()=>this.props.rasp.toParent({type: "REDIRECT"})} // null is needed here so setState doesn't complain about the mouse event that's the next parameter
                            className="qsort-done"
                            style={{ backgroundColor: Color(this.QSortButtonList['unsorted'].color).negate(), color: this.QSortButtonList['unsorted'].color, float: "right" }}
                            >
                            <span className="civil-button-text">{"next"}</span>
                        </Button>
                    </div>
                )
            }
        }


        return (
            <section id="syn-panel-rule-list" key='syn-panel-rule-list'>
                {direction}
                {done}
                <div style={{ position: 'relative',
                                display: 'block',
                }} key="fliplist">
                    <div className="qsort-flip-move-articles">
                        <FlipMove duration={this.motionDuration} onFinishAll={this.onFlipMoveFinishAll.bind(this)} disableAllAnimations={onServer}>
                            {articles.map(article => <QSortFlipItem {...article} key={article.id} />)}
                        </FlipMove>
                    </div>
                </div>
                {loading}
            </section>
        );
    }
}

export default RuleList;



