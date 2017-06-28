'use strict';

import React from 'react';
import Color from 'color';
import Item from './item';
import Creator            from './creator';
import {ReactActionStatePath, ReactActionStatePathClient} from 'react-action-state-path';

export default class ItemCreator extends React.Component {
    render(){
        console.info("ItemCreator", this.props);
        return (
            <ReactActionStatePath {...this.props}>
                <RASPItemCreator />
            </ReactActionStatePath>
        )
    }
}

class RASPItemCreator extends ReactActionStatePathClient {
    set = false; // not part of state because we don't want to rerender on seting this. And once set, it's never changed.
    item = {};  // a local copy of the item data, passed up by the child. No need for it to be part of state - it's only being changed by the child. but we keep a copy here so we don't rerender null

    constructor(props){
        console.info("ItemCreator.constructor", props);
        const {panel, toggle}=props;
        const initialRASP={display: (panel && panel.items && panel.items.length)};
        super(props, initialRASP);
        if(initialRASP.display){
            Object.assign(this.item,panel.items[0]);
            toggle('set', this.item._id); // passing the Id of the item created
        }
        Object.assign(this.item, this.props.item);
    }

    componentWillReceiveProps(newProps){
 //       console.info("QSortWhyCreate.constructor", newProps);
        this.setItemFromPanel(newProps);
        Object.assign(this.item, newProps.item);
    }
    
    setItemFromPanel(props){
        const {type, parent, panel, toggle, user, rasp } = props; // items is Object.assign'ed as a prop through PanelStore
        if(panel && panel.items && panel.items.length) {
            Object.assign(this.item,panel.items[0]);
            if(!rasp.display){ 
                setTimeout(()=>this.props.rasp.toParent({type: "SET_DISPLAY"}),0); // toggle the state of display
                toggle('set', this.item._id); // passing the Id of the item created
            }
        }
 //       console.info("QsortWhyCreate.setItemFromPanel:", this.item);
    }

    actionToState(action,rasp,source){
        var nextRASP={}, delta={};
        if (action==="SET_EDIT"){
            delta.display= null; // toggle display
        } else if (action==="SET_DISPLAY"){
            delta.display= true; // toggle display
        }
        let parts=[];
        if(delta.button) parts.push(delta.button[0]); // must ensure no collision of first character of item-component names
        if(delta.display) parts.push('D');
        delta.pathSegment=parts.join(',');
        Object.assign(nextRASP, rasp, delta);
        nextRASP=Object.assign({},rasp,delta);
        return nextRASP;
    }

    segmentToState(action){  //RASP is setting the initial path. Take your pathSegment and calculate the RASPState for it.  Also say if you should set the state before waiting the child or after waiting
        var nextRASP={shape: 'truncated', pathSegment: action.segment};
        let parts=action.segment.split(',');
        let button=null;
        let matched=0;
        parts.forEach(part=>{
            if (part==='D'){
                nextRASP.display=true;
                matched+=1;
            }
        });
        if(!matched || matched<parts.length) logger.error("RASPItemCreator SET_PATH didn't match all pathSegments", {matched}, {parts}, {action}); 
        return {nextRASP, setBeforeWait: false};  //setBeforeWait means set the new state and then wait for the key child to appear, otherwise wait for the key child to appear and then set the new state.
    }
    
    onChange(val){  // Creator (the child) passes back the data as it is entered. We store it in this.item in case we are asked to rerender
        if(val.results) Object.assign(this.item,val.results.item);
    }

    post(){  // in the creator, user hit the post button
        this.props.rasp.toParent({type: "TOGGLE_EDIT"});
        if(!this.rasp.display && this.props.toggle) this.props.toggle();  // toggle the item if it hasns't already been toggled
    }

    render(){
        var defaultColor = '#fff'
//        console.info("QSortWhyCreate", this.item);
        const { panel, toggle, user, rasp } = this.props; // items is Object.assign'ed as a prop through PanelStore

        const type= this.props.type || panel.type || null;
        const parent= this.props.parent || panel.parent || null;

        return(
            <div style={{ backgroundColor: rasp.display ? this.props.color || defaultColor : defaultColor,
                          marginBottom: '0.5em'}} >
                <div style={{display: rasp.display ? 'none' : 'block'}}>
                    <Creator
                        type={type}
                        parent={parent}
                        item={this.item}
                        toggle={this.post.bind(this)}
                        toParent={this.onChange.bind(this)}
                    />
                </div>
                <div style={{display: rasp.display ? 'block' : 'none'}}>
                    <Item
                        item={this.item}
                        user={user}
                        rasp= {{shape: 'truncated', depth: rasp.depth, toParent: this.toMeFromChild.bind(this,'Item')}}
                        min={true}
                        buttons={["Edit"]}
                    />
                </div>
            </div>
        );
    }
}
