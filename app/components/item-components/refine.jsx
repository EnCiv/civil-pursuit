'use strict';

import React from 'react';
import ButtonGroup from '../util/button-group';
import Button from '../util/button';
import Icon from '../util/icon';
import Accordion          from 'react-proactive-accordion';
import EvaluationStore from '../store/evaluation';
import Promote from '../promote';
import ItemStore from '../store/item';
import Item from '../item';
import {ReactActionStatePath, ReactActionStatePathClient} from 'react-action-state-path';




exports.panel = class RefinePanel extends React.Component {
    initialRASP={chosen: 'promote'};
    render(){
        return (
        <ReactActionStatePath {...this.props} initialRASP={this.initialRASP}>
            <RASPRefinePanel />
        </ReactActionStatePath>
        );
    }
}

class RASPRefinePanel extends ReactActionStatePathClient {
    constructor(props){
        super(props,'chosen');
        this.createDefaults();
    }

    actionToState(action,rasp,source,initialRASP, delta) {
        var nextRASP={};
        if(action.type === "DESCENDANT_UNFOCUS"){
            delta.chosen='winner';
        } else if(action.type ==="ITEM_DELVE") {
            //action.type="ITEM_REFINE"; // changing the action so that <Item> does not process it, and passes it to <QSortRefine> 
            var nextAction=Object.assign({},action,{type: "ITEM_REFINE"}); // create a new action with all the parameters of the old action
            this.qaction(()=>this.props.rasp.toParent(nextAction));
        }else if(Object.keys(delta).length) {
            ; // no need to do anything, but do continue to calculate nextRASP
        } else
            return null;
        Object.assign(nextRASP,rasp,delta);
        return nextRASP;
        return this.props.rasp.toParent(action);
    }

    segmentToState(action,initialRASP){
        return initialRASP;
    }

    mounted={};

    render() {
        const { item, user, style, rasp, winner, whyItemId, type, unsortedColor='#fff' } = this.props;
        const active = !winner ? { item: whyItemId, section: 'promote' } : {};  // requried to convince EvaluationStore to be active   
        const panel = { type: type };
        //this.chosen= winner ? 'winner' : 'promote';
        return (
            <div className="toggler promote" key={item._id + '-toggler-' + this.constructor.name}>
                <Accordion active={rasp.chosen==='winner'}>
                    { this.mounted[winner] ? this.mounted[winner] : winner ? 
                        (this.mounted[winner]=
                         (<ItemStore item={winner} key={`item-${winner && winner._id || 'none'}`}>
                            <Item
                                item={winner}
                                user={user}
                                rasp={this.childRASP(rasp.shape, 'winner')}
                            />
                        </ItemStore>))
                        : null
                    }
                </Accordion>
                <Accordion active={rasp.chosen==='promote'} style={{ backgroundColor: unsortedColor }}>
                    <EvaluationStore
                        item-id={whyItemId}
                        active={active}
                    >
                        <Promote
                            ref="promote"
                            panel={panel}
                            user={user}
                            rasp={this.childRASP(rasp.shape, 'promote')}
                            hideFeedback={true}
                            hideFinish={true}
                        />
                    </EvaluationStore>
                </Accordion>
            </div>
        )
    }
}