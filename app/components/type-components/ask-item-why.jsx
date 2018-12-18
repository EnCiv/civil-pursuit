'use strict';

import React from 'react';
import Item from '../item';
import HarmonyStore from '../store/harmony'
import {ReactActionStatePath, ReactActionStatePathClient} from 'react-action-state-path';
import DoneItem from '../done-item';

/**
 * parent - the parent of the items being created.
 * type - the type of the item being create
 * 
 */

export default class AskItemWhy extends React.Component {
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

    getIdeaRef(ideaNum, e){
        if(e){
            this.ideaState[ideaNum].itemRef=e;
        }
    }

    getIdeaWhyRef(ideaNum, e){
        if(e){
            this.ideaState[ideaNum].itemWhyRef=e;
        }
    }

    done(){
        let i;
        for( i of Object.keys(this.ideaState)) {
            let idea=this.ideaState[i]
            if(idea.itemRef.isValid() && idea.itemWhyRef.isValid()){
                idea.itemRef.post();
                idea.itemWhyRef.post();
            }
        }
    }
    

    render() {
        const { user, parent } = this.props;
        var constraints=[];
        return (
            <section id="syn-ask-item-why">
                <div className="syn-ask-item-why" key='idea'>
                    <Item min item={parent} user={user} rasp={this.childRASP('truncated','item')}/>
                    <div className="syn-cafe-idea-creator">
                        {Object.keys(this.ideaState).map(ideaNum=>{
                            return (<div>
                                <Item visualMethod='edit' buttons={[]} item={this.ideaState[ideaNum].item} rasp={this.childRASP('headlineAfterEdit',ideaNum)} user={user} key={ideaNum} ref={this.getIdeaRef.bind(this,ideaNum)}/>
                                <div className="center">{this.props.harmony[0].evaluateQuestion}</div>
                                <Item visualMethod='edit' buttons={[]} item={this.ideaState[ideaNum].why} rasp={this.childRASP('headlineAfterEdit',ideaNum+'-why')} user={user} key={ideaNum+'-why'} ref={this.getIdeaWhyRef.bind(this,ideaNum)}/>
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




