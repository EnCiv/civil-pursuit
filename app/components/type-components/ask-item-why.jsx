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

/**
 * parent - the parent of the items being created.
 * type - the type of the item being create
 * 
 */

 const styles={
    'ask': {
        'font-size': '1.5em'
    },
    'creator': {
        padding: `${publicConfig.itemVisualGap} 0  ${publicConfig.itemVisualGap} ${publicConfig.itemVisualGap}`
    },
    'why': {
        padding: `0 0 1em 0`,
        'font-size': '1.375em'
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
                            this.setState({ideas})
                            setTimeout(()=>props.rasp.toParent({type: "NEXT_PANEL", status: 'done'}),250) // if there's already date then move on
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
    constructor(props) {
        super(props, 'ideaNum',0);
    }
    done() {
        Object.keys(this.props.ideas).forEach(ideaNum=>{
            if(this.toChild[ideaNum]) this.toChild[ideaNum]({type: "POST_ITEM", noToggle: true});
            if(this.toChild[ideaNum+'-why']) this.toChild[ideaNum+'-why']({type: "POST_ITEM", noToggle: true});
        })
        this.props.rasp.toParent({type: "NEXT_PANEL", status: 'done'})
    }

    render() {
        const { user, parent, className, classes } = this.props;
        var constraints=[];
        return (
            <section id="syn-ask-item-why">
                <div className={classes["ask"]} key='idea'>
                    <Item className={className} min item={parent} user={user} rasp={this.childRASP('truncated','parent')}/>
                    <div className={classes["creator"]}>
                        {Object.keys(this.props.ideas).map(ideaNum=>{
                            return (<div key={'idea-'+ideaNum}>
                                <Item min headlineAfter className={className} visualMethod='edit' buttons={[]} item={this.props.ideas[ideaNum].item} rasp={this.childRASP('edit',ideaNum)} user={user} key={'answer-'+ideaNum} />
                                <div className={classes['why']}>{this.props.harmony[0].evaluateQuestion}</div>
                                <Item min headlineAfter className={className} visualMethod='edit' buttons={[]} item={this.props.ideas[ideaNum].why} rasp={this.childRASP('edit',ideaNum+'-why')} user={user} key={'why-'+ideaNum} />
                                </div>);
                        })}
                    </div>
                </div>
                <DoneItem active={!constraints.length} 
                    constraints={constraints}
                    message={"Continue"} 
                    onClick={this.done.bind(this)} 
                />
            </section>
        );
    }
}

export default injectSheet(styles)(AskItemWhy);



