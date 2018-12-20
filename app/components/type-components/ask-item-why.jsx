'use strict';

import React from 'react';
import Item from '../item';
import HarmonyStore from '../store/harmony'
import {ReactActionStatePath, ReactActionStatePathClient} from 'react-action-state-path';
import DoneItem from '../done-item';
import injectSheet from 'react-jss'
import publicConfig from '../../../public.json'

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

class AskItemWhy extends React.Component {
    render(){
        return (
            <ReactActionStatePath {...this.props}>
                <HarmonyStore>
                    <RASPAskItemWhy />
                </HarmonyStore>
            </ReactActionStatePath>
        )
    }
}

class RASPAskItemWhy extends ReactActionStatePathClient {
    ideaState={}; // tracking the state of children

    constructor(props) {
        super(props, 'ideaNum',0);
        var item={type: this.props.type};
        if(this.props.parent) item.parent=this.props.parent;
        this.ideaState['idea'+0]={posted: false, dirty: false, item: item, why: {parent: item, type: this.props.harmony[0]}};
        this.createDefaults();
    }

    done() {
        Object.keys(this.ideaState).forEach(ideaNum=>{
            if(this.toChild[ideaNum]) this.toChild[ideaNum]({type: "POST_ITEM", noToggle: true});
            if(this.toChild[ideaNum+'-why']) this.toChild[ideaNum+'-why']({type: "POST_ITEM", noToggle: true});
        })
    }

    render() {
        const { user, parent, className, classes } = this.props;
        var constraints=[];
        return (
            <section id="syn-ask-item-why">
                <div className={classes["ask"]} key='idea'>
                    <Item className={className} min item={parent} user={user} rasp={this.childRASP('truncated','parent')}/>
                    <div className={classes["creator"]}>
                        {Object.keys(this.ideaState).map(ideaNum=>{
                            return (<div>
                                <Item min headlineAfter className={className} visualMethod='edit' buttons={[]} item={this.ideaState[ideaNum].item} rasp={this.childRASP('edit',ideaNum)} user={user} key={ideaNum} />
                                <div className={classes['why']}>{this.props.harmony[0].evaluateQuestion}</div>
                                <Item min headlineAfter className={className} visualMethod='edit' buttons={[]} item={this.ideaState[ideaNum].why} rasp={this.childRASP('edit',ideaNum+'-why')} user={user} key={ideaNum+'-why'} />
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



