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
        super(props, 'itemId');
        console.info("CafeIdea constructor");
    }

    //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~  

    actionToState(action, rasp, source){
        return null;
    }

    //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

    render() {

        const { user, rasp, shared, next, panelNum, parent } = this.props;
        const items=shared.items;
        var results=null;

        const onServer = typeof window === 'undefined';

        return (
            <section id="syn-cafe-idea">
                <Item item={parent} user={user} rasp={this.childRASP('truncated','item')}/>
                <ItemCreator type={this.props.type} parent={this.props.parent} rasp={this.childRASP('truncated','creator')}/>
            </section>
        );
    }
}

export default CafeIdea;



