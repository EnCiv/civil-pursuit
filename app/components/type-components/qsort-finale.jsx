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
                <PanelHead panel={this.props.shared.panel} cssName={'syn-qsort-items'} >
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
        super(props, 'itemId');
        if(this.props.qbuttons){ this.QSortButtonList = this.props.qbuttons; }
        else { this.QSortButtonList=QSortButtonList; }
    }

    actionToState(action,rasp) {
        return null;
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
        const { user, emitter, rasp, panel } = this.props;
        const { items, type } = panel;
        console.info("QSortFinale");
        const onServer = typeof window === 'undefined';
        let content = [], direction = [], instruction = [], issues = 0, done = [], loading=[];

        if (!Object.keys(this.props.finale).length) {
            loading.push(
                <div className="gutter text-center">
                    <p>There is nothing here</p>
                </div>
            );
        } else {
            this.props.finale.forEach(qobj => {
                var qbuttonTotals=[];
                Object.keys(this.QSortButtonList).forEach(button => qbuttonTotals[button]=Object.assign({},QSortButtonList[button],{total: qobj[button] || 0}) );
                var item = items[qobj.index];
                content.push(
                    {
                        user: user,
                        item: item,
                        buttons: [{component: 'QSortButtons', qbuttons: qbuttonTotals},'Harmony'],
                        qbuttons: qbuttonTotals,
                        id: item._id,
                        rasp: {shape: 'truncated', depth: rasp.depth, toParent: this.toMeFromChild.bind(this,item._id)}
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
    render(){
        const {qbuttons, buttons, item, user, rasp } = this.props;
        return(
            <div style={{backgroundColor: qbuttons['unsorted'].color}}>
                <ItemStore item={ item } key={ `item-${item._id}` }>
                    <Item
                        item    =   { item }
                        user    =   { user }
                        buttons =   { buttons }
                        rasp    =   {rasp}
                    />
                </ItemStore>
            </div>
        );
    }
}