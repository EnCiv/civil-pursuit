'use strict';

import React from 'react';
import ItemStore from '../store/item';
import FlipMove from 'react-flip-move';
import smoothScroll from '../../lib/app/smooth-scroll';
import Color from 'color';
import Item from '../item';
import QSortButtonList from '../qsort-button-list';
import {ReactActionStatePath, ReactActionStatePathClient} from 'react-action-state-path';
import {QSortToggle} from './qsort-items';
import PanelHeading from '../panel-heading';
import clone from 'clone';
import DoneItem from '../done-item'

class QSortWhy extends React.Component {
    render() {
        return (
            <ReactActionStatePath {...this.props} >
                    <PanelHeading items={[]} cssName={'syn-qsort-why'} panelButtons={['Creator', 'Instruction']}>
                        <RASPQSortWhy />
                    </PanelHeading>
            </ReactActionStatePath>
        )
    }
}

class RASPQSortWhy extends ReactActionStatePathClient {
    ButtonList={};
    buttons=[];
    motionDuration = 500; //500mSec
    state = {};
    results = {};
    currentTop = 0; //default scroll position
    scrollBackToTop = false;
    whyName = '';

    constructor(props) {
        super(props, 'itemId');
        var unsortedList = [];
        //onsole.info("qsortWhy constructor");
        const qbuttons=this.props.qbuttons || QSortButtonList;
        this.ButtonList['unsorted']=qbuttons['unsorted'];
        const qbprops=Object.keys(qbuttons);
        if(!(this.whyName=this.props.whyName)){
            qbprops.slice(1).forEach(button => {
                var regex = new RegExp('./*'+button+'./*','i');
                if(this.props.type && this.props.type.name.match(regex)) this.whyName=button;
            });
            if(!this.whyName) {this.whyName=qbprops[1]; console.error("QSortWhy button name not found in type name:", qbprops, this.props.type.name)}
        }
        this.results.why=this.props.shared.why || {};
        this.results.why[this.whyName]={};
        this.ButtonList[this.whyName]=qbuttons[this.whyName];
        //onsole.info("qsort-why constructor buttonlist")
        this.state.sections = {};
        this.buttons = Object.keys(this.ButtonList);
        this.buttons.forEach(button => {
            this.state.sections[button] = [];
        });
        if(this.props.shared.sections[this.whyName]){ // if theres nothing in the list, there might not be a list especially for Least
            this.state.sections['unsorted'] = this.props.shared.sections[this.whyName].slice(0);
        } else this.state.sections['unsorted'] = [];
        this.createDefaults();
    }

    //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~  

    componentWillReceiveProps(newProps) { //items that are nolonger there will be removed, existing item section will be preserved, new items will be in unsorted.
        //onsole.info("qsortWhy componentWillReceiveProps");
        var newSections=[];
        const qbuttons=this.props.qbuttons || QSortButtonList;
        this.buttons.forEach(button=> newSections[button]=[] );

        if(newProps.shared.sections[this.whyName]){
            newProps.shared.sections[this.whyName].forEach(itemId=>{
                if(this.state.sections[this.whyName].includes(itemId)){ 
                    newSections[this.whyName].push(itemId)
                } else if(this.state.sections['unsorted'].includes(itemId)) { // itemId is sorted in shared, but has been unsorted in state - because user is editing
                    newSections['unsorted'].push(itemId)
                } else { // item is not in state.  Likely we are rebuilding state after a RESET action.  Look in Item store to see if we can find it, and it's state.
                    let harmony=ItemStore.index[itemId] && ItemStore.index[itemId].harmony;
                    if(harmony) {
                        let side=qbuttons[this.whyName].harmonySide;
                        let type=harmony.types[side==='left'? 0:1];
                        if(type) {
                            let whyItem=ItemStore.findOne({parent: itemId, type: type });
                            if(whyItem){
                                newSections[this.whyName].push(itemId);
                                this.results.why[this.whyName][itemId]=whyItem._id;
                                return;
                            }
                        }
                    }
                    newSections['unsorted'].push(itemId) 
                }
            });
            this.setState({sections: newSections});
        }
    }

    actionToState(action, rasp, source, defaultRASP, delta){
        var nextRASP={};
        const itemId=action.itemId;
        if(action.type==="POST_ITEM"){
            this.results.why[this.whyName][itemId]=action.item._id;
            this.setState({ 'sections': QSortToggle(this.state.sections,itemId,this.whyName,'set')});
        } else if(action.type==="DESCENDANT_FOCUS"){
            this.setState({ 'sections': QSortToggle(this.state.sections,itemId,'unsorted','set')}); // - set incase of double events to unsorted
        } else if(action.type==="RESET"){
            Object.assign(this.props.shared,clone(this._defaults.that.results));
            return null;
        }  else if (action.type === "TOGGLE_FOCUS") {
            this.queueUnfocus(action);
        } else if(Object.keys(delta).length){
            ;
        } else
            return null;
        Object.assign(nextRASP,rasp,delta);
        return nextRASP;
    }

