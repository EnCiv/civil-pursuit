'use strict';

import React from 'react';
import Panel from './panel';
import panelType from '../lib/proptypes/panel';
import QSortButtons from './qsort-buttons';
import ItemStore from '../components/store/item';
import FlipMove from 'react-flip-move';
import QSortFlipItem from './qsort-flip-item'
import smoothScroll from '../lib/app/smooth-scroll';
import Instruction from './instruction';
import Color from 'color';
import Button           from './util/button';
import QSortButtonList from './qsort-button-list';
import merge from 'lodash/merge';
import QVoteTotals from './store/qvote-local';
import Accordion from  './util/accordion';
import Item    from './item';
import Harmony              from './harmony';


class QSortFinale extends React.Component{
    render (){
                console.info("QSortFinale", this.props, this.state);
            return(

                <QVoteTotals {...this.props} >
                    <QSortFinalTotal/>
                </QVoteTotals>
        );
    }
}
export default QSortFinale;

class QSortFinalTotal extends React.Component {

    static propTypes = {
        panel: panelType
    };

    motionDuration = 500; //500mSec

    currentTop = 0; //default scroll position
    scrollBackToTop = false;

    constructor(props){
        super(props);
        if(this.props.qbuttons){ this.QSortButtonList = this.props.qbuttons; }
        else { this.QSortButtonList=QSortButtonList; }
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

        const { user, emitter } = this.props;

        const { panel } = this.props.shared;

        console.info("QSortFinale", this.props, this.state);

        const onServer = typeof window === 'undefined';

        let title = 'Loading items', name, loaded = false, content = [], loadMore,
            type, parent, items, direction = [], instruction = [], issues = 0, done = [], loading=[];

        if (panel) {
            items = panel.items;
            loaded = true;

            type = this.props.type || panel.type;  // if a type was passed, use that one rather than the panel type. We are operating on the parents matching items not ours

            parent = panel.parent;

            if (type) {
                name = `syn-panel-${type._id}`;
            } else {
                name = 'syn-panel-no-type';
            }

            if (parent) {
                name += `-${parent._id || parent}`;
            }

            title = type.name;

            if (type && type.instruction) {
                instruction = (
                    <Instruction >
                        {type.instruction}
                    </Instruction>
                );
            }

            if (!Object.keys(this.props.finale).length) {
                loading.push(
                    <div className="gutter text-center">
                        <p>There is nothing here</p>
                    </div>
                );
            } else {
                    this.props.finale.forEach(qobj => {
                        var buttonstate = {};
                        Object.keys(this.QSortButtonList).slice(1).forEach(button => { buttonstate[button] = 0; });
                        if (criteria != 'unsorted') { buttonstate[criteria] = qobj[criteria] }
                        let item = items[qobj.index];
                        content.push(
                            {
                                qbuttons: this.QSortButtonList,
                                user: user,
                                item: item,
                                buttonstate: buttonstate,
                                id: item._id
                            }
                        );
                    });
                }
            }
    
        return (
            <section id="syn-panel-qsort-harmony">
                <Panel
                    className={name}
                    ref="panel"
                    heading={[(<h4>{title}</h4>)]}
                    type={type}
                    >
                    {instruction}
                    {direction}
                    {done}
                    <div style={{ position: 'relative',
                                  display: 'block',
                    }}>
                        <div className="qsort-flip-move-articles">
                            <FlipMove duration={this.motionDuration} onFinishAll={this.onFlipMoveFinishAll.bind(this)} disableAllAnimations={onServer}>
                                {content.map(article => <QSortFlipItemHarmony {...article} key={article.id} />)}
                            </FlipMove>
                        </div>
                    </div>
                    {loading}
                </Panel>
            </section>
        );
    }
}

class QSortFlipItemHarmony extends React.Component {


    render(){
        const {qbuttons, sectionName, item, user, toggle, buttonstate } = this.props;

        let harmony = (
                <div className="toggler-harmony">
                  <Accordion
                    name    =   "harmony"
                    active  =   { true }
                    >
                    <Harmony
                      item    =   { item }
                      ref     =   "harmony"
                      user    =   { user }
                      active  =   { true }
                      vs      =    {{state: "title", depth: 0}}
                      hideFeedback = {true}
                      />
                  </Accordion>
                </div>
              );
        

        return(
                <div style={{backgroundColor: qbuttons['unsorted'].color}}>
                    <ItemStore item={ item } key={ `item-${item._id}` }>
                        <Item
                            item    =   { item }
                            user    =   { user }
                            buttons =   { (
                                <ItemStore item={ item }>
                                    <QSortButtons
                                        item    =   { item }
                                        user    =   { user }
                                        toggle  =   { toggle }
                                        buttonstate = { buttonstate }
                                        qbuttons= { qbuttons }
                                        />
                                </ItemStore>
                            ) }
                            vs={{state: 'truncated'}}
                            focusAction={null}
                            footer  =   { [ harmony ] }
                        />
                    </ItemStore>
                </div>
        );

    }
}