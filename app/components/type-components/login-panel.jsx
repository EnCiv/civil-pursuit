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
        super(props);
        this.state={}; // required if using getDerivedStateFromProps
        this.componentWillMount(); // defined in RASPClient but won't be called because of getDerivedDerivedState from props - need to set the action filters before getDerived... is called
    }

    actionFilters={
        REDIRECT: (action, delta)=>{
            delta.redirect=true;
            return true; // to propagate
        }
    }

    deriveRASP(nextRASP, initialRASP){
        if(nextRASP.redirect) nextRASP.shape='redirect';
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
                <TypeComponent  { ...this.props } rasp={this.childRASP('open','redirect')} component={this.props.harmony[0].component} panel={newPanel} {...newPanel} key='type-component' />
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
