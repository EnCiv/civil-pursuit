'use strict';

import React from 'react';
import Panel from './panel';
import PanelStore from './store/panel';
import PanelItems from './panel-items';
import panelType from '../lib/proptypes/panel';
import QSortButtons from './qsort-buttons';
import ItemStore from '../components/store/item';
import update from 'immutability-helper';
import FlipMove from 'react-flip-move';
import QSortFlipItem from './qsort-flip-item'
import smoothScroll from '../lib/app/smooth-scroll';
import Instruction from './instruction';
import Color from 'color';
import Button           from './util/button';
import Item from './item';
import Creator            from './creator';
import QSortButtonList from './qsort-button-list';
import EvaluationStore    from './store/evaluation';
import Promote            from './promote';


class QSortRefine extends React.Component {

    static propTypes = {
        panel: panelType
    };

    ButtonList=[];
    results = {refine: {}};

 

    buttons=[];

    motionDuration = 500; //500mSec

    state = {};
    currentTop = 0; //default scroll position
    scrollBackToTop = false;

    cloneSections(section) {
        // Deep copy arrays.
        var clone = {};
        Object.keys(section).forEach(button => {
            clone[button] = section[button].slice(0);
        });
        return clone;
    }

    whyName = '';

    constructor(props) {
        super(props);
        var unsortedList = [];
        this.ButtonList['unsorted']=QSortButtonList['unsorted'];
        if(this.props.type.name==="Refine Why It's Most Important"){
            this.whyName='most';
        } else {
            this.whyName='least';
        }
        this.results.refine[this.whyName]={};
        this.ButtonList[this.whyName]=QSortButtonList[this.whyName];
        console.info("qsort-refine constructor", this.props, this.whyName)
        this.buttons = Object.keys(this.ButtonList);
        this.state.sections = {};
        this.buttons.forEach(button => {
            this.state.sections[button] = [];
        });
        this.state.sections['unsorted'] = Object.keys(this.props.shared.why[this.whyName]);
        console.info("qsortWhy constructor", this.props.shared, this.state);
    }

    //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~  

    componentWillReceiveProps(newProps) { //items that are nolonger there will be removed, existing item section will be preserved, new items will be in unsorted.
        console.info("qsortWhy componentWillReceiveProps", this.props, newProps, this.state);
        var newSections=[];
        this.buttons.forEach(button=> newSections[button]=[] );

        Object.keys(newProps.shared.why[this.whyName]).forEach(itemId=>{
            if(this.state.sections[this.whyName].includes(itemId)){ newSections[this.whyName].push(itemId)} 
            else{ newSections['unsorted'].push(itemId) }
        });

        this.setState({sections: newSections});

    }


    //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

