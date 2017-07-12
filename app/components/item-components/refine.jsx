'use strict';

import React from 'react';
import ButtonGroup from '../util/button-group';
import Button from '../util/button';
import Icon from '../util/icon';
import Accordion from '../util/accordion';
import EvaluationStore from '../store/evaluation';
import Promote from '../promote';
import ItemStore from '../store/item';
import Item from '../item';


exports.panel = class RefinePanel extends React.Component {

    constructor(props) {
        super(props);
        this.toChild = [];
        this.chosen='promote';
        if (!this.props.rasp) logger.error("RefinePanel no rasp", this.constructor.name, this.props);
        if (this.props.rasp.toParent) {
            this.props.rasp.toParent({ type: "SET_TO_CHILD", function: this.toMeFromParent.bind(this), name: this.constructor.name })
        } else logger.error("RefinePanelt no rasp.toParent", this.props);
    }

    toMeFromChild(key, action) {
        logger.trace("RefinePanel.toMeFromChild", this.props.rasp.depth, key, action);
        if (key !== 0) console.error("RefinePanel.toMeFromChild got call from unexpected child:", key);
        if (action.type === "SET_TO_CHILD") { // child is passing up her func
            this.toChild[key] = action.function;
            return;
        } else if(action.type ==="SHOW_ITEM") {
            this.chosen='winner';
        } else if(action.type ==="ITEM_DELVE") {
            this.chosen='winner';
        } else 
            return this.props.rasp.toParent(action);
    }

    toMeFromParent(action) {
        console.info("RefinePanel.toMeFromParent", this.props.rasp.depth, action);
        if (action.type === "CLEAR_PATH") {  // clear the path and reset the RASP state back to what the const
            this.chosen='promote';
        }
        if(this.toChild[this.chosen]) return this.toChild[this.chosen](action);
        else return null;
    }

    mounted = false;
    render() {
        const { item, user, style, emitter, rasp, winner, whyItemId, type, unsortedColor='#fff' } = this.props;
        const active = !winner ? { item: whyItemId, section: 'promote' } : {};  // requried to convince EvaluationStore to be active   
        const panel = { type: type };
        //this.chosen= winner ? 'winner' : 'promote';
        return (
            <div className="toggler promote" key={item._id + '-toggler-' + this.constructor.name}>
                <div style={{ display: winner ? 'block' : 'none' }}>
                    <ItemStore item={winner} key={`item-${winner._id}`}>
                        <Item
                            item={winner}
                            user={user}
                            rasp={{ depth: rasp.depth, shape: rasp.shape, toParent: this.toMeFromChild.bind(this, 'winner') }}
                        />
                    </ItemStore>
                </div>
                <div style={{ display: rasp.display ? 'none' : 'block', backgroundColor: unsortedColor }}>
                    <EvaluationStore
                        item-id={whyItemId}
                        active={active}
                        emitter={emitter}
                    >
                        <Promote
                            ref="promote"
                            panel={panel}
                            user={user}
                            rasp={{ depth: rasp.depth, shape: rasp.shape, toParent: this.toMeFromChild.bind(this, 'promote') }}
                            hideFeedback={true}
                        />
                    </EvaluationStore>
                </div>
            </div>
        )
    }
}