    // if the panel is done, say so
    isDone(props){
        return (
            !props.sections['unsorted'].length // if there are no unsorted items
            && !Object.keys(this.ButtonList).some(criteria=>{ // there is no some section[criteria] where
                let max=this.ButtonList[criteria].max; 
                if(max && props.sections[criteria] && (props.sections[criteria].length > max)) // there are more items than max 
                    return true; 
                else 
                    return false;
            })
        )
    }

    onFlipMoveFinishAll() {
        if (this.scrollBackToTop) {
            this.scrollBackToTop = false;
            if(!this.isDone(this.state))
                setTimeout(() => { smoothScroll(this.currentTop, this.motionDuration * 1.5) }, 100);
        }
        if(this.props.onFinishAll){return this.props.onFinishAll()}
    }

    render() {

        const { user, rasp, shared, next, panelNum } = this.props;
        const items=shared.items;

        const onServer = typeof window === 'undefined';

        let content = [], direction = [], constraints=[];

        if ( ! (shared && shared.sections && shared.sections[this.whyName] && Object.keys(shared.sections[this.whyName].length))) {
            // if we don't have any data to work with 
            direction.push(<div key="instruction" className='instruction-text' style={{backgroundColor: this.ButtonList['unsorted'].color, color: Color(this.ButtonList['unsorted'].color).negate}} key='instruction'>
                    No values were tagged {this.whyName} Imortant. You could go back to Public Values and change that or you can contine.
            </div>)
        } else {
            if (this.state.sections['unsorted'].length) 
                constraints.push(this.state.sections['unsorted'].length+" to go.");
            this.buttons.forEach((name) => {
                let qb = this.ButtonList[name];
                if (qb.max) {
                    //onsole.info("QSortWhy qb")
                    if (this.state.sections[name].length > qb.max) {
                        direction.push(
                            <div key={'direction'+name} className='instruction-text' style={{ backgroundColor: Color(qb.color).darken(0.1) }}>
                                {qb.direction}
                            </div>
                        )
                        constraints.push((this.state.sections[name].length - qb.max)+' too many');
                    }
                }
                this.state.sections[name].forEach(itemId => {
                    let item= items.find(itm=>itm._id===itemId);
                    if(!item){
                        console.error("qsortWhy itemId:",itemId, "not found in items", items);
                        return;
                    }
                    //let item = items[shared.index[itemId]];
                    content.push(
                        {
                            sectionName: name,
                            user: user,
                            item: item,
                            qbuttons: this.ButtonList,
                            whyName: this.whyName,
                            rasp: {shape: 'truncated', depth: rasp.depth, button: name, toParent: this.toMeFromChild.bind(this,item._id)},
                            id: item._id  //FlipMove uses this Id to sort
                        }
                    );
                });
            });
        }
        if (!constraints.length) {
            setTimeout(()=>this.props.rasp.toParent({ type: "RESULTS", results: this.results}),0);
        }else 
            setTimeout(()=>rasp.toParent({ type: "ISSUES"}),0);

        return (
            <section id="syn-panel-qsort">
                {direction}
                <div key="flip-list" style={{ position: 'relative',
                                display: 'block',
                }}>
                    <div className="qsort-flip-move-articles">
                        <FlipMove duration={this.motionDuration} onFinishAll={this.onFlipMoveFinishAll.bind(this)} disableAllAnimations={onServer}>
                            {content.map(article => <QSortWhyItem {...article} key={article.id+'-article'} />)}
                        </FlipMove>
                    </div>
                </div>
                <DoneItem 
                    constraints={constraints}
                    active={!constraints.length}
                    message={this.ButtonList['unsorted'].direction}
                    onClick={()=>rasp.toParent({ type: "NEXT_PANEL", results: this.results})}
                />
            </section>
        );
    }
}

export default QSortWhy;

class QSortWhyItem extends React.Component {
    render(){
        const {qbuttons, sectionName, item, user, whyName, rasp, key } = this.props;
        return(
                <div style={{backgroundColor: qbuttons[sectionName].color}} key={ key }>
                    <ItemStore item={ item } key={ key+'-why' }>
                        <Item
                            {...this.props}
                            buttons =   { ['CreateHarmony']}
                            side    =   { qbuttons[whyName].harmonySide}
                            style   = {{backgroundColor: qbuttons[sectionName].color}} 
                            min={true}
                        />
                    </ItemStore>
                </div>
        );
    }
}