    toggle(itemId, button, set, whyitem) {
        console.info("QsortWhy", itemId, button, set );
        //find the section that the itemId is in, take it out, and put it in the new section. if set then don't toggle just set.
        let i;
        let done = false;
        var clone = {};
        if( button == "done" && this.props.next ){ 
            this.props.next(this.results);
        }
        if(set==='promote'){
            this.results.refine[this.whyName][itemId]=whyItem;
        }
        if (itemId && button && button !== 'harmony') {
            Object.keys(this.ButtonList).forEach(
                (sectionName) => {
                    if (!done && ((i = this.state.sections[sectionName].indexOf(itemId)) !== -1)) {
                        if (sectionName === button) {
                            if(set==='set') { // set means don't toggle it
                                clone[button]=this.state.sections[button].slice();
                                clone['unsorted']=this.state.sections['unsorted'].slice();
                                done=true;
                            } else {
                                //take the i'th element out of the section it is in and put it back in unsorted
                                clone[button] = update(this.state.sections[button], { $splice: [[i, 1]] });
                                clone['unsorted'] = update(this.state.sections['unsorted'], { $unshift: [itemId] });
                                done = true;
                            }
                        } else if (sectionName === 'unsorted') {
                            // it was in unsorted, so take it out and put it in the button's section
                            clone['unsorted'] = update(this.state.sections['unsorted'], { $splice: [[i, 1]] });
                            clone[button] = update(this.state.sections[button], { $unshift: [itemId] });
                            done = true;
                        } else { // the item is in some other sectionName and should be moved to this button's section
                            clone[sectionName] = update(this.state.sections[sectionName], { $splice: [[i, 1]] });
                            clone[button] = update(this.state.sections[button], { $unshift: [itemId] });
                            done = true;
                        }
                    } else if (sectionName != button) {  // copy over the other stction byt don't overwrite the one you are modifying
                        clone[sectionName] = this.state.sections[sectionName].slice();
                    }
                }
            );
            this.setState({ 'sections': clone });

            //this browser may scroll the window down if the element being moved is below the fold.  Let the browser do that, but then scroll back to where it was.
            //this doesn't happen when moveing and object up, above the fold. 
            var doc = document.documentElement;
            this.currentTop = (window.pageYOffset || doc.scrollTop) - (doc.clientTop || 0);
            this.scrollBackToTop = true;


        }

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

        const { user } = this.props;
        const { panel } = this.props.shared;

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

            if ( ! (this.props.shared && this.props.shared.why && this.props.shared.why[this.whyName] && Object.keys(this.props.shared.why[this.whyName]).length)) {
                // if we don't have any data to work with 
                loading.push(
                    <div className="gutter text-center">
                            <p>We don't seem to have anything to work with here. Try going back to the previous task.</p>
                    </div>
                );
            } else {
                let topItem=true;
                this.buttons.forEach((name) => {
                    if (this.state.sections['unsorted'].length) { issues++ }
                    let qb = this.ButtonList[name];
                    if (qb.max) {
                        console.info("QSortRefine qb", qb, this.state)
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
                                id: item._id  //FlipMove uses this Id to sort
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
                                onClick={this.toggle.bind(this, null, 'done')}
                                className="qwhy-done"
                                style={{ backgroundColor: Color(this.ButtonList['unsorted'].color).negate(), color: this.ButtonList['unsorted'].color, float: "right" }}
                                >
                                <span className="civil-button-text">{"next"}</span>
                            </Button>
                        </div>
                    )
                }
            }
        }


        return (
            <section id="syn-panel-qsort">
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
                                {content.map(article => <QSortRefineItem {...article} key={article.id} />)}
                            </FlipMove>
                        </div>
                    </div>
                    {loading}
                </Panel>
            </section>
        );
    }
}

export default QSortRefine;

class QSortRefineItem extends React.Component {

    render(){
        const {qbuttons, sectionName, item,  whyItemId, user, type, toggle, buttonstate, whyName, show, emitter, voted, winner } = this.props;
        var creator=[];
        const hIndex= (whyName === 'most') ? 0 : 1;
        const active = show ? {item: whyItemId, section: 'promote'} : {};  // requried to convince EvaluationStore to be active
        const panel={type: type};

        if(voted){
            creator=[
                <div style={{backgroundColor: qbuttons[whyName].color}}>
                    <ItemStore item={ winner } key={ `item-${winner._id}` }>
                        <Item
                            item    =   { winner }
                            user    =   { user }
                            collapsed =  { false }  //collapsed if there is an active item and it's not this one
                            toggle  =   { toggle }
                            focusAction={null}
                            truncateItems={null}
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
                        />
                    </EvaluationStore>
            ];
        }
        return(
                <div style={{backgroundColor: qbuttons[whyName].color}}>
                    <ItemStore item={ item } key={ `item-${item._id}` }>
                        <Item
                            item    =   { item }
                            user    =   { user }
                            footer= { creator }
                            collapsed =  { false }  //collapsed if there is an active item and it's not this one
                            toggle  =   { toggle }
                            focusAction={null}
                            truncateItems={null}
                        />
                    </ItemStore>
                </div>
        );

    }
}
