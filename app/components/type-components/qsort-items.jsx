'use strict';

import React from 'react';
import ReactDOM from 'react-dom';
import FlipMove from 'react-flip-move';
import QSortFlipItem from '../qsort-flip-item'
import smoothScroll from '../../lib/app/smooth-scroll';
import Color from 'color';
import Button           from '../util/button';
import QSortButtonList from '../qsort-button-list';
import Accordion          from 'react-proactive-accordion';
import PanelStore from '../store/panel';
import QVoteStore from '../store/qvote';
import {ReactActionStatePath, ReactActionStatePathClient, ReactActionStatePathFilter} from 'react-action-state-path';
import update from 'immutability-helper';
import PanelHeading from '../panel-heading';
import DoneItem from '../done-item';
import insertQVote from '../../api-wrapper/insert-qvote';
import publicConfig from '../../../public.json'

export class QSortItems extends React.Component {
    
    render(){
        //logger.info("QSortItems.render", this.props);
        return(
        <PanelStore parent={this.props.parent}
                    type={this.props.type}
                    limit={publicConfig.timeouts.bigLimit} >
            <QVoteStore {...this.props}>
                <ReactActionStatePath>
                        <PanelHeading  cssName={'syn-qsort-item'} panelButtons={['Creator','Instruction']}>
                            <RASPQSortItems />
                        </PanelHeading>
                </ReactActionStatePath>
            </QVoteStore>
        </PanelStore>
        );
    }
}

export class RASPQSortItems extends ReactActionStatePathClient {

    motionDuration = publicConfig.timeouts.animation; //500mSec

    scrollBackToTop = false;

    constructor(props){
        super(props, 'itemId');  // shortId is the key for indexing to child RASP functions
        this.QSortButtonList=this.props.qbuttons || QSortButtonList;
        //onsole.info("RASPQSortItems.constructor");
        this.createDefaults();
    }

    // if initially done, notify panel list to move on, otherwise notify list of issues
    componentDidMount(){
        if(!this.getConstraints(this.props)){
            this.queueAction({type: "NEXT_PANEL", status: "done", results: this.results(this.props)});
        } else {
            this.queueAction({type: "ISSUES"});
        }
    }

    //  notify panel list of done status of this panel
    componentWillReceiveProps(newProps){
        if (!this.getConstraints(newProps).length) {
            if((newProps.items && newProps.items.length) && !(this.props.items && this.props.items.length)) // first time we have populated data
                setTimeout(()=>this.queueAction({type: "NEXT_PANEL", status: "done", results: this.results(newProps)}),publicConfig.timeouts.glimpse);
            else
                this.queueAction({type: "RESULTS", results: this.results(newProps)});
        } else { // there are issues
            this.queueAction({type: "ISSUES"});
        }
    }

    // the results to be passed forward to other pannels in the list
    results(props){
        if(!props) return {index: {}, sections: {}, items: [] };
        else return {index: props.index, sections: props.sections, items: props.items };
    }

    // if the panel is done, say so
    getConstraints(props){
        let count=0;
        var constraints=[];
        if(props.sections['unsorted'].length){
            constraints.push(props.sections['unsorted'].length+' left to sort');
        }
        Object.keys(this.QSortButtonList).forEach(criteria=>{ // there is no some section[criteria] where
            let max=this.QSortButtonList[criteria].max;
            let min=this.QSortButtonList[criteria].min;
            let length=props.sections[criteria] && props.sections[criteria].length || 0;
            count=count+length;
            if(max && length > max) // there are more items than max 
                constraints.push(this.QSortButtonList[criteria].name+' has '+(length - max)+' too many');
            if(min && length < min)
                    constraints.push(this.QSortButtonList[criteria].name+' has '+(min - length)+' too few');
        })
        if(!count)
            constraints.push('waiting for items to sort');
        return constraints;
    }

    //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    // 
    actionToState(action, rasp, source, defaultRASP, delta) {
        //find the section that the itemId is in, take it out, and put it in the new section
        var nextRASP={};
        if(action.type==="TOGGLE_QBUTTON") {
            //this browser may scroll the window down if the element being moved is below the fold.  Let the browser do that, but then scroll back to where it was.
            //this doesn't happen when moveing and object up, above the fold. 
            this.scrollBackToTop = true;
            this.props.toggle(action.itemId, action.button); // toggle the item in QSort store
            insertQVote({ item: action.itemId, criteria: action.button });
            delta.creator=false;
        } else if (action.type==="RESET"){
            console.info("RASPQSortItems RESET");
            Object.assign(this.props.shared, this.results()); // reset the results
            if(this.props.randomItemStoreRefresh) this.props.randomItemStoreRefresh();
            if(this.props.resetStore) this.props.resetStore();
            return; // no need to return a state, it's being reset
        } else if (action.type==="TOGGLE_FOCUS") {
            this.queueUnfocus(action);
        } else if (Object.keys(delta).length){
            ; // do nothing, but proceed to building nextRASP because one of the actionFilters has updated the state
        } else 
            return null;
        Object.assign(nextRASP, rasp, delta);
        return(nextRASP);
    }

