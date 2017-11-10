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
import Instruction from '../instruction';
import Color from 'color';
import Button           from '../util/button';
import ButtonGroup           from '../util/button-group';
import Item from '../item';
import Creator            from '../creator';
import QSortButtonList from '../qsort-button-list';
import {ReactActionStatePath, ReactActionStatePathClient} from 'react-action-state-path';
import {QSortToggle} from './qsort-items';
import ItemCreator from '../item-creator';
import PanelHead from '../panel-head';


class CafeIdea extends React.Component {
    render(){
        return (
            <PanelHead {...this.props} cssName={'syn-cafe-idea'} >
                <ReactActionStatePath>
                    <RASPCafeIdea />
                </ReactActionStatePath>
            </PanelHead>
        )
    }
}

class RASPCafeIdea extends ReactActionStatePathClient {

    constructor(props) {
        super(props, 'itemId',1);
        console.info("CafeIdea constructor");
        this.QSortButtonList=this.props.qbuttons || QSortButtonList;
    }

    //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~  

    actionToState(action, rasp, source,initialRASP){
        var nextRASP={}, delta={};
        if(action.type==="POST_ITEM"){
            var results={idea: action.item, parent: this.props.parent, type: this.props.type};
            if(this.props.shared.items && this.props.shared.sections && this.props.shared.index && action.item._id){  // if the previous step had resulted in a qsorted list.
                this.props.shared.items.push(action.item);
                results.items=this.props.shared.items;
                if(this.props.shared.sections.most) this.props.shared.sections.most.push(action.item._id);
                else this.props.shared.sections.most=[item._id];
                results.sections=this.props.shared.sections;
                this.props.shared.index[item._id]=this.props.shared.items.length-1;
                results.index=this.props.shared.index;
                window.socket.emit('insert qvote', { item: action.itemId, criteria: 'most' });
            }
            setTimeout(()=>this.props.rasp.toParent({ type: "NEXT_PANEL", results}))
            // no state change, the action will be consumed here
        } else if (action.type === "DECENDANT_FOCUS"){
            if(this.props.item && this.props.item.type && this.props.item.type.visualMethod && (this.props.item.type.visualMethod==='ooview')){
              if(action.distance>1) {
                delta.decendantFocus=true;
              }
            }
          } else if (action.type === "DECENDANT_UNFOCUS" && action.distance===1){
            if(rasp.decendantFocus) delta.decendantFocus=false;  // my child has unfocused
          } else
            return null;
        Object.assign(nextRASP,rasp,delta);
        if(nextRASP.decendantFocus) nextRASP.shape='view'; else nextRASP.shape='open';
        if(nextRASP.decendantFocus) nextRASP.pathSegment='d';
        else nextRASP.pathSegment=null;
        return nextRASP;
    }

    segmentToState(action,initialRASP){
        var nextRASP={shape: initialRASP.shape, pathSegment: action.segment}
        if(action.segment==='d') nextRASP.decendantFocus=true;
        if(nextRASP.decendantFocus) nextRASP.shape='view'; else nextRASP.shape='open';
        return {nextRASP, setBeforeWait: true}
    }

    componentDidMount(){
        console.info("CafeIdea.componentDidMount change shape to open");
        setTimeout(()=>this.props.rasp.toParent({type: "DECENDANT_FOCUS"}))  // after this commponent renders, change the shape to open causing the CHANGE_SHAPE event to tricle up
    }

    //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

    render() {

        const { user, rasp, panelNum, parent } = this.props;
        var results=null;

        const onServer = typeof window === 'undefined';

        var done=(
            <div className='instruction-text' key="done">
                {"Continute without contributing an additional idea. "}
                <Button small shy
                    onClick={()=>this.props.rasp.toParent({type: "NEXT_PANEL", status: "done", results: {}})}
                    className="cafe-idea-done"
                    style={{ backgroundColor: Color(this.QSortButtonList['unsorted'].color).negate(), color: this.QSortButtonList['unsorted'].color, float: "right" }}
                    >
                    <span className="civil-button-text">{"next"}</span>
                </Button>
            </div>
        );


        return (
            <section id="syn-cafe-idea">
                {done}
                <div className="syn-cafe-idea" key='idea'>
                    <Item min item={parent} user={user} rasp={this.childRASP('truncated','item')}/>
                    <div className="syn-cafe-idea-creator">
                        <ItemCreator type={this.props.type} parent={this.props.parent} rasp={this.childRASP('truncated','creator')}/>
                    </div>
                </div>
            </section>
        );
    }
}

export default CafeIdea;



