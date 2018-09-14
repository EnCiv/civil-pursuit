'use strict';

import React from 'react';
import {ReactActionStatePath, ReactActionStatePathClient} from 'react-action-state-path';
import PanelHead from '../panel-head';
import {CopyToClipboard} from 'react-copy-to-clipboard';

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

    componentDidMount(){
        if(!this.props.user.assignmentId)
            return this.setState({validationError: "no assignmentId"});
        else
            window.socket.emit("set turk complete", this.props.user.assignmentId, (comment)=>{
                if(comment.error) return this.setState({validationError: comment.error});
                else return this.setState({successMessage: comment.comment});
            })
    }

    //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

    render() {

        return (
            <section id="syn-turk-step">
                {this.state.successMessage ? <div>
                    <span>Mechanical Turk Survey Code:</span>
                    <span>{this.state.successMessage}</span>
                    <CopyToClipboard text={this.state.successMessage} onCopy={()=>this.setState({copied: true})}>
                        <button style={{padding: ".1em", marginLeft: ".5em", marginRight: ".5em", backgroundColor: "white" }}>Copy to clipboard</button>
                    </CopyToClipboard>
                    {this.state.copied ? <span style={{color: 'red'}}>Copied.</span> : null}
                </div>: null}
                {this.state.validationError ? <div>
                    <p>There was an problem, here is the message from the server. If you believe you have not been duly credited for this task, go back to the Mechanical Turk page and click on Hit Details and then Contact the This Requester</p>
                    {this.state.validationError}
                </div>: null}
            </section>
        );
    }
}

export default TurkSubmit;


