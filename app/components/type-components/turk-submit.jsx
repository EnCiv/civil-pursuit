'use strict';

import React from 'react';
import {ReactActionStatePath, ReactActionStatePathClient} from 'react-action-state-path';
import PanelHeading from '../panel-heading';
import {CopyToClipboard} from 'react-copy-to-clipboard';

class TurkSubmit extends React.Component {
    render(){
        return (
            <ReactActionStatePath {...this.props} >
                <PanelHeading items={[]} cssName={'syn-turk-submit'} >
                    <RASPTurkSubmit/>
                </PanelHeading>
            </ReactActionStatePath>
        )
    }
}

class RASPTurkSubmit extends ReactActionStatePathClient {


    constructor(props) {
        super(props, 'itemId', 0);
        this.state={}
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
                {this.state.successMessage ? <div style={{padding: "0 1em 1em 1em"}}>
                    <span>Mechanical Turk Survey Code:</span>
                    <span>{this.state.successMessage}</span>
                    <CopyToClipboard text={this.state.successMessage} onCopy={()=>this.setState({copied: true})}>
                        <button style={{padding: ".1em", marginLeft: ".5em", marginRight: ".5em", backgroundColor: "white" }}>Copy to clipboard</button>
                    </CopyToClipboard>
                    {this.state.copied ? <span style={{color: 'red'}}>Copied.</span> : null}
                    </div>: 
                    <div style={{padding: "0 1em 1em 1em"}}>
                        <span>No Assignment</span>
                    </div>}
                {this.state.validationError ? <div style={{padding: "0 1em 1em 1em"}}>
                    <p>There was an problem, here is the message from the server. If you believe you have not been duly credited for this task, go back to the Mechanical Turk page and click on Hit Details and then Contact the This Requester</p>
                    {this.state.validationError}
                </div>: null}
            </section>
        );
    }
}

export default TurkSubmit;


