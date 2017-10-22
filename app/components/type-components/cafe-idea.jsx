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
    }

    //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~  

    actionToState(action, rasp, source,initialRASP){
        var nextRASP={}, delta={};
        if(action.type==="POST_ITEM"){
            setTimeout(()=>this.props.rasp.toParent({ type: "NEXT_PANEL", results: {idea: action.item, parent: this.props.parent, type: this.props.type}}))
            // no state change, the action will be consumed here
        }else
            return null;
        Object.assign(nextRASP,rasp,delta);
        return nextRASP;
    }

    componentDidMount(){
        console.info("CafeIdea.componentDidMount change shape to open");
        this.toMeFromChild('creator',{type: "CHANGE_SHAPE", shape: 'open'})  // after this commponent renders, change the shape to open causing the CHANGE_SHAPE event to tricle up
    }

    //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

    render() {

        const { user, rasp, panelNum, parent } = this.props;
        var results=null;

        const onServer = typeof window === 'undefined';

        return (
            <section id="syn-cafe-idea">
                <div>
                    <div>{parent.subject}></div>
                    <ItemCreator type={this.props.type} parent={this.props.parent} rasp={this.childRASP('truncated','creator')}/>
                </div>
            </section>
        );
    }
}

export default CafeIdea;



