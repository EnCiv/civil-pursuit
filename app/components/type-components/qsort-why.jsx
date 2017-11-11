'use strict';

import React from 'react';
import Panel from '../panel';
import PanelStore from '../store/panel';
import PanelItems from '../panel-items';
import panelType from '../../lib/proptypes/panel';
import ItemStore from '../store/item';
import update from 'immutability-helper';
import FlipMove from 'react-flip-move';
import QSortFlipItem from '../qsort-flip-item';
import smoothScroll from '../../lib/app/smooth-scroll';
import Instruction from '../instruction';
import Color from 'color';
import Button           from '../util/button';
import ButtonGroup           from '../util/button-group';
import Item from '../item';
import Creator            from '../creator';
import QSortButtonList from '../qsort-button-list';
import {ReactActionStatePath, ReactActionStatePathClient} from 'react-action-state-path';
import {QSortToggle} from './qsort-items';
import ItemCreator from '../item-creator';
import PanelHead from '../panel-head';

class QSortWhy extends React.Component {
    render(){
        return (
            <PanelHead {...this.props} cssName={'syn-qsort-why'} >
                <ReactActionStatePath>
                    <RASPQSortWhy />
                </ReactActionStatePath>
            </PanelHead>
        )
    }
}

class RASPQSortWhy extends ReactActionStatePathClient {
    ButtonList=[];
    buttons=[];
    motionDuration = 500; //500mSec
    state = {};
    results = {why: {}};
    currentTop = 0; //default scroll position
    scrollBackToTop = false;
    whyName = '';

    constructor(props) {
        super(props, 'itemId');
        var unsortedList = [];
        console.info("qsortWhy constructor");
        this.ButtonList['unsorted']=QSortButtonList['unsorted'];
        const qbuttons=Object.keys(QSortButtonList);
        if(!(this.whyName=this.props.whyName)){
            qbuttons.slice(1).forEach(button => {
                var regex = new RegExp('./*'+button+'./*','i');
                if(this.props.type && this.props.type.name.match(regex)) this.whyName=button;
            });
            if(!this.whyName) {this.whyName=qbuttons[1]; console.error("QSortWhy button name not found in type name:", qbuttons, this.props.type.name)}
        }
        this.results.why[this.whyName]={};
        this.ButtonList[this.whyName]=QSortButtonList[this.whyName];
        console.info("qsort-why constructor buttonlist")
        this.state.sections = {};
        this.buttons = Object.keys(this.ButtonList);
        this.buttons.forEach(button => {
            this.state.sections[button] = [];
        });
        if(this.props.shared.sections[this.whyName]){ // if theres nothing in the list, there might not be a list especially for Least
            this.state.sections['unsorted'] = this.props.shared.sections[this.whyName].slice(0);
        } else this.state.sections['unsorted'] = [];
    }

    //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~  

    componentWillReceiveProps(newProps) { //items that are nolonger there will be removed, existing item section will be preserved, new items will be in unsorted.
        console.info("qsortWhy componentWillReceiveProps");
        var newSections=[];
        this.buttons.forEach(button=> newSections[button]=[] );

        if(newProps.shared.sections[this.whyName]){
            newProps.shared.sections[this.whyName].forEach(itemId=>{
                if(this.state.sections[this.whyName].includes(itemId)){ newSections[this.whyName].push(itemId)} 
                else{ newSections['unsorted'].push(itemId) }
            });
            this.setState({sections: newSections});
        }
    }

    actionToState(action, rasp, source){
        return null;
    }

    //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

    toggle(itemId, button, set, whyItemId) {
        console.info("QsortWhy.toggle", ...arguments);
        //find the section that the itemId is in, take it out, and put it in the new section. if set then don't toggle just set.

        if (button==='harmony') return;
        if (button == "done"){
            if( this.props.next ){ 
                this.props.next(this.props.panelNum,"done", this.results)
            }
            return;
        }
        if(!itemId) return;
        if(set==='set'){
            this.results.why[this.whyName][itemId]=whyItemId;
        }
        
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

        const { user, rasp, shared, next, panelNum } = this.props;
        const items=shared.items;

        const onServer = typeof window === 'undefined';

        let content = [], direction = [], instruction = [], issues = 0, done = [];

        if ( ! (shared && shared.sections && shared.sections[this.whyName] && Object.keys(shared.sections[this.whyName].length))) {
            // if we don't have any data to work with 
            direction.push(<div key="instruction" className='instruction-text' style={{backgroundColor: this.ButtonList['unsorted'].color, color: Color(this.ButtonList['unsorted'].color).negate}} key='instruction'>
                    No values were tagged {this.whyName} Imortant. You could go back to Public Values and change that or you can contine.
            </div>)
        } else {
            this.buttons.forEach((name) => {
                if (this.state.sections['unsorted'].length) { issues++ }
                let qb = this.ButtonList[name];
                if (qb.max) {
                    console.info("QSortWhy qb")
                    if (this.state.sections[name].length > qb.max) {
                        direction.push(
                            <div key={'direction'+name} className='instruction-text' style={{ backgroundColor: Color(qb.color).darken(0.1) }}>
                                {qb.direction}
                            </div>
                        )
                        issues++;
                    }
                }
                this.state.sections[name].forEach(itemId => {
                    let item = items[shared.index[itemId]];
                    content.push(
                        {
                            sectionName: name,
                            user: user,
                            item: item,
                            toggle: this.toggle.bind(this, item._id, this.whyName), // were just toggleing most here
                            qbuttons: this.ButtonList,
                            whyName: this.whyName,
                            rasp: {shape: 'truncated', depth: rasp.depth, button: name, toParent: this.toMeFromChild.bind(this,item._id)},
                            id: item._id  //FlipMove uses this Id to sort
                        }
                    );
                });
            });
        }
        if (!issues) {
            done.push(
                <div className='instruction-text' key='direction-done'>
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
            setTimeout(()=>this.props.rasp.toParent({ type: "RESULTS", results: this.results}),0);
        }else 
            setTimeout(()=>rasp.toParent({ type: "ISSUES"}),0);

        return (
            <section id="syn-panel-qsort">
                {direction}
                {done}
                <div key="flip-list" style={{ position: 'relative',
                                display: 'block',
                }}>
                    <div className="qsort-flip-move-articles">
                        <FlipMove duration={this.motionDuration} onFinishAll={this.onFlipMoveFinishAll.bind(this)} disableAllAnimations={onServer}>
                            {content.map(article => <QSortWhyItem {...article} key={article.id} />)}
                        </FlipMove>
                    </div>
                </div>
            </section>
        );
    }
}

export default QSortWhy;

class QSortWhyItem extends React.Component {
    render(){
        const {qbuttons, sectionName, item, user, toggle, buttonstate, whyName, rasp } = this.props;
        return(
                <div style={{backgroundColor: qbuttons[sectionName].color}} key={ `item-${item._id}` }>
                    <ItemStore item={ item } key={ `item-${item._id}` }>
                        <Item
                            {...this.props}
                            buttons =   { ['CreateHarmony']}
                            side    =   { whyName === 'most' ? 'left' : 'right'}
                            min={true}
                        />
                    </ItemStore>
                </div>
        );
    }
}


