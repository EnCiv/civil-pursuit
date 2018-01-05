'use strict';

import React from 'react';
import ItemStore from '../store/item';
import FlipMove from 'react-flip-move';
import smoothScroll from '../../lib/app/smooth-scroll';
import Color from 'color';
import Button           from '../util/button';
import Item from '../item';
import QSortButtonList from '../qsort-button-list';
import {ReactActionStatePath, ReactActionStatePathClient} from 'react-action-state-path';
import {QSortToggle} from './qsort-items';
import PanelHeading from '../panel-heading';
import clone from 'clone';
import RASPFocusHere from '../rasp-focus-here';

class QSortRefine extends React.Component {
    render() {
        return (
            <ReactActionStatePath {...this.props}>
                <RASPFocusHere filterTypes={['DESCENDANT_UNFOCUS', 'RESULTS']}>
                    <PanelHeading cssName={'syn-qsort-refine'} panelButtons={['Creator', 'Instruction']}>
                        <RASPQSortRefine />
                    </PanelHeading>
                </RASPFocusHere>
            </ReactActionStatePath>
        )
    }
}

class RASPQSortRefine extends ReactActionStatePathClient {

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
        this.keyField = 'itemId';
        var unsortedList = [];
        this.ButtonList['unsorted']=QSortButtonList['unsorted'];
        const qbuttons=Object.keys(QSortButtonList);
        if(!(this.whyName=this.props.whyName)){
            qbuttons.slice(1).forEach(button => {
                var regex = new RegExp('./*'+button+'./*','i');
                if(this.props.type.name.match(regex)) this.whyName=button;
            });
            if(!this.whyName) {this.whyName=qbuttons[1]; console.error("QSortRefine button name not found in type name:", qbuttons, this.props.type.name)}
        } this.results.refine[this.whyName]={};
        this.ButtonList[this.whyName]=QSortButtonList[this.whyName];
        //onsole.info("qsort-refine constructor")
        this.state.sections = {};
        this.buttons = Object.keys(this.ButtonList);
        this.buttons.forEach(button => {
            this.state.sections[button] = [];
        });
        this.state.sections['unsorted'] = this.props.shared.why[this.whyName] ? Object.keys(this.props.shared.why[this.whyName]) : [];
        //onsole.info("qsortRefine constructor");
        this.createDefaults();
    }

    actionToState(action, rasp, source, initialRASP, delta) {
        var nextRASP={};
        if((action.type ==="ITEM_REFINE") || (action.type ==="SHOW_ITEM")) {  // ** ITEM_REFINE is if the user chose the item he created, show_item if the item the user didn't just create
            this.results.refine[this.whyName][action.itemId]=action.item;
            this.setState({ 'sections': QSortToggle(this.state.sections, action.itemId, this.whyName) });
            var doc = document.documentElement;
            this.currentTop = (window.pageYOffset || doc.scrollTop) - (doc.clientTop || 0);
            this.scrollBackToTop = true;
        } else if(action.type==="RESET"){
            Object.assign(this.props.shared,clone(this._defaults.that.results));
            return null;
        } else if(Object.keys(delta).length){
            ;
        } else
            return null;
        Object.assign(nextRASP,rasp,delta);
        return nextRASP;
    }

    //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~  

    componentWillReceiveProps(newProps) { //items that are nolonger there will be removed, existing item section will be preserved, new items will be in unsorted.
        //onsole.info("qsortWhy componentWillReceiveProps");
        var newSections=[];
        this.buttons.forEach(button=> newSections[button]=[] );

        Object.keys(newProps.shared.why[this.whyName]).forEach(itemId=>{
            if(this.results.refine[this.whyName][itemId]){ newSections[this.whyName].push(itemId)} // if we already have results on this item, don't do it again
            else{ newSections['unsorted'].push(itemId) }
        });

        this.setState({sections: newSections});
    }


    //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

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

        const { user, rasp, shared, type } = this.props;
        const items=shared.items;

        const onServer = typeof window === 'undefined';

        let content = [], direction = [], instruction = [], issues = 0, done = [];

        if ( ! (shared && shared.why && shared.why[this.whyName] && Object.keys(shared.why[this.whyName]).length)) {
            // if we don't have any data to work with 
            direction.push(
                <div key="direction" className='instruction-text' style={{backgroundColor: this.ButtonList['unsorted'].color, color: Color(this.ButtonList['unsorted'].color).negate}}>Click next to continue.</div>
            )
        } else {
            this.buttons.forEach((name) => {
                if (this.state.sections['unsorted'].length) { issues++ }
                let qb = this.ButtonList[name];
                if (qb.max) {
                    //onsole.info("QSortRefine qb")
                    if (this.state.sections[name].length > qb.max) {
                        direction.push(
                            <div key={'direction-'+name}className='instruction-text' style={{ backgroundColor: Color(qb.color).darken(0.1) }}>
                                {qb.direction}
                            </div>
                        )
                        issues++;
                    }
                }
                this.state.sections[name].forEach(itemId => {
                    let item = items[shared.index[itemId]];
                    if(!item) return; // this happens during the proccess of resetting the state.
                    let winner = this.results.refine[this.whyName][itemId] || null;
                    content.push(
                        {
                            sectionName: name,
                            user: user,
                            item: item,
                            whyItemId: shared.why[this.whyName][item._id],
                            winner: winner,
                            type: type,
                            qbuttons: this.ButtonList,
                            id: item._id,  //FlipMove uses this Id to sort
                            rasp: {shape: 'truncated', depth: rasp.depth, toParent: this.toMeFromChild.bind(this,item._id)}
                        }
                    );
                });
            });
        }
        if (!issues) {
            done.push(
                <div key="done" className='instruction-text'>
                    {this.ButtonList['unsorted'].direction}
                    <Button small shy
                        onClick={()=>rasp.toParent({ type: "NEXT_PANEL", results: this.results})}
                        className="qwhy-done"
                        style={{ backgroundColor: Color(this.ButtonList['unsorted'].color).negate(), color: this.ButtonList['unsorted'].color, float: "right" }}
                        >
                        <span className="civil-button-text">{"next"}</span>
                    </Button>
                </div>
            );
            setTimeout(()=>rasp.toParent({ type: "RESULTS", results: this.results}),0);
        }else 
            setTimeout(()=>rasp.toParent({ type: "ISSUES"}),0);

        return (
            <section id="syn-panel-qsort">
                {direction}
                {done}
                <div key="flip-move-list" style={{ position: 'relative', display: 'block'}}>
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
        const {qbuttons, sectionName, item,  whyItemId, user, type, winner, rasp } = this.props;

        return(
                <div style={{backgroundColor: qbuttons[sectionName].color}}  key={ `item-${item._id}` }>
                    <ItemStore item={ item }>
                        <Item
                            user    =   { user }
                            rasp    =   { rasp }
                            buttons =    {[{component: 'Refine', winner, whyItemId, type, unsortedColor: qbuttons['unsorted'].color}]}
                            hideFeedback = {this.props.hideFeedback}
                        />
                    </ItemStore>
                </div>
        );
    }
}
