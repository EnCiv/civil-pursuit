'use strict';

import React from 'react';
import Item from '../item';
import QSortButtonList from '../qsort-button-list';
import {ReactActionStatePath, ReactActionStatePathClient} from 'react-action-state-path';
import PanelHeading from '../panel-heading';
import DoneItem from '../done-item';
import insertQVote from '../../api-wrapper/insert-qvote';

/**
 * minIdea - the number of ideas required to get the done button. if negative then an answer is required unless parent.answerCount is greater than one
 * maxIdeas - the number of idea input boxes to show
 * 
 */


Number.prototype.map = function(f){
    var a=[];
    let n=0;
    while(n<this)
        a.push(f(n++));
    return a;
};


class CafeIdea extends React.Component {
    render(){
        return (
            <ReactActionStatePath {...this.props}>
                <PanelHeading  items={[]} cssName={'syn-cafe-idea'} panelButtons={['Creator','Instruction']}>
                    <RASPCafeIdea />
                </PanelHeading>
            </ReactActionStatePath>
        )
    }
}

class RASPCafeIdea extends ReactActionStatePathClient {
    ideaState={}; // tracking the state of children

    constructor(props) {
        super(props, 'ideaNum',0);
        this.QSortButtonList=this.props.qbuttons || QSortButtonList;
        this.createDefaults();
    }

    //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~  

    actionToState(action, rasp, source, initialRASP, delta) {
        const ideaCount=()=>{  // the number of ideas posted less those being edited
            return Object.keys(this.ideaState).length-Object.keys(this.ideaState).reduce((a,k)=>(a + (this.ideaState[k].dirty ? 1 : 0)),0);
            //return Object.keys(this.ideaState).length-Object.keys(this.ideaState).reduce((a,k)=>(a + (this.ideaState[k].posted ? 0 : 1)),0);
        }
        const dirtyCount=()=>Object.keys(this.ideaState).reduce((a,k)=>(a + (this.ideaState[k].dirty ? 1 : 0)),0);
        var nextRASP = {};
        if (action.type === "POST_ITEM") {
            let item = action.item;
            let shared = this.props.shared;
            var results = { idea: item, parent: this.props.parent, type: this.props.type };
            this.ideaState[action.ideaNum]={posted: true, dirty: false, item};
            if (shared.items && shared.sections && shared.index && item._id) {  // if the previous step had resulted in a qsorted list.
                shared.items.push(item);
                results.items = shared.items;
                let mostSection=Object.keys(this.QSortButtonList).find(b=>this.QSortButtonList[b].harmonySide==='left');  // stuff that the user writes automatically goes into the mostSection - most Important
                if (shared.sections[mostSection]) shared.sections[mostSection].push(item._id);
                else shared.sections[mostSection] = [item._id];
                results.sections = shared.sections;
                this.props.shared.index[item._id] = shared.items.length - 1;
                results.index = shared.index;
                if(mostSection) insertQVote({ item: item._id, criteria: mostSection });  // the most important criteria
            }
            delta.ideaCount=ideaCount();
            delta.dirtyCount=dirtyCount();
            if(this.props.minIdeas===0)
                setTimeout(() => this.props.rasp.toParent({ type: "NEXT_PANEL", results }));
            // no state change, the action will be consumed here
        } else if ((action.type === "DESCENDANT_FOCUS") && (action.distance > 1) && this.props.item && this.props.item.type && this.props.item.type.visualMethod && (this.props.item.type.visualMethod === 'ooview')) {
                    delta.decendantFocus = true;
                    // this is redundant with what's below. There's got to be a better way to write this. but for now...
                    if(action.wasType ==="TOGGLE_BUTTON" && action.distance===2 && action.button==='Edit'){
                        // user is editing something already posted
                            this.ideaState[action.ideaNum].posted=false;
                            delta.ideaCount=ideaCount();
                    }
        } else if (action.type === "ITEM_CREATOR_DIRTY")  {
            if(this.ideaState[action.ideaNum])
                this.ideaState[action.ideaNum].dirty=action.dirty;
            else 
                this.ideaState[action.ideaNum]={posted: false, dirty: action.dirty, item:null};
            delta.dirtyCount=dirtyCount();
            delta.ideaCount=ideaCount();
        } else if(action.wasType ==="TOGGLE_BUTTON" && action.distance===2 && action.button==='Edit'){
            // user is editing something already posted - this happend on DESCENDANT_FOCUS and UNFOCUS
                this.ideaState[action.ideaNum].posted=false;
                delta.ideaCount=ideaCount();          
        } else if (action.type === "DESCENDANT_UNFOCUS" && action.distance === 1) {
            if (rasp.decendantFocus) delta.decendantFocus = false;  // my child has unfocused
        } else if(Object.keys(delta).length){
            ; // things were done in the action filters before getting here. proceed to returning the nextRASP
        } else
            return null;
        Object.assign(nextRASP, rasp, delta);
        if (nextRASP.decendantFocus) nextRASP.shape = 'view'; else nextRASP.shape = 'open';
        if (nextRASP.decendantFocus) nextRASP.pathSegment = 'd';
        else nextRASP.pathSegment = null;
        return nextRASP;
    }

