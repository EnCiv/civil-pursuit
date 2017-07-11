'use strict';

import React from 'react';
import Panel from '../panel';
import PanelStore from '../store/panel';
import PanelItems from '../panel-items';
import panelType from '../../lib/proptypes/panel';
import QSortButtons from '../qsort-buttons';
import ItemStore from '../store/item';
import update from 'immutability-helper';
import FlipMove from 'react-flip-move';
import QSortFlipItem from '../qsort-flip-item'
import smoothScroll from '../../lib/app/smooth-scroll';
import Instruction from '../instruction';
import Color from 'color';
import Button           from '../util/button';
import Item from '../item';
import Creator            from '../creator';
import QSortButtonList from '../qsort-button-list';
import EvaluationStore    from '../store/evaluation';
import Promote            from '../promote';
import {ReactActionStatePath, ReactActionStatePathClient} from 'react-action-state-path';
import {QSortToggle} from './qsort-items';
import PanelHead from '../panel-head';

class QSortRefine extends React.Component {
    render(){
        return (
            <PanelHead {...this.props} panel={this.props.shared.panel} cssName={'syn-qsort-refine'} >
                <ReactActionStatePath>
                    <RASPQSortRefine />
                </ReactActionStatePath>
            </PanelHead>
        )
    }
}

class RASPQSortRefine extends React.Component {

    ButtonList=[];
    results = {refine: {}};
    buttons=[];

    motionDuration = 500; //500mSec

    state = {};
    currentTop = 0; //default scroll position
    scrollBackToTop = false;

    whyName = '';

    constructor(props) {
        super(props);
        var unsortedList = [];
        this.ButtonList['unsorted']=QSortButtonList['unsorted'];
        const qbuttons=Object.keys(QSortButtonList);
        qbuttons.slice(1).forEach(button => {
            var regex = new RegExp('./*'+button+'./*','i');
            if(this.props.type.name.match(regex)) this.whyName=button;
        });
        if(!this.whyName) {this.whyName=qbuttons[1]; console.error("QSortRefine button name not found in type name:", qbuttons, this.props.type.name)}
        this.results.refine[this.whyName]={};
        this.ButtonList[this.whyName]=QSortButtonList[this.whyName];
        console.info("qsort-refine constructor")
        this.state.sections = {};
        this.buttons = Object.keys(this.ButtonList);
        this.buttons.forEach(button => {
            this.state.sections[button] = [];
        });
        this.state.sections['unsorted'] = Object.keys(this.props.shared.why[this.whyName]);
        console.info("qsortRefine constructor");
    }

    actionToState(action, rasp, source){
        return null;
    }

    //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~  

    componentWillReceiveProps(newProps) { //items that are nolonger there will be removed, existing item section will be preserved, new items will be in unsorted.
        console.info("qsortWhy componentWillReceiveProps");
        var newSections=[];
        this.buttons.forEach(button=> newSections[button]=[] );

        Object.keys(newProps.shared.why[this.whyName]).forEach(itemId=>{
            if(this.state.sections[this.whyName].includes(itemId)){ newSections[this.whyName].push(itemId)} 
            else{ newSections['unsorted'].push(itemId) }
        });

        this.setState({sections: newSections});

    }


    //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

    toggle(itemId, button, set, whyItem) {
        console.info("QsortWhy" );
        //find the section that the itemId is in, take it out, and put it in the new section. if set then don't toggle just set.
        if(set==='promote'){
            this.results.refine[this.whyName][itemId]=whyItem;
        }
        if(button==='harmony') return;
        if(!itemId) return;
        this.setState({ 'sections': QSortToggle(this.state.sections,itemId,button,set) });

        //this browser may scroll the window down if the element being moved is below the fold.  Let the browser do that, but then scroll back to where it was.
        //this doesn't happen when moveing and object up, above the fold. 
        var doc = document.documentElement;
        this.currentTop = (window.pageYOffset || doc.scrollTop) - (doc.clientTop || 0);
        this.scrollBackToTop = true;
    }

    onFlipMoveFinishAll() {
        if (this.scrollBackToTop) {
            this.scrollBackToTop = false;
            setTimeout(() => { smoothScroll(this.currentTop, this.motionDuration * 1.5) }, 100);
        }
        if(this.props.onFinishAll){return this.props.onFinishAll()}
    }

    //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~


    //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

