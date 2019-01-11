'use strict';

import React from 'react';
import {ReactActionStatePath, ReactActionStatePathClient} from 'react-action-state-path';
import PanelHeading from '../panel-heading';
import subscribePvoteInfo from '../../api-wrapper/subscribe-pvote-info';

export default class DiscussionSync extends React.Component {
    render(){
        return (
            <PanelHeading {...this.props} cssName={'syn-next-step'} >
                <ReactActionStatePath>
                    <RASPNextStep/>
                </ReactActionStatePath>
            </PanelHeading>
        )
    }
}

class RASPDiscussionSync extends ReactActionStatePathClient {

    constructor(props) {
        super(props, 'itemId', 0);
    }

    componentDidMount(){
        if(this.props.PanelListDiscussionId){
            subscribePvoteInfo(this.props.PanelListDiscussionId, PvoteInfo=>{
                this.setState(PvoteInfo)
            })
        }
    }
    //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~  

    actionToState(action, rasp, source,initialRASP, delta){
        var nextRASP={};
        if(action.type==="POST_ITEM"){
            setTimeout(()=>this.props.rasp.toParent({ type: "NEXT_PANEL", results: {idea: action.item, parent: this.props.parent, type: this.props.type}}))
            // no state change, the action will be consumed here
        } else if (action.type === "DESCENDANT_FOCUS"){
            if(this.props.item && this.props.item.type && this.props.item.type.visualMethod && (this.props.item.type.visualMethod==='ooview')){
              if(action.distance>1) {
                delta.decendantFocus=true;
              }
            }
          } else if (action.type === "DESCENDANT_UNFOCUS" && action.distance===1){
            if(rasp.decendantFocus) delta.decendantFocus=false;  // my child has unfocused
          } else if (action.type === "TOGGLE_FOCUS") {
            this.queueUnfocus(action);
          } else if(Object.keys(delta).length) {
            ; // no need to do anything, but do continue to calculate nextRASP
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

    //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

    render() {

        const { user, rasp, panelNum, parent, 
                nextList=[
                    {   action: { type: "UNFOCUS_STATE", distance: (4- rasp.depth)},
                        title: "Move on to the next question",
                        name: "Continue to the next Question"
                    },
                    {   action: {type: "RESET_TO_BUTTON", nextPanel: 1},
                        title: "Provide another answer for this question",
                        name: "Contribute an Idea"
                    },
                    {   action: {type: "RESET_TO_BUTTON", nextPanel: 0},
                        title:  "Sort through more of the ideas that people have written",
                        name: "Sort More Ideas"
                    }
                ]
        } = this.props;

        return (
            <section id="syn-next-step">
                <div className="syn-next-step">
                    {   nextList.map(nextButton=>(
                            <button 
                                onClick={()=>rasp.toParent(nextButton.action)} 
                                className="syn-next-step-button"
                                title={nextButton.title}
                                key={nextButton.name}
                            >
                                <span>{nextButton.name}</span>
                            </button>
                    ))}
                </div>
            </section>
        );
    }
}





