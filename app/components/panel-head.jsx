'use strict';

import React from 'react';
import Loading from './util/loading';
import Panel from './panel';
import Instruction from './instruction';
import Creator from './creator';
import Accordion          from 'react-proactive-accordion';
import Icon from './util/icon';

class PanelHead extends React.Component {
    toChild=[];
    debug=0;

    toMeFromChild(key, action) {
        if(this.debug) console.info("PanelHead.toMeFromChild", this.props.rasp.depth, this.childName, key, action);
        if (key !== 0) console.error("PanelHead.toMeFromChild got call from unexpected child:", this.childName, key, action);
        if (action.type === "SET_TO_CHILD") { // child is passing up her func
            if(Object.keys(this.toChild).length) {
                 this.toChild[key] = action.function;
                 return null;
            } else { // this is the first so notify parent
                this.toChild[key] = action.function;
                if(action.name) this.childName=action.name;
                action.function=this.toMeFromParent.bind(this);
                action.name= this.constructor.name+'->'+action.name;
                this.debug=action.debug;
                if(this.debug) console.info("PanelHead.toMeFromChild debug on", this.props.rasp.depth, this.childName, key, action);
                return this.props.rasp.toParent(action);  // notify parent of your existence after child existence known
            }
        } else if(this.actionFilter){
            if (this.actionFilter(action, "CHILD"))
                return this.props.rasp.toParent(action);
            else
                return null
        }
        return this.props.rasp.toParent(action);
    }

    toMeFromParent(action) {
        if(this.debug) console.info("PanelHead.toMeFromParent", this.props.rasp.depth, action);
        if(this.actionFilter){
            if(!this.actionFilter(action, "PARENT"))
                return null;
        } 
        if (this.toChild[0]) return this.toChild[0](action);
        else console.error("PanelHead.toMeFromParent no toChild 0 yet!");   
    }

    actionFilter(action, source) {
        if(this.debug) console.info("PanelHead.actionFilter", this.props.rasp.depth, action, source);
        if (action.type === "CLEAR_PATH" && source==='PARENT') {  // clear the path and reset the RASP state back to what the const
            if (this.instruction) this.instruction.show();
            return true; // pass it on
        } else if (action.type === "CHILD_SHAPE_CHANGED" && source==='CHILD') {
            if (this.instruction) this.instruction.hide();
            return true; // pass it on
        } else return true;
    }

    renderChildren(moreProps) {
        if (this.props.children && this.props.children.length && this.props.children.length !== 1) console.error("PanelHead expected 1 child received:", this.props.children.length);
        return React.Children.map(this.props.children, (child, i) => {
            var rasp=Object.assign({}, this.props.rasp, {toParent: this.toMeFromChild.bind(this, i)})
            var {children, ...newProps} = this.props;
            Object.assign(newProps, moreProps, {rasp} );
            return React.cloneElement(child, newProps, child.props.children)
        });
    }

    render() {
        if(this.degug) console.info("RASPPanelHead.render", this.childName, this.props);
        const { panel, cssName, rasp, user, createMethod } = this.props;
        var title, name, instruction = [], content=[], creator=[];
        // decompose panel into it's props if applicable
        const type= (typeof this.props.type === 'object' && this.props.type) || panel && panel.type || this.props.type || null;
        const parent=this.props.parent || panel && panel.parent || null;
        const limit=this.props.limit || panel && panel.limit || 10;
        const items=this.props.items || panel && panel.items || [];
        const skip=this.props.skip || panel && panel.skip || 0;
        const bgc="white";
        let createValue= createMethod || (type && type.createMethod) || 'visible'; // passed in by props overrides what's in type
        createValue= (type && type.createMethod && (type.createMethod[type.createMethod.length-1]==='!') && type.createMethod.substring(0,type.createMethod.length-1)) || createValue;  // unless what's in type ends in !


        if (type) {
            name = cssName + '--' + (type._id || type);
            title = type.name;

            if (parent) {
                name += `-${parent._id || parent}`;
            }
            if (rasp.shape==='truncated' && type.instruction) {
                instruction = (
                    <Instruction ref={(comp) => { this.instruction = comp }} >
                        {type.instruction}
                    </Instruction>
                );
            }
            creator = (
                <Accordion
                    active={(rasp && rasp.creator)}
                    style={{ backgroundColor: bgc }}
                >
                    <Creator
                        type={type}
                        parent={parent}
                        toggle={()=>rasp.toParent({ type: "TOGGLE_CREATOR" })}
                    />
                </Accordion>
            );            
            if (!items.length && !(createValue==='hidden')) {
                content.push(
                <div className={`syn-panel-gutter text-center vs-${rasp.shape}`}>
                    <a href="#" onClick={()=>rasp.toParent({ type: "TOGGLE_CREATOR" })} className="click-to-create">
                    Click the + to be the first to add something here
                    </a>
                </div>
                );
            }
            content.push(this.renderChildren({type, parent, items, limit, skip}));
            return (
                <Panel
                    className={name+' vs-'+rasp.shape}
                    heading={[
                        (<h4 onClick={()=>rasp.toParent({type: rasp.focus ? "UNFOCUS" : "FOCUS"})}
                            key="title">{title}</h4>), 
                        ((createValue==='hidden') && !(user && user.id && parent && parent.user && parent.user._id && (user.id == parent.user._id))) ? (null) :
                            (
                            <Icon
                                icon="plus"
                                className="toggle-creator"
                                onClick={()=>rasp.toParent({type: "TOGGLE_CREATOR"})}
                                key="plus"
                            />
                            )
                        ]}
                    style={{ backgroundColor: 'white' }}
                    rasp={rasp}
                    key={name}
                >
                    {instruction}
                    {creator}
                    {content}
                </Panel>
            )
        } else
            return null; //(<Loading message="Loading ..." />); // no panel yet
    }
}

export default PanelHead;
export { PanelHead };