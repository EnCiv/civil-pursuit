'use strict';

import React from 'react';
import Panel from './panel';
import config from 'syn/../../public.json';
import TypeComponent from './type-component';
import Instruction from './instruction';
import Gender from './gender';
import Birthdate from './birthdate';
import MemberType from './member-type';
import Neighborhood from './neighborhood';
import Button           from './util/button';

class ProfilePanel extends React.Component {

    state = {
        typeList: [],
        ready: false,
        userInfo: null,
        done: false
    }

    firstPass=true;

    constructor(props) {
        super(props);
        if(typeof window !== 'undefined' && this.props.user) {
            window.socket.emit('get user info', this.okGetUserInfo.bind(this));
        }
        if (typeof window !== 'undefined' && this.props.panel.type.harmony) 
            window.socket.emit('get listo type', this.props.panel.type.harmony, this.okGetListoType.bind(this));
    }


    setUserInfo(info){
        console.info("profile-panel set user info", info); 
        this.setState({userInfo: Object.assign({},this.state.userInfo, info) });
    }

    okGetUserInfo(userInfo) {
        this.setState({ ready: true, userInfo });
    }

    okGetListoType(typeList) {
        this.setState({ typeList: typeList });
    }

    render() {
        const { panel, user, active } = this.props;
        const {userInfo} = this.state;
        var done=[];
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
                <TypeComponent  { ...this.props } component={this.state.typeList[0].component} panel={newPanel} />
            )
        }

        if ((this.state.ready && userInfo.gender && userInfo.dob && userInfo.neighborhood && userInfo.member_type)) {
            if(this.firstPass  || this.state.done){ // if the required data is initally there, then move forward, otherwise move forward when the user to hits done
                if (!this.state.typeList.length) return (null);  // if we haven't received typeList yet, come back later - there will be another event when it comes in
                const newPanel = {
                    parent: panel.parent,
                    type: this.state.typeList[1],
                    skip: panel.skip || 0,
                    limit: panel.limit || config['navigator batch size'],
                };
                return (
                    <TypeComponent  { ...this.props } component={this.state.typeList[1].component} panel={newPanel} />
                )
            }else if(!this.firstPass){ // if all the data is there, and this is not the first pass put up the done button
                done=[
                    <div className='instruction-text'>
                        Complete!
                        <Button small shy
                            onClick={this.setState.bind(this,{done: true})}
                            className="profile-panel-done"
                            style={{ backgroundColor: 'black', color: 'white', float: "right" }}
                            >
                            <span className="civil-button-text">{"next"}</span>
                        </Button>
                    </div>
                ];
            } 
        } else if (this.state.ready) this.firstPass=false;  // if the user info has been received but the profile data wasn't there the first pass is over

        let title = panel.type.name || "Participant Profile";
        let instruction = (<div className="instruction-text">This discussion requsts that all users provide some profile details.</div>);

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
                <div className='item-profile-panel' style={{maxWidth: "30em", margin: "auto", padding: "1em"}}>
                    <Gender split={25} user={userInfo} emitter={this.setUserInfo.bind(this)}/>
                    <Birthdate split={25} user={userInfo} emitter={this.setUserInfo.bind(this)}/>
                    <Neighborhood split={25} user={userInfo} emitter={this.setUserInfo.bind(this)} />
                    <MemberType split={25} user={userInfo} emitter={this.setUserInfo.bind(this)}/>
                </div>
            ];
        }
        return (
            <Panel
                ref="panel"
                heading={[<h4>{title}</h4>]}
            >
                {instruction}
                {done}
                {content}
            </Panel>
        );
    }

}

export default ProfilePanel;
