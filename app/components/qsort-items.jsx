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
import Creator            from './creator';
import Accordion          from './util/accordion';
import Icon               from './util/icon';
import PanelStore from './store/panel';
import QVoteStore from './store/qvote';


  // 20 is hard coded, but where should this be? type or item?
class QSortItems extends React.Component {
    render(){
        return(
        <PanelStore parent={this.props.parent}
                    type={this.props.type}
                    limit={20} >
            <QVoteStore>
                <QSortItemsQV  {...this.props}/>
            </QVoteStore>
        </PanelStore>
        );
    }
}


class QSortItemsQV extends React.Component {

    state={creator: false};

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

    //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

    toggle(itemId, button) {
        //find the section that the itemId is in, take it out, and put it in the new section
        let i;
        let done = false;
        var clone = {};
        if (button == "done"){
            if(this.props.next) {
            const results = {
                index: this.props.index,
                sections: this.props.sections,
                panel: this.props.panel
            }
            this.props.next(this.props.panelNum,"done", results)
            }
            return;
        }
        if (button == 'harmony') { return; }

        //this browser may scroll the window down if the element being moved is below the fold.  Let the browser do that, but then scroll back to where it was.
        //this doesn't happen when moveing and object up, above the fold. 
        var doc = document.documentElement;
        this.currentTop = (window.pageYOffset || doc.scrollTop) - (doc.clientTop || 0);
        this.scrollBackToTop = true;

        if (itemId && button) { this.props.toggle(itemId, button) }

        window.socket.emit('insert qvote', { item: itemId, criteria: button });

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

        const { panel, count, user, emitter } = this.props;

        const onServer = typeof window === 'undefined';

        let title = 'Loading items', name, loaded = false, content = [], loadMore, creator,
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

            if (!Object.keys(this.props.index).length) {
                console.info("qsort-items creator", panel)
                loading.push(
                    <div className="gutter text-center">
                        <a href="#" onClick={ this.setState.bind(this,{creator: !this.state.creator},null)} className="click-to-create">
                            Click the + to be the first to add something here
                        </a>
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
                                <div className='instruction-text' style={{ backgroundColor: Color(qb.color).darken(0.1) }}>
                                    {qb.direction}
                                </div>
                            )
                            issues++;
                        }
                    }
                    this.props.sections[criteria].forEach(itemId => {
                        var buttonstate = {};
                        Object.keys(this.QSortButtonList).slice(1).forEach(button => { buttonstate[button] = false; });
                        if (criteria != 'unsorted') { buttonstate[criteria] = true; }
                        let item = items[this.props.index[itemId]];
                        content.push(
                            {
                                sectionName: criteria,
                                qbuttons: this.QSortButtonList,
                                user: user,
                                item: item,
                                toggle: this.toggle.bind(this),
                                buttonstate: buttonstate,
                                id: item._id
                            }
                        );
                    });
                });
                if (!issues) {
                    done.push(
                        <div className='instruction-text'>
                            {this.QSortButtonList['unsorted'].direction}
                            <Button small shy
                                onClick={this.toggle.bind(this, null, 'done')}
                                className="qsort-done"
                                style={{ backgroundColor: Color(this.QSortButtonList['unsorted'].color).negate(), color: this.QSortButtonList['unsorted'].color, float: "right" }}
                                >
                                <span className="civil-button-text">{"next"}</span>
                            </Button>
                        </div>
                    )
                } else {this.props.next(this.props.panelNum,"issues")}
            }
            let creatorPanel;

            creatorPanel = (
            <Creator
                type    =   { type }
                parent  =   { parent }
                toggle  =   { this.setState.bind(this,{creator: !this.state.creator},null) }
                />
            );

            creator = (
                <Accordion
                active    =   { (this.state.creator) }
                poa       =   { this.refs.panel }
                name      = 'creator'
                >
                { creatorPanel }
                </Accordion>
            );

        }


        return (
            <section id="syn-panel-qsort">
                <Panel
                    className={name}
                    ref="panel"
                    heading={[(<h4>{title}</h4>)]}
                    heading     =   {[
                        ( <h4>{ title }</h4> ), !(user && user.id && parent && parent.user && parent.user._id && (user.id === parent.user._id) ) ? (null) : 
                        (
                        <Icon
                            icon        =   "plus"
                            className   =   "toggle-creator"
                            onClick     =   { this.setState.bind(this,{creator: !this.state.creator }, null)}
                        />
                        )
                    ]}

                    type={type}
                    >
                    {creator}
                    {instruction}
                    {direction}
                    {done}
                    <div style={{ position: 'relative',
                                  display: 'block',
                    }}>
                        <div className="qsort-flip-move-articles">
                            <FlipMove duration={this.motionDuration} onFinishAll={this.onFlipMoveFinishAll.bind(this)} disableAllAnimations={onServer}>
                                {content.map(article => <QSortFlipItem {...article} key={article.id} />)}
                            </FlipMove>
                        </div>
                    </div>
                    {loading}
                </Panel>
            </section>
        );
    }
}

export default QSortItems;
