'use strict';

import React from 'react';
import FlipMove from 'react-flip-move';
import QSortFlipItem from '../qsort-flip-item'
import smoothScroll from '../../lib/app/smooth-scroll';
import Color from 'color';
import PanelStore from '../store/panel';
import QVoteStore from '../store/qvote';
import {ReactActionStatePath, ReactActionStatePathClient} from 'react-action-state-path';
import PanelHeading from '../panel-heading';
import TypeComponent from '../type-component';
import config from '../../../public.json';
import DoneItem from '../done-item';
import insertQVote from '../../api-wrapper/insert-qvote';

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
        const {type}=this.props.panel;
        return(
            <PanelStore parent={this.props.item}
                        type={type}
                        limit={20}
            >
                <QVoteStore {...this.props}>
                    <ReactActionStatePath>
                        <PanelHeading  type={type} cssName={'syn-rule-list'} panelButtons={['Instruction','Creator']} >
                            <RASPRuleList />
                        </PanelHeading>
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
        //console.info("RASPRuleList.constructor", props);
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
    actionToState(action,rasp,source,initialRASP,delta) {
        //find the section that the itemId is in, take it out, and put it in the new section
        if(rasp.itemId==='redirect') {
            action.distance-=1; // if redirect, don't add to distance
            return null;
        }
        var nextRASP={};
        if(action.type==="TOGGLE_QBUTTON") {
            //this browser may scroll the window down if the element being moved is below the fold.  Let the browser do that, but then scroll back to where it was.
            //this doesn't happen when moveing and object up, above the fold. 
            this.neededInputAtStart=true;
            var doc = document.documentElement;
            this.currentTop = (window.pageYOffset || doc.scrollTop) - (doc.clientTop || 0);
            this.scrollBackToTop = true;
            this.props.toggle(action.itemId, action.button); // toggle the item in QSort store
            insertQVote({ item: action.itemId, criteria: action.button });
            delta.creator=false;
            this.queueFocus(action);
        } else if (action.type==="TOGGLE_CREATOR"){
            delta.creator= !rasp.creator;
            if(delta.creator) this.queueFocus(action); 
            else this.queueUnfocus(action);
        } else if (action.type==="REDIRECT"){
            delta.itemId='redirect';
            this.queueFocus(action);
        } else if (action.type==='RESET_SHAPE'){
            delta.shape='truncated';
            if(action.itemId) this.toChild[itemId]({type: 'RESET_SHAPE'});
            delta.itemId=null;
            this.neededInputAtStart=false;
        } else if (action.type === "TOGGLE_FOCUS") {
            if(action.distance===0) // if TOGGLE action is from further away, it should have been consumed but consume it here.
                this.queueUnfocus(action);
        } else if(Object.keys(delta).length){
            ; // no need to do anything, but do continue to calculate the nextRASP
        } else 
            return null;
        Object.assign(nextRASP, rasp, delta);
        this.deriveRASP(nextRASP,initialRASP)
        return(nextRASP);
    }

    segmentToState(action, initialRASP) {
        var nextRASP = {}, delta={};
        if(action.segment==='r') delta.itemId="redirect";
        else console.error("RuleList SegmentToState received unexpected segment:",action.segment);
        Object.assign(nextRASP,initialRASP,delta);
        this.deriveRASP(nextRASP, initialRASP);
        if (nextRASP.pathSegment !== action.segment) console.error("profile-panel.segmentToAction calculated path did not match", action.pathSegment, nextRASP.pathSegment)
        return { nextRASP, setBeforeWait: true }  // set nextRASP as state before waiting for child
    }

    deriveRASP(nextRASP, initialRASP){
        if(nextRASP.itemId==='redirect') nextRASP.shape='redirect';
        if(nextRASP.itemId==='redirect') nextRASP.pathSegment='r';
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
        if(newProps.rasp.itemId!=='redirect' && this.state.typeList.length && newProps.sections['unsorted'].length===0 && newProps.sections['agree'] && newProps.sections['agree'].length && !this.neededInputAtStart)
            this.props.rasp.toParent({type: "REDIRECT"});
    }

    //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

    render() {
        //console.info("RASPRuleList.render");

        const { count, user, rasp, items, type, parent, panel, buttons=['QSortButtons'], ...otherProps } = this.props;

        const onServer = typeof window === 'undefined';

        let articles = [], creator,
            direction = [], instruction = [], issues = 0, done = [], loading=[];
        
        var doneActive=false;

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
                            buttons: buttons,
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
                doneActive=true;
            }
        }


        return (
            <section id="syn-panel-rule-list" key='syn-panel-rule-list'>
                {direction}
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
                <DoneItem active={doneActive} onClick={()=>this.props.rasp.toParent({type: "REDIRECT"})} message={this.QSortButtonList['unsorted'].direction} />
            </section>
        );
    }
}

export default RuleList;



