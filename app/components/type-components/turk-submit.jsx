'use strict';

import React from 'react';
import {ReactActionStatePath, ReactActionStatePathClient} from 'react-action-state-path';
import PanelHead from '../panel-head';
import MechanicalTurkTask from '../../lib/mechanical-turk-task';
import superagent from 'superagent';

class TurkSubmit extends React.Component {
    render(){
        return (
            <PanelHead {...this.props} cssName={'syn-turk-submit'} >
                <ReactActionStatePath>
                    <RASPTurkSubmit/>
                </ReactActionStatePath>
            </PanelHead>
        )
    }
}

class RASPTurkSubmit extends ReactActionStatePathClient {


    constructor(props) {
        super(props, 'itemId', 0);
        //onsole.info("RASPNextStep constructor");
        this.state={}
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

    turkSubmit(){
        window.socket.emit("set turk complete",(comment)=>{
            if(comment.error) return this.setState({validationError: comment.error});
            else return this.setState({successMessage: "Copy this sting and paste it into the result field of Amazon Mechanical Turk page: "+comment.comment});
        })
    }

    //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

    render() {

        const { user, rasp, panelNum, parent, 
        } = this.props;

        return (
            <section id="syn-turk-step">
                <div className="syn-next-step">
                            <button 
                                onClick={this.turkSubmit.bind(this)}
                                className="syn-next-step-button"
                                title={"click to submit the task on Mechanical Turk"}
                            >
                                <span>{"Submit as complete to Mechanical Turk"}</span>
                            </button>
                </div>
                {this.state.successMessage}
                {this.state.validationError}
            </section>
        );
    }
}

export default TurkSubmit;



