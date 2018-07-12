'use strict';

import React from 'react';
import Item from '../item';
import QSortButtonList from '../qsort-button-list';
import {ReactActionStatePath, ReactActionStatePathClient} from 'react-action-state-path';
import ItemCreator from '../item-creator';
import PanelHeading from '../panel-heading';
import DoneItem from '../done-item';



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
    state={ideaCount: 0};

    constructor(props) {
        super(props, 'ideaNum',0);
        this.QSortButtonList=this.props.qbuttons || QSortButtonList;
        this.createDefaults();
    }

    //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~  

    actionToState(action, rasp, source, initialRASP, delta) {
        var nextRASP = {};
        if (action.type === "POST_ITEM") {
            let item = action.item;
            let shared = this.props.shared;
            var results = { idea: item, parent: this.props.parent, type: this.props.type };
            if (shared.items && shared.sections && shared.index && item._id) {  // if the previous step had resulted in a qsorted list.
                shared.items.push(item);
                results.items = shared.items;
                let mostSection=Object.keys(this.QSortButtonList).find(b=>this.QSortButtonList[b].harmonySide==='left');  // stuff that the user writes automatically goes into the mostSection - most Important
                if (shared.sections[mostSection]) shared.sections[mostSection].push(item._id);
                else shared.sections[mostSection] = [item._id];
                results.sections = shared.sections;
                this.props.shared.index[item._id] = shared.items.length - 1;
                results.index = shared.index;
                if(mostSection) window.socket.emit('insert qvote', { item: item._id, criteria: mostSection });  // the most important criteria
            }
            let ideaCount=this.state.ideaCount+1;
            if(this.props.minIdeas===0)
                setTimeout(() => this.props.rasp.toParent({ type: "NEXT_PANEL", results }));
            this.setState({ideaCount});
            // no state change, the action will be consumed here
        } else if (action.type === "DESCENDANT_FOCUS") {
            if (this.props.item && this.props.item.type && this.props.item.type.visualMethod && (this.props.item.type.visualMethod === 'ooview')) {
                if (action.distance > 1) {
                    delta.decendantFocus = true;
                }
            }
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

        const { user, rasp, panelNum, parent, minIdeas=0, numIdeas=1, maxIdeas=1 } = this.props;
        let nIdeas=Math.min(Math.max(this.state.ideaCount+2,numIdeas),maxIdeas);

        return (
            <section id="syn-cafe-idea">
                <div className="syn-cafe-idea" key='idea'>
                    <Item min item={parent} user={user} rasp={this.childRASP('truncated','item')}/>
                    <div className="syn-cafe-idea-creator">
                        {nIdeas.map(i=><ItemCreator type={this.props.type} parent={this.props.parent} rasp={this.childRASP('truncated','idea'+i)} key={'idea'+i}/>)}
                    </div>
                </div>
                <DoneItem active={this.state.ideaCount>= minIdeas} 
                    message={minIdeas ? "Continue" : "Continue without contributing an additional idea."} 
                    onClick={()=>this.props.rasp.toParent({type: "NEXT_PANEL", status: "done", results: {}})} 
                />
            </section>
        );
    }
}

export default CafeIdea;



