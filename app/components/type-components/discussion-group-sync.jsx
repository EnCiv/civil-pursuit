'use strict';

import React from 'react';
import {ReactActionStatePath, ReactActionStatePathClient} from 'react-action-state-path';
import PanelHeading from '../panel-heading';
import {clientSubscribePvoteInfo} from '../../api/subscribe-pvote-info';
import insertPvote from '../../api-wrapper/insert-pvote'
import ObjectID from 'bson-objectid'
import TimeFormat from 'hh-mm-ss'

export default class DiscussionGroupSync extends React.Component {
    render(){
        return ( // items needs to be 'true' in PanelHeading or it will wait
            <ReactActionStatePath {...this.props} cssName={'syn-group-sync'} >
                <PanelHeading  items={[]} panelButtons={['Instruction']} >
                    <RASPDiscussionGroupSync/>
                </PanelHeading>
            </ReactActionStatePath>
        )
    }
}

class RASPDiscussionGroupSync extends ReactActionStatePathClient {

    constructor(props) {
        super(props, 'itemId', 0);
        this.state={timeToGo: this.props.discussionGroupStageTime, membersToGo: this.props.discussionGroup && this.props.discussionGroup.size, startTime: Date.now()}
        if(this.props.discussionGroup && this.props.discussionGroup.nextStage)
            this.stage=this.props.discussionGroup.nextStage++;
        else {
            this.stage=0;
            if(this.props.discussionGroup)
                this.props.discussionGroup.nextStage=1;
        }
        this.createDefaults();
    }

    actionFilters={
        NEXT_PANEL: (action, delta)=>{
            delta.done=true;
            return true; // let this action propagate further
        },
        FOCUS: (action, delta)=>{
            if(this.props.rasp.done)
                this.queueAction({type: "NEXT_PANEL", status: "done", duration: 1}) // duration must extend to the parent of this component (the PANEL_LIST)
        }
    }

    nextPanel() {
        if(this.updateTimeout) {clearTimeout(this.updateTimeout); this.updateTimeout=0}; // make sure the times is stopped - to prevent double nextPanels
        if(this._unsubscribe) this._unsubscribe();  // after we are done with this panel, there is no need to process more updates from discussionGroupSync subscription
        this.setState({membersToGo:0, timeToGo: 0});
        this.queueAction({type: "NEXT_PANEL", status: "done", duration: 1}) // duration must extend to the parent of this component (the PANEL_LIST)
    }

    componentWillUnmount(){
        if(this.updateTimeout) clearTimeout(this.updateTimeout);
        if(this._unsubscribe) this._unsubscribe();  // after we are done with this panel, there is no need to process more updates from discussionGroupSync subscription
    }

    async componentDidMount(){
        const {discussionGroup}=this.props;
        if(this.props.rasp.done) return; // if done, no updates.
        if(discussionGroup && discussionGroup.id){
            clientSubscribePvoteInfo.call(this,discussionGroup.id, PvoteInfo=>{ // this is the subscription for PvoteInfo updates
                if(this.props.rasp.done) return; // if done, no updates. -- check again inside the subscriptions-  things change
                if(PvoteInfo){
                    var membersToGo=discussionGroup.size;
                    let info;
                    for(info in PvoteInfo){
                        let vote=info.split('-');
                        if(!vote.length || (vote.length==3 && vote[1]<this.stage)) continue; // some users are not at this stage 
                        else if(   ((vote.length==2 && vote[1]>this.stage) || (vote.length==3 && vote[1]>=this.stage))   // some users have passed this stage
                                || (vote.length==2 && vote[1]==this.stage)  // some users are at this stage but not passed, careful vote[1] is a string and stage is a number
                        )
                            membersToGo=membersToGo-PvoteInfo[info].count;
                    }
                    if(membersToGo<=0){
                        if(this.state.membersToGo>0){ // prevent a race/overload by making sure we haven't already been through here
                            this.nextPanel()
                            insertPvote({ _id: ObjectID().toString(), item: discussionGroup.id, criteria: 'discussionGroupStage-'+this.stage+'-done' }); // finished this stage
                        }
                    }else
                        this.setState({membersToGo});
                } else {
                    logger.error("RASPDiscussionGroupSync subscribe failed");
                }
            }, info=>{  // this is the call back, on success will get the user's last vote on the item
                if(this.props.rasp.done) return; // if done, no updates. -- check again in the call back, things can change
                if(!info) logger.info("DiscussionGroupSync clientSubscribePvoteInfo failed"); // it failed
                let vote=info.userInfo.criteria && info.userInfo.criteria.split('-') || [];  // if criteria is null, no vote found
                if(!vote.length || (vote.length==3 && vote[1]<this.stage)){ // first time at this stage
                    var firstId=ObjectID()
                    insertPvote({ _id: firstId.toString(), item: discussionGroup.id, criteria: 'discussionGroupStage-'+this.stage });
                    this.setState({startTime: firstId.getTimestamp()})
                } else if((vote.length==2 && vote[1]>this.stage) || (vote.length==3 && vote[1]>=this.stage)){  // user has passed by here before.  careful vote[1] is a string and stage is a number
                    this.nextPanel()
                }else if(vote.length==2 && vote[1]==this.stage){ // user has been here before, but not passed, careful vote[1] is a string and stage is a number
                    this.setState({startTime: ObjectID(info.userInfo.lastId).getTimestamp()})
                } else
                    logger.info("DiscussionGroupSync.componentDidMount criteria of userInfo, format unexpected", info);
            })
            this.updateTimeToGo();
        } else {
            throw "DiscussionGroupSync: discussion Group _id missing";
        }
    }

    updateTimeToGo(){
        if(this.props.rasp.done) return;
        const {discussionGroupStageTime}=this.props;
        const timeToGo=Math.max(discussionGroupStageTime - (Date.now() - this.state.startTime),0);
        if(timeToGo<=0){
            this.nextPanel()
            insertPvote({ _id: ObjectID().toString(), item: this.props.discussionGroup.id, criteria: 'discussionGroupStage-'+this.stage+'-done' }); // finished this stage
        }else{
            this.setState({timeToGo})
            this.updateTimeout=setTimeout(()=>this.updateTimeToGo(),1000);
        }
    }

    componentWillReceiveProps(newProps){
        if(newProps.rasp.done) {
            this.queueAction({type: "RESULTS", status: 'done'});
        } else {
            this.queueAction({type: "ISSUES"});
        }
    }

    render() {
        return (
            <div className="syn-discussion-group-sync">
                <div style={{display: 'table', verticalAlign: 'middle', minHeight: '10vh', width: "100%", fontSize: '2rem', lineHeight: '200%'}}>
                    <div style={{display: 'table-row', textAlign: 'center'}}>{`Discussion Group Sync Point: ${this.props.discussionGroup.size} members`}</div>
                    <div style={{display: 'table-row'}}>
                        <div style={{display: 'table-cell', textAlign: 'center'}} >
                            <div><label>Members Awaiting to Proceed: </label>{`${this.state.membersToGo}`}</div>
                            <div style={{fontSize: "50%", lineHeight: "100%"}}>or</div>
                            <div><label>Max Wait to Proceed: </label>{TimeFormat.fromS(Math.round(this.state.timeToGo/1000),"mm:ss")}</div>
                        </div>
                    </div>
                    <div style={{display: 'table-row'}}> </div>
                </div>
            </div>
        );
    }
}

export const attributes={
    PanelList: {notInCrumbs: true}
}