    segmentToState(action,initialRASP){
        var nextRASP={shape: initialRASP.shape, pathSegment: action.segment}
        if(action.segment==='d') nextRASP.decendantFocus=true;
        if(nextRASP.decendantFocus) nextRASP.shape='view'; else nextRASP.shape='open';
        return {nextRASP, setBeforeWait: true}
    }

    componentDidMount(){
        //onsole.info("CafeIdea.componentDidMount change shape to open");
        this.queueFocus({type: "COMPONENT_DID_MOUNT"});
    }

    //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

    render() {

        const { user, rasp, panelNum, parent, minIdeas=0, numIdeas=1, maxIdeas=1, showParent=true } = this.props;
        let ideaCount=rasp.ideaCount || 0;
        let nIdeas=Math.min(Math.max(ideaCount+2,numIdeas),maxIdeas);
        let constraints=[];
        let needed = -(ideaCount - (minIdeas >= 0 ? minIdeas : parent.answerCount>0 ? 0 : 1));
        if(needed===1) constraints.push("One more to continue");
        else if(needed > 1) constraints.push(needed+" more to continue");
        let editing=rasp.dirtyCount || 0;
        //let editing=Object.keys(this.ideaState).reduce((a,k)=>(a+((this.ideaState[k].dirty) ? 1 : 0)), 0);
        //let editing=Object.keys(this.ideaState).reduce((a,k)=>(a+((this.ideaState[k].posted) ? 0 : 1)), 0);
        if(editing === 1) constraints.push("One item waiting to be posted");
        else if(editing > 1) constraints.push(editing+" items waiting to be posted");
        return (
            <section id="syn-cafe-idea">
                <div className="syn-cafe-idea" key='idea'>
                    {showParent ? <Item min item={parent} user={user} rasp={this.childRASP('truncated','item')}/> : null }
                    <div className="syn-cafe-idea-creator">
                        {nIdeas.map(i=>{
                            var item={type};
                            if(parent) item.parent=parent;
                            return (<Item visualMethod='edit' buttons={['Post']} item={item} rasp={this.childRASP('truncated','idea'+i)} key={'idea'+i}/>);
                        })}
                    </div>
                </div>
                <DoneItem active={!constraints.length} 
                    constraints={constraints}
                    message={ideaCount>0 ? "Continue" : "Continue without contributing an idea."} 
                    onClick={()=>this.props.rasp.toParent({type: "NEXT_PANEL", status: "done", results: {items: Object.keys(this.ideaState).map(k=>this.ideaState[k].item)}})} 
                />
            </section>
        );
    }
}

export default CafeIdea;



