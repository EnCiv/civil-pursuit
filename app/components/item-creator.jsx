'use strict';

import React from 'react';
import Color from 'color';
import Item from './item';
import Creator            from './creator';
import {ReactActionStatePath, ReactActionStatePathClient} from 'react-action-state-path';

export default class ItemCreator extends React.Component {
    render(){
        const {item=null}=this.props;
        const initialRASP={display: item!==null && Object.keys(item).length>0}; // if there is a populated item, then start in display mode
        console.info("ItemCreator", this.props);
        return (
            <ReactActionStatePath {...this.props} initialRASP={initialRASP}>
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
        const {toggle, item}=props;
        super(props);
        if(props.rasp.display){  // this is could be set by initialRASP above
            Object.assign(this.item,item);
            toggle('set', this.item._id); // passing the Id of the item created
        }
        Object.assign(this.item, this.props.item);
    }

    componentWillReceiveProps(newProps){
 //       console.info("QSortWhyCreate.constructor", newProps);
        if(this.item && newProps.item && this.item._id !== newProps.item._id) {
            this.props.toggle('set', newProps.item._id); // passing the Id of the item created
            this.props.rasp.toParent({type: "SET_DISPLAY"})
        }
        if(this.props.item != newProps.item) // don't overwrite this.item unless there really is a change
            Object.assign(this.item, newProps.item);
    }
    
    actionToState(action,rasp,source){
        console.info("ItemCreator.actionToState",action,rasp,source);
        const {type}=action;
        var nextRASP={}, delta={};
        if (type==="SET_EDIT"){
            delta.display= false; // toggle display
        } else if (type==="SET_DISPLAY"){
            delta.display= true; // toggle display
        }
        let parts=[];
        if(delta.display) parts.push('D');
        delta.pathSegment=parts.join(',');
        Object.assign(nextRASP, rasp, delta);
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
        this.props.rasp.toParent({type: "SET_DISPLAY"});
        //if(!this.props.rasp.display && this.props.toggle) this.props.toggle();  // toggle the item if it hasns't already been toggled
    }

    render(){
        var defaultColor = '#fff'
        console.info("ItemCreator.render", this.props);
        const { panel, toggle, user, rasp } = this.props; // items is Object.assign'ed as a prop through PanelStore

        const type= this.props.type || panel.type || null;
        const parent= this.props.parent || panel.parent || null;

        var item=this.item;

        return(
            <div style={{marginBottom: '0.5em'}} >
                <div style={{display: rasp.display ? 'none' : 'block', backgroundColor: defaultColor}}>
                    <Creator
                        type={type}
                        parent={parent}
                        item={item}
                        toggle={this.post.bind(this)}
                        toParent={this.onChange.bind(this)}
                    />
                </div>
                <div style={{display: rasp.display ? 'block' : 'none'}}>
                    {!item===null || !Object.keys(item).length ? null :
                        <Item
                            {...this.props}
                            item={item}
                            rasp= {{shape: 'truncated', depth: rasp.depth, toParent: this.toMeFromChild.bind(this,'Item')}}
                            min={true}
                            buttons={["Edit"]}
                        />
                    }
                </div>
            </div>
        );
    }
}
