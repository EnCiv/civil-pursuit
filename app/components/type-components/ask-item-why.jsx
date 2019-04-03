'use strict';

import React from 'react';
import Item from '../item';
import HarmonyStore from '../store/harmony'
import {ReactActionStatePath, ReactActionStatePathClient} from 'react-action-state-path';
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
    valid={}
    constructor(props) {
        super(props, 'ideaNum',0);
        if(this.props.populated) this.state.populated='initially';
    }

    actionFilters={
        "ITEM_CREATOR_DIRTY": (action,delta)=>{ Object.assign(this.valid,{[action.ideaNum]: action.valid}); this.isDone(this.props); return true}
    }

    isDone(props){
        const {ideas}=props;
        var constraints=[];
        let ideaNum;
        for(ideaNum in ideas){
            if(!(this.valid[ideaNum])) constraints.push("Waiting for an answer to the question");
            if(!(this.valid[ideaNum+'-why'])) constraints.push("Waiting for an explanation of why this answer is important to consider");
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
        this.queueAction({type: "NEXT_PANEL", status: 'done'})
    }

    componentWillReceiveProps(newProps){
        if(!this.props.populated && newProps.populated) this.setState({populated: 'fetched'}) // render after validity checks
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
                    populated={this.state.populated}
                    active={!this.state.constraints.length} 
                    constraints={this.state.constraints}
                    message={"Continue"} 
                    onClick={this.done.bind(this)}
                    autoAdvance={this.advance.bind(this)}
                />
            </section>
        );
    }
}

export default injectSheet(styles)(AskItemWhy);



