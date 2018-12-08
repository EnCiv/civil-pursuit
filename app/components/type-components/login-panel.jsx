'use strict';

import React from 'react';
import { JoinForm } from '../join';
import config from 'syn/../../public.json';
import TypeComponent from '../type-component';
import {ReactActionStatePath, ReactActionStatePathClient} from 'react-action-state-path'
import PanelHeading from '../panel-heading'

class LoginPanel extends React.Component {
    render() {
        return (
            <ReactActionStatePath {...this.props}>
                <PanelHeading items={[]} type={this.props.panel && this.props.panel.type || this.props.type} cssName={'syn-login-profile'} panelButtons={['Instruction']} >
                    <RASPLoginPanel />
                </PanelHeading>
            </ReactActionStatePath>
        );
    }
}

class RASPLoginPanel extends ReactActionStatePathClient {
    state = {
        typeList: []
    }
    constructor(props){
        super(props);
        this.processProps(props);
    }

    componentWillReceiveProps(newProps){
        this.processProps(newProps);
    }

    componentDidMount() {
        const {panel}=this.props;
        const type = panel && panel.type || this.props.type;
        if (typeof window !== 'undefined' && type.harmony) {
            window.socket.emit('get listo type', type.harmony, this.okGetListoType.bind(this))
        }
    }

    okGetListoType(typeList) {
        this.setState({ typeList: typeList });
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

    processProps(props){
        const { panel, user, rasp } = props;
        const parent = panel ? panel.parent : props.parent;
        this.newLocation=props.newLocation || null;
        if(!this.newLocation && parent && parent.new_location) this.newLocation=parent.new_location;  // get new Location out of the parent item if there is one
        if(user && this.newLocation){
                window.onbeforeunload=null; // don't warn on redirect
                location.href=this.newLocation;
        } else if (user) {
            if(this.state.typeList.length) 
                return rasp.toParent({type: 'REDIRECT'});
        }
    }


    render() {
        const { panel, userInfo, rasp } = this.props;

        if (rasp.redirect) {
            const newPanel = {
                parent: panel.parent,
                type: this.state.typeList[0],
                skip: panel.skip || 0,
                limit: panel.limit || config['navigator batch size'],
            };
            return (
                <TypeComponent  { ...this.props } rasp={this.childRASP('open','redirect')} component={this.state.typeList[0].component} panel={newPanel} key='type-component' />
            )
        } else {
            return (
                <div className='item-login-panel' key='join-form'>
                    <JoinForm userInfo={userInfo} newLocation={this.newLocation} />
                </div>
            )
        }
    }
}

export default LoginPanel;