    render() {

        const { user, rasp, panel } = this.props;
        const { items } = panel;

        const onServer = typeof window === 'undefined';

        let content = [], direction = [], instruction = [], issues = 0, done = [];

        if ( ! (this.props.shared && this.props.shared.why && this.props.shared.why[this.whyName] && Object.keys(this.props.shared.why[this.whyName]).length)) {
            // if we don't have any data to work with 
            ; 
        } else {
            let topItem=true;
            this.buttons.forEach((name) => {
                if (this.state.sections['unsorted'].length) { issues++ }
                let qb = this.ButtonList[name];
                if (qb.max) {
                    console.info("QSortRefine qb")
                    if (this.state.sections[name].length > qb.max) {
                        direction.push(
                            <div className='instruction-text' style={{ backgroundColor: Color(qb.color).darken(0.1) }}>
                                {qb.direction}
                            </div>
                        )
                        issues++;
                    }
                }
                this.state.sections[name].forEach(itemId => {
                    var buttonstate = {};
                    this.buttons.slice(1).forEach(button => { buttonstate[button] = false; });
                    if (name != 'unsorted') { buttonstate[name] = true; }
                    let item = items[this.props.shared.index[itemId]];
                    const voted = this.results.refine[this.whyName][item._id] ? true : false;
                    content.push(
                        {
                            sectionName: name,
                            user: user,
                            item: item,
                            whyItemId: this.props.shared.why[this.whyName][item._id],
                            voted: voted,
                            winner: voted? this.results.refine[this.whyName][itemId] : null,
                            type: type,
                            toggle: this.toggle.bind(this, item._id, this.whyName), // were just toggleing most here
                            qbuttons: this.ButtonList,
                            buttonstate: buttonstate,
                            whyName: this.whyName,
                            emitter: this.props.emitter,
                            show: topItem && !voted,
                            id: item._id,  //FlipMove uses this Id to sort
                            rasp: {shape: 'truncated', depth: rasp.depth, toParent: rasp.toParent}
                        }
                    );
                    topItem=false
                });
            });

            if (!issues) {
                done.push(
                    <div className='instruction-text'>
                        {this.ButtonList['unsorted'].direction}
                        <Button small shy
                            onClick={()=>rasp.toParent({ type: "RESULTS", results: this.results})}
                            className="qwhy-done"
                            style={{ backgroundColor: Color(this.ButtonList['unsorted'].color).negate(), color: this.ButtonList['unsorted'].color, float: "right" }}
                            >
                            <span className="civil-button-text">{"next"}</span>
                        </Button>
                    </div>
                );
                rasp.toParent({ type: "RESULTS", results: this.results});
            }else 
                rasp.toParent({ type: "ISSUES"});
        }

        return (
            <section id="syn-panel-qsort">
                {direction}
                {done}
                <div style={{ position: 'relative', display: 'block'}}>
                    <div className="qsort-flip-move-articles">
                        <FlipMove duration={this.motionDuration} onFinishAll={this.onFlipMoveFinishAll.bind(this)} disableAllAnimations={onServer}>
                            {content.map(article => <QSortRefineItem {...article} key={article.id} />)}
                        </FlipMove>
                    </div>
                </div>
            </section>
        );
    }
}

export default QSortRefine;

class QSortRefineItem extends React.Component {

    render(){
        const {qbuttons, sectionName, item,  whyItemId, user, type, toggle, buttonstate, whyName, show, emitter, voted, winner, rasp } = this.props;
        var creator=[];
        const hIndex= (whyName === 'most') ? 0 : 1;
        const active = show ? {item: whyItemId, section: 'promote'} : {};  // requried to convince EvaluationStore to be active
        const panel={type: type};

        if(voted){
            creator=[
                <div style={{backgroundColor: qbuttons[sectionName].color}}>
                    <ItemStore item={ winner } key={ `item-${winner._id}` }>
                        <Item
                            item    =   { winner }
                            user    =   { user }
                            rasp    =   {rasp}
                            toggle  =   { toggle }
                        />
                    </ItemStore>
                </div>
            ];
        }else{
            creator=[
                    <EvaluationStore
                      item-id     =   { whyItemId }
                      toggle      =   { toggle }
                      active      =   { active }
                      emitter     =   { emitter }
                      >
                      <Promote
                        ref       =   "promote"
                        show      =   { show }
                        panel     =   { panel }
                        user    =     { user }
                        hideFeedback = {true}
                        />
                    </EvaluationStore>
            ];
        }
        return(
                <div style={{backgroundColor: qbuttons[sectionName].color}}>
                    <ItemStore item={ item } key={ `item-${item._id}` }>
                        <Item
                            item    =   { item }
                            user    =   { user }
                            rasp    =   {rasp}
                            toggle  =   { toggle }
                            hideFeedback = {this.props.hideFeedback}
                        />
                        { creator }
                    </ItemStore>
                </div>
        );
    }
}
