'use strict';

import React from 'react';
import Loading from './util/loading';
import Panel from './panel';
import Instruction from './instruction';

class PanelHead extends React.Component {

    toChild=[];

    toMeFromChild(key, action) {
        logger.trace(" PanelHead.toMeFromChild", this.props.rasp.depth, key, action);
        if (key !== 0) console.error("PanelHead.toMeFromChild got call from unexpected child:", key, action);
        if (action.type === "SET_TO_CHILD") { // child is passing up her func
            if(Object.keys(this.toChild).length) {
                 this.toChild[key] = action.function;
                 return null;
            } else { // this is the first so notify parent
                this.toChild[key] = action.function;
                return this.props.rasp.toParent({ type: "SET_TO_CHILD", function: this.toMeFromParent.bind(this), name: this.constructor.name });  // notify parent of your existence after child existence known
            }
        } else {
            if (action.type === "CHILD_SHAPE_CHANGED") {
                if (this.instruction) this.instruction.hide();
            }
        }
        return this.props.rasp.toParent(action);
    }

    toMeFromParent(action) {
        console.info("PanelHead.toMeFromParent", this.props.rasp.depth, action);
        if (action.type === "CLEAR_PATH") {  // clear the path and reset the RASP state back to what the const
            if (this.instruction) this.instruction.show();
        }
        if (this.toChild[0]) return this.toChild[0](action);
        else {
            console.error("PanelHead.toMeFromParent no toChild 0 yet!");
            return null;
        }
    }

    renderChildren() {
        let { shape, depth } = this.props.rasp;
        if (this.props.children && this.props.children.length && this.props.children.length !== 1) console.error("PanelHead expected 1 child received:", this.props.children.length);
        return React.Children.map(this.props.children, (child, i) => {
            var newProps = Object.assign({}, this.props, { rasp: { shape, depth, toParent: this.toMeFromChild.bind(this, i) } });
            delete newProps.children;
            return React.cloneElement(child, newProps, child.props.children)
        });
    }

    render() {
        console.info("RASPPanelHead.render", this.props);
        const { panel, cssName } = this.props;
        var title, name, instruction = [];
        if (panel) {
            if (panel.type) {
                name = cssName + '--' + (panel.type._id || panel.type);
                title = panel.type.name;
            } else {
                name = cssName + '-no-type';
                title = 'untitled';
            }
            if (panel.parent) {
                name += `-${panel.parent._id || panel.parent}`;
            }
            if (panel.type && panel.type.instruction) {
                instruction = (
                    <Instruction ref={(comp) => { this.instruction = comp }} >
                        {panel.type.instruction}
                    </Instruction>
                );
            }

            return (
                <Panel
                    className={name}
                    heading={[(<h4>{title}</h4>)]}
                    style={{ backgroundColor: 'white' }}
                >
                    {instruction}
                    {this.renderChildren()}
                </Panel>
            )
        } else
            return null; //(<Loading message="Loading ..." />); // no panel yet
    }
}

export default PanelHead;
export { PanelHead };