'use strict';

import React from 'react';
import { JoinForm } from './join';
import Panel from './panel';
import config from 'syn/../../public.json';
import TypeComponent from './type-component';
import Instruction from './instruction';
import Gender from './gender';
import Birthdate from './birthdate';
import MemberType from './member-type';
import Neighborhood from './neighborhood';

class ProfilePanel extends React.Component {

    state = {
        typeList: [],
        ready: false,
        userInfo: null
    }

    constructor(props) {
        super(props);
        window.socket.emit('get user info', this.okGetUserInfo.bind(this));
    }

    okGetUserInfo(userInfo) {
        this.setState({ ready: true, userInfo });
    }

    componentDidMount() {
        console.info("ProfilePanel.cDM", this.props)
        if (typeof window !== 'undefined' && this.props.panel.type.harmony) {
            window.socket.emit('get listo type', this.props.panel.type.harmony, this.okGetListoType.bind(this))
        }
    }

    okGetListoType(typeList) {
        this.setState({ typeList: typeList });
    }

    render() {
        const { panel, user, active } = this.props;
        const {userInfo}=this.state.userInfo;
        console.info("ProfilePanel:", this.props, this.state);

        if (!user) {
            if (!this.state.typeList.length) return (null);
            const newPanel = {
                parent: panel.parent,
                type: this.state.typeList[0],
                skip: panel.skip || 0,
                limit: panel.limit || config['navigator batch size'],
            };
            return (
                <TypeComponent  { ...this.props } component="LoginPanel" panel={newPanel} />
            )
        }

        if (this.state.ready && userInfo.genger && userInfo.dob && userInfo.neighborhood && userInfo.member_type) {
            if (!this.state.typeList.length) return (null);
            const newPanel = {
                parent: panel.parent,
                type: this.state.typeList[0],
                skip: panel.skip || 0,
                limit: panel.limit || config['navigator batch size'],
            };
            return (
                    <TypeComponent  { ...this.props } component={this.state.typeList[0].component} panel={newPanel} />
            )
        }


        let title = panel.type.name || "User Registration Required";
        let instruction = (<div className="instruction-text">This discussion requsts that all users be registered.</div>);

        if (panel.type && panel.type.instruction) {
            instruction = (
                <Instruction >
                    {panel.type.instruction}
                </Instruction>
            );
        }

        let content = [];
        if (this.state.ready) {
            content = [
                <div className='item-profile-panel style={{maxWidth: "150em", margin: "auto"}}'>
                    <Gender split={25} user={this.state.userInfo} />
                    <Birthdate split={25} user={this.state.userInfo} />
                    <Neighborhood split={25} user={this.state.userInfo} />
                    <MemberType split={25} user={this.state.userInfo} />
                </div>
            ];
        }
        return (
            <Panel
                ref="panel"
                heading={[<h4>{title}</h4>]}
            >
                {instruction}
                {content}
            </Panel>
        );
    }

}

export default ProfilePanel;