    onFlipMoveFinishAll() {
        let constraints=this.getConstraints(this.props)
        if(constraints.length && this.props.sections['unsorted'].length==0) {
            setTimeout(() => { smoothScroll(ReactDOM.findDOMNode(this.refs.doneItem), publicConfig.timeouts.slowAnimation) }, publicConfig.timeouts.quick);
            this.scrollBackToTop=false;
        }else if (this.scrollBackToTop) {
            this.scrollBackToTop = false;
            if(constraints.length) {
                setTimeout(() => { smoothScroll(this.refs.top, publicConfig.timeouts.slowAnimation) }, publicConfig.timeouts.quick);
            }
        }
        if(this.props.onFinishAll){return this.props.onFinishAll()}
    }

    //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

    render() {
        //onsole.info("RASPQSortItems.render");

        const { count, user, rasp, items, type, parent, sections } = this.props;

        const onServer = typeof window === 'undefined';
        const constraints=this.getConstraints(this.props);

        let articles = [];

        if (Object.keys(this.props.index).length) {
            Object.keys(this.QSortButtonList).forEach((criteria) => {  // the order of the buttons matters, this as the reference. props.sections may have a different order because what's first in db.
                sections[criteria] && sections[criteria].forEach(itemId => {
                    var item = items[this.props.index[itemId]];
                    articles.push(
                        <QSortFlipItem 
                            sectionName={criteria}
                            qbuttons={this.QSortButtonList}
                            user={user}
                            item={item}
                            key={item._id}
                            rasp={{shape: 'truncated', depth: rasp.depth, button: criteria, toParent: this.toMeFromChild.bind(this,item._id)}}
                            />
                    );
                });
            });
        }

        return (
            <section id="syn-panel-qsort">
                <div style={{ position: 'relative', display: 'block' }} ref="top" key="fliplist">
                    <div className="qsort-flip-move-articles">
                        <FlipMove duration={this.motionDuration} onFinishAll={this.onFlipMoveFinishAll.bind(this)} disableAllAnimations={onServer}>
                            {articles}
                        </FlipMove>
                    </div>
                </div>
                <DoneItem 
                    ref="doneItem"
                    populated={items && items.length}
                    constraints={constraints}
                    active={!constraints.length}
                    message={this.QSortButtonList['unsorted'].direction || "Complete"}
                    onClick={()=>this.props.rasp.toParent({type: "NEXT_PANEL", status: "done", results: this.results(this.props)})}
                />
            </section>
        );
    }
}

export default QSortItems;

// sections is an array of named sections.
// each section is an array of itemIds
// if you 'toggle' any itemId in a section, you are moving that itemId into that section, from whatever section it was in,
// or, if the itemId is already in that section, you are moving it to the unsored section.
// the unsorted section is the first in the list
// if 'set' is equal to 'set' then you are moving the itemId into that section regardless of whethere it is in there or not.
// if itemId is not in any section it will be added
// if section is not in sections, it will be added and itemId will be the first element in it
// a new copy is returned - sections is not mutated;
// If itemId is in the unsorted list and the target section is unsorted, then it will be moved to the top of the list, or if 'set' it will be left as is.
//

export function QSortToggle(sections,itemId,section, set) {
    let done=false, i;
    var clone={};
    let sectionNames=Object.keys(sections);
    let unsorted=sectionNames[0]; // the first section is the unsorted one.
    if (itemId){
        sectionNames.forEach(
            (sectionName) => {
                if (!done && ((i = sections[sectionName].indexOf(itemId)) !== -1)) {
                    if (sectionName === section) {
                        if(set==='set') { // set means don't toggle it
                            clone[section]=sections[section].slice();
                            if(section!==unsorted) clone[unsorted]=sections[unsorted].slice();
                            done=true;
                        } else {
                            //take the i'th element out of the section it is in and put it back in unsorted
                            clone[section] = update(sections[section], { $splice: [[i, 1]] });
                            if(section !== unsorted) clone[unsorted] = update(sections[unsorted], { $unshift: [itemId] });
                            else clone[unsorted].unshift(itemId);
                            done = true;
                        }
                    } else if (sectionName === unsorted) {
                        // it was in unsorted, so take it out and put it in the section's section
                        clone[unsorted] = update(sections[unsorted], { $splice: [[i, 1]] });
                        if(sections[section]) clone[section] = update(sections[section], { $unshift: [itemId] }); // section alread there, add the new itemId to it
                        else clone[section]=[itemId] // add the section and the itemId
                        done = true;
                    } else { // the item is in some other sectionName and should be moved to this section's section
                        clone[sectionName] = update(sections[sectionName], { $splice: [[i, 1]] });
                        if(sections[section]) clone[section] = update(sections[section], { $unshift: [itemId] });
                        else clone[section]=[itemId]; // if the section didn't exisit in sections add it.
                        done = true;
                    }
                } else if (sectionName != section) {  // copy over the other section but don't overwrite the one you are modifying
                    clone[sectionName] = sections[sectionName].slice();
                }
            }
        );
        if(!done){
            if(clone[section]) clone[section].unshift(itemId); // a new itemId not found in any section, add this one to the beginning of the list.
            else clone[section]=[itemId];
        }
        return clone;
    } return null;
}

