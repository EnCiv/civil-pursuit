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


class QSortWhy extends React.Component {

    static propTypes = {
        panel: panelType
    };

    ButtonList = {
        unsorted: {
            name: 'unsorted',
            color: '#ffffff',
            title: {
                active: "Yea! this is in a stack",
                inactive: "Put this in in a stack"
            },
            direction: 'Great! You have completed this step. You can review your choices continue to the next step.'
        },
        most: {
            name: 'most',
            color: '#e0e0ff',
            title: {
                active: "Yea! this is in the most important stack",
                inactive: "Put this in the most important stack"
            },
            max: 5,
            direction: 'We are limiting the number of things in the "most" stack to 5. Please  move some to other stacks'
        },
    };

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

    constructor(props) {
        super(props);
        var unsortedList = [];
        this.buttons = Object.keys(this.ButtonList);
        this.state.sections = {};
        this.buttons.forEach(button => {
            this.state.sections[button] = [];
        });
        this.state.sections['unsorted'] = this.props.shared.sections['most'].slice(0);
        console.info("qsortWhy constructor", this.props.shared);
    }

    //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~  

    componentWillReceiveProps(newProps) { //items that are nolonger there will be removed, existing item section will be preserved, new items will be in unsorted.
        console.info("qsortWhy componentWillReceiveProps", this.props, newProps, this.state);
        var newSections=[];
        this.buttons.forEach(button=> newSections[button]=[] );

        newProps.shared.sections['most'].forEach(itemId=>{
            if(this.state.sections['most'].includes(itemId)){ newSections.most.push(itemId)} 
            else{ newSections['unsorted'].push(itemId) }
        });

        this.setState({sections: newSections});

    }


    //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

    toggle(itemId, button) {
        //find the section that the itemId is in, take it out, and put it in the new section
        let i;
        let done = false;
        var clone = {};
        if( button == "done" && this.props.next ){ 
            const results={ index: this.index,
                            sections: this.state.sections
            }
            this.props.next(results)
        }
        if (itemId && button && button !== 'harmony') {
            Object.keys(this.ButtonList).forEach(
                (sectionName) => {
                    if (!done && ((i = this.state.sections[sectionName].indexOf(itemId)) !== -1)) {
                        if (sectionName === button) {
                            //take the i'th element out of the section it is in and put it back in unsorted
                            clone[button] = update(this.state.sections[button], { $splice: [[i, 1]] });
                            clone['unsorted'] = update(this.state.sections['unsorted'], { $unshift: [itemId] });
                            done = true;
                        } else if (sectionName === 'unsorted') {
                            // it was in unsorted, so take it out and put it where it in the button's section
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

            if ( ! (this.props.shared && this.props.shared.sections && this.props.shared.sections.most && Object.keys(this.props.shared.sections.most.length))) {
                // if we don't have any data to work with 
                loading.push(
                    <div className="gutter text-center">
                            <p>We don't seem to have anything to work with here. Try going back to the previous task.</p>
                    </div>
                );
            } else {
                this.buttons.forEach((name) => {
                    if (this.state.sections['unsorted'].length) { issues++ }
                    let qb = this.ButtonList[name];
                    if (qb.max) {
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
                        content.push(
                            {
                                sectionName: name,
                                user: user,
                                item: item,
                                toggle: this.toggle.bind(this),
                                qbuttons: this.ButtonList,
                                buttonstate: buttonstate,
                                id: item._id  //FlipMove uses this Id to sort
                            }
                        );
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
                    <div className="qsort-flip-move-articles">
                        <FlipMove duration={this.motionDuration} onFinishAll={this.onFlipMoveFinishAll.bind(this)} disableAllAnimations={onServer}>
                            {content.map(article => <QSortWhyItem {...article} key={article.id} />)}
                        </FlipMove>
                    </div>
                    {loading}
                </Panel>
            </section>
        );
    }
}

export default QSortWhy;

class QSortWhyItem extends React.Component {

    render(){
        const {qbuttons, sectionName, item, user, toggle, buttonstate } = this.props;
        var creator=[];

        if(item.harmony && item.harmony.types[0]){
            creator=[
                <PanelStore type={ item.harmony.types[0] } parent={ item } own={true} >
                    <QSortWhyCreate
                        type    =   { item.harmony.types[0] }
                        parent  =   { item }
                    />
                </PanelStore >
            ];
        }

        return(
                <div style={{backgroundColor: qbuttons[sectionName].color}}>
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

class QSortWhyCreate extends React.Component {
    render(){
        console.info("QSortWhyCreate", this.props);
        const {type, parent, items } = this.props; // items is Object.assign'ed as a prop through PanelStore
        const item= items[0] || null;
        return(
                    <Creator
                        type    =   { type }
                        parent  =   { parent }
                        item = { items }  
                    />
        );
    }
}

