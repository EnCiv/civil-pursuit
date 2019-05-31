'use strict';

import React from 'react';
import Item from '../item';
import HarmonyStore from '../store/harmony'
import {ReactActionStatePath, ReactActionStatePathClient, ReactActionStatePathMulti} from 'react-action-state-path';
import DoneItem from '../done-item';
import injectSheet from 'react-jss'
import publicConfig from '../../../public.json'
import {clientGetQueryItems} from '../../api/get-query-items'
import Store from '../store/store'
import isEqual from 'lodash/isEqual';

/**
 * parent - the parent of the items being created.
 * type - the type of the item being create
 * 
 */

 const styles={
     'outer': {
        margin: "0.5rem",
        padding: "0.5rem",
        border: "1px solid #666"
     },
    'ask': {
        'font-size': '1.5em'
    },
    'creator': {
        padding: `${publicConfig.itemVisualGap} 0  ${publicConfig.itemVisualGap} ${publicConfig.itemVisualGap}`
    },
    'why': {
        padding: `1em 0 .75em 0`,
        'font-size': '1.25em'
    },
    'question': {
        paddingLeft: '0.5rem'
    }
 }

const OWN=true; // in query only my own items
class Ideas {
    static initial(props){
        var item={type: props.type};
        if(props.parent) item.parent=props.parent;
        const ideas={['idea'+0]: {item: item, why: {parent: item, type: props.harmony[0]}}}
        return {ideas}; // this is the initial state
    }
    static componentDidMount(props){
        if(props.discussionGroup && props.discussionGroup.id){
            var query={};
            if(props.parent) query.parent=props.parent._id || this.props.parent;
            query.type=props.type._id || props.type;
            query._id={$gt: props.discussionGroup.id}
    
            clientGetQueryItems(query,OWN, (items,count)=>{
                if(count){
                    clientGetQueryItems({parent: items[0]._id, type: this.props.harmony[0]._id}, OWN, (whyItems,whyCount)=>{
                        if(whyCount){
                            var ideas={['idea'+0]: {item: items[0], why: whyItems[0]}};
                            this.setState({ideas, populated: true})
                        }
                    })
                }
            })
        }
    }
    static componentWillReceiveProps(props){
        Ideas.componentDidMount.call(this,props)
    }
}

class AskItemWhy extends React.Component {
    render(){
        return (
            <ReactActionStatePath {...this.props}>
                <HarmonyStore>
                    <Store fetch={Ideas} >
                        <RASPAskItemWhy />
                    </Store>
                </HarmonyStore>
            </ReactActionStatePath>
        )
    }
}

class RASPAskItemWhy extends ReactActionStatePathClient {
    state={constraints: [], populated: ''}
    constructor(props) {
        super(props, 'ideaNum',0);
        if(this.props.populated) this.state.populated='initially';
    }

    actionFilters={
        "ITEM_CREATOR_DIRTY": (action,delta)=>{ 
            let valid=this.props.rasp.valid || {};
            if(valid[action.ideaNum] !== action.valid) delta.valid=Object.assign({},valid,{[action.ideaNum]: action.valid});
            return true; // propagate further
        },
        "DESCENDANT_FOCUS": (action,delta)=>{
            delta.ideaNum=action.ideaNum;
            return true; // propagate further
        },
        "DESCENDANT_UNFOCUS": (action,delta)=>{
            delta.ideaNum=null;
            return true; // propagate further
        }
    }

    segmentToState(action, initialRASP) {
        var nextRASP = {}, delta={};
        if(action.segment) delta.ideaNum=action.segment;
        else console.error("AskItemWhy received unexpected segment:",action.segment);
        Object.assign(nextRASP,initialRASP,delta);
        this.deriveRASP(nextRASP, initialRASP);
        if (nextRASP.pathSegment !== action.segment) console.error("profile-panel.segmentToAction calculated path did not match", action.pathSegment, nextRASP.pathSegment)
        return { nextRASP, setBeforeWait: true }  // set nextRASP as state before waiting for child
    }

    deriveRASP(nextRASP, initialRASP){
        if(nextRASP.ideaNum) nextRASP.pathSegment=nextRASP.ideaNum;
    }

    isDone(props){
        const {ideas}=props;
        var constraints=[];
        let ideaNum;
        let valid=props.rasp.valid||{};
        for(ideaNum in ideas){
            if(!(valid[ideaNum])) constraints.push("Waiting for an answer to the question");
            if(!(valid[ideaNum+'-why'])) constraints.push("Waiting for an explanation of why this answer is important to consider");
        }
        if(!isEqual(constraints,this.state.constraints))
            this.setState({constraints});
        return !constraints.length
    }

    done() {
        Object.keys(this.props.ideas).forEach(ideaNum=>{
            if(this.toChild[ideaNum]) this.toChild[ideaNum]({type: "POST_ITEM", noToggle: true});
            if(this.toChild[ideaNum+'-why']) this.toChild[ideaNum+'-why']({type: "POST_ITEM", noToggle: true});
        })
        this.advance();
    }

    advance(){
        this.queueAction({type: "NEXT_PANEL", status: 'done', results: {items: Object.keys(this.props.ideas).map(ideaNum=>this.props.ideas[ideaNum].item)}})
    }

    componentDidMount(){
        this.sendResultsToPanel(this.props);
    }

    componentWillReceiveProps(newProps){
        if(!this.props.populated && newProps.populated) this.setState({populated: 'fetched'}) // render after validity checks
        this.sendResultsToPanel(newProps)
    }

    sendResultsToPanel(props){
        if(this.isDone(props)){
            this.queueAction({type: "RESULTS", status: 'done', results: {items: Object.keys(this.props.ideas).map(ideaNum=>this.props.ideas[ideaNum].item)}});
        } else {
            this.queueAction({type: "ISSUES"});
        }
    }

    render() {
        const { user, parent, className, classes, ideas } = this.props;

        return (
            <section id="syn-ask-item-why" className={classes['outer']}>
                <div className={classes["ask"]} key='idea'>
                    <Item className={'no-border'} min item={parent} user={user} visualMethod="defaultNoScroll" rasp={this.childRASP('truncated','parent')}/>
                    <div className={classes["creator"]}>
                        {Object.keys(ideas).map(ideaNum=>{
                            return (
                                <div key={'idea-'+ideaNum}>
                                    <Item min headlineAfter className={className} visualMethod='edit' buttons={[]} item={ideas[ideaNum].item} rasp={this.childRASP('edit',ideaNum)} user={user} key={'answer-'+ideaNum} />
                                    <div className={classes['question']} >
                                        <div className={classes['why']}>{this.props.harmony[0].evaluateQuestion}</div>
                                        <Item min headlineAfter className={className} visualMethod='edit' buttons={[]} item={ideas[ideaNum].why} rasp={this.childRASP('edit',ideaNum+'-why')} user={user} key={'why-'+ideaNum} />
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
                <DoneItem
                    active={!this.state.constraints.length} 
                    constraints={this.state.constraints}
                    message={"Continue"} 
                    onClick={this.done.bind(this)}
                />
            </section>
        );
    }
}

export default injectSheet(styles)(AskItemWhy);



