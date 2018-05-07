'use strict';

import React from 'react';
import Panel from '../panel';
import PanelStore from '../store/panel';
import PanelItems from '../panel-items';
import panelType from '../../lib/proptypes/panel';
import ItemStore from '../store/item';
import update from 'immutability-helper';
import FlipMove from 'react-flip-move';
import QSortFlipItem from '../qsort-flip-item';
import smoothScroll from '../../lib/app/smooth-scroll';
import Color from 'color';
import Button           from '../util/button';
import ButtonGroup           from '../util/button-group';
import Item from '../item';
import Creator            from '../creator';
import QSortButtonList from '../qsort-button-list';
import {ReactActionStatePath, ReactActionStatePathClient} from 'react-action-state-path';
import {QSortToggle} from './qsort-items';
import ItemCreator from '../item-creator';
import PanelHeading from '../panel-heading';
import Accordion from 'react-proactive-accordion';


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
                if (shared.sections.most) shared.sections.most.push(item._id);
                else shared.sections.most = [item._id];
                results.sections = shared.sections;
                this.props.shared.index[item._id] = shared.items.length - 1;
                results.index = shared.index;
                let criteria=Object.keys(this.QSortButtonList).find(b=>this.QSortButtonList[b].harmonySide==='left');
                if(criteria) window.socket.emit('insert qvote', { item: item._id, criteria });  // the most important criteria
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
        var results=null;
        let nIdeas=Math.min(Math.max(this.state.ideaCount+2,numIdeas),maxIdeas);
    

        const onServer = typeof window === 'undefined';

        var done=(
            <Accordion active={this.state.ideaCount >= minIdeas} >
                <div className='instruction-text' key="done">
                    {minIdeas ? "Continue" : "Continute without contributing an additional idea."}
                    <Button small shy
                        onClick={()=>this.props.rasp.toParent({type: "NEXT_PANEL", status: "done", results: {}})}
                        className="cafe-idea-done"
                        style={{ backgroundColor: Color(this.QSortButtonList['unsorted'].color).negate(), color: this.QSortButtonList['unsorted'].color, float: "right" }}
                        >
                        <span className="civil-button-text">{"next"}</span>
                    </Button>
                </div>
            </Accordion>
        );


        return (
            <section id="syn-cafe-idea">
                {done}
                <div className="syn-cafe-idea" key='idea'>
                    <Item min item={parent} user={user} rasp={this.childRASP('truncated','item')}/>
                    <div className="syn-cafe-idea-creator">
                        {nIdeas.map(i=><ItemCreator type={this.props.type} parent={this.props.parent} rasp={this.childRASP('truncated','idea'+i)} key={'idea'+i}/>)}
                    </div>
                </div>
            </section>
        );
    }
}

export default CafeIdea;



