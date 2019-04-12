'use strict';

import React from 'react';
import { JoinForm } from '../join';
import config from 'syn/../../public.json';
import TypeComponent from '../type-component';
import {ReactActionStatePath, ReactActionStatePathClient} from 'react-action-state-path'
import PanelHeading from '../panel-heading'
import HarmonyStore from '../store/harmony'

class LoginPanel extends React.Component {
    render() {
        return (
            <ReactActionStatePath {...this.props}>
                <PanelHeading items={[]} type={this.props.panel && this.props.panel.type || this.props.type} cssName={'syn-login-profile'} panelButtons={['Instruction']} >
                    <HarmonyStore>
                        <RASPLoginPanel />
                    </HarmonyStore>
                </PanelHeading>
            </ReactActionStatePath>
        );
    }
}

function calcNewLocation(props){
    return props.newLocation || (props.panel && props.panel.parent && props.panel.parent.new_location) || (props.parent && props.parent.new_location) || null;
}

class RASPLoginPanel extends ReactActionStatePathClient {
    constructor(props){
        super(props,'redirect');
        this.state={}; // required if using getDerivedStateFromProps
        this.componentWillMount(); // defined in RASPClient but won't be called because of getDerivedDerivedState from props - need to set the action filters before getDerived... is called
    }

    actionFilters={
        REDIRECT: (action, delta)=>{
            delta.redirect=true;
            action.distance-=1; // make this invisible
            return true; // to propagate
        }
    }

    segmentToState(action, initialRASP) {
        var nextRASP = {}, delta={};
        if(action.segment==='r') delta.redirect=true;
        else console.error("LoginPanel received unexpected segment:",action.segment);
        Object.assign(nextRASP,initialRASP,delta);
        this.deriveRASP(nextRASP, initialRASP);
        if (nextRASP.pathSegment !== action.segment) console.error("profile-panel.segmentToAction calculated path did not match", action.pathSegment, nextRASP.pathSegment)
        return { nextRASP, setBeforeWait: true }  // set nextRASP as state before waiting for child
    }

    deriveRASP(nextRASP, initialRASP){
        if(nextRASP.redirect) nextRASP.shape='redirect';
        if(nextRASP.redirect) nextRASP.pathSegment='r';
    }

    static getDerivedStateFromProps(props,state){
        const { user, rasp, harmony } = props;
        const newLocation=calcNewLocation(props);
        if(user && newLocation){
                window.onbeforeunload=null; // don't warn on redirect
                location.href=newLocation;
        } else if (user) {
            if(harmony.length) 
                rasp.toParent({type: 'REDIRECT'});
        }
        return null; // no change in state
    }

    render() {
        const { panel, userInfo, rasp } = this.props;
        const newLocation=calcNewLocation(this.props);

        if (rasp.redirect) {
            const newPanel = {
                parent: panel.parent,
                type: this.props.harmony[0],
                skip: panel.skip || 0,
                limit: panel.limit || config['navigator batch size'],
            };
            return (
                <TypeComponent  { ...this.props } rasp={this.childRASP('open',true)} component={this.props.harmony[0].component} panel={newPanel} {...newPanel} key='type-component' />
            )
        } else {
            return (
                <div className='item-login-panel' key='join-form'>
                    <JoinForm userInfo={userInfo} newLocation={newLocation} />
                </div>
            )
        }
    }
}

export default LoginPanel;
