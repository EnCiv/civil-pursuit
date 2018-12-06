'use strict';

import React from 'react';
import Panel from '../panel';
import config from 'syn/../../public.json';
import TypeComponent from '../type-component';
import Instruction from '../instruction';
import ProfileComponent from '../profile-components/component';
import Row from '../util/row';
import Column from '../util/column';
import DoneItem from '../done-item';
import LoginSpan from '../login-span';
import setUserInfo                  from '../../api-wrapper/set-user-info';

class ProfilePanel extends React.Component {

    state = {
        typeList: [],
        ready: false,
        userInfo: {},
        done: false,
        userId: ''
    }

    constructor(props) {
        super(props);

        if (typeof window !== 'undefined' && this.props.user) {
            window.socket.emit('get user info', this.okGetUserInfo.bind(this));
        }
        if (typeof window !== 'undefined' && this.props.panel.type.harmony)
            window.socket.emit('get listo type', this.props.panel.type.harmony, this.okGetListoType.bind(this));

        this.state.userId = this.props.user ? this.props.user._id || this.props.user : '';
    }

    componentWillReceiveProps(newProps) {
        if (!newProps.user) return;
        var userId;
        if (newProps.user._id) userId = newProps.user._id;
        else userId = newProps.user;
        if (this.state.userId != userId) this.setState({ userId: userId });
    }

    setUserInfo(info){
        this.setState({userInfo: Object.assign({},this.state.userInfo, info) });
        setUserInfo.call(this, info);
    }

    okGetUserInfo(userInfo) {
        this.setState({ ready: true, userInfo: Object.assign({}, userInfo, this.state.userInfo) });
    }

    okGetListoType(typeList) {
        this.setState({ typeList: typeList });
    }

    neededInputAtStart = false;

    render() {
        const { panel, active } = this.props;
        const { userId, userInfo } = this.state;
        var doneActive = false;
        var profiles = ['Gender', 'Birthdate.Birthdate..dob', 'Neighborhood', 'MemberType'];

        if (panel.parent && panel.parent.profiles && panel.parent.profiles.length) profiles = panel.parent.profiles;

        var properties = ProfileComponent.properties(profiles);

        //onsole.info("ProfilePanel profiles and properties:", this.props, profiles, properties);

        if ((this.props.user && this.state.ready) || this.neededInputAtStart) // if there is a users and the user info in ready or if input is going to be needed
        {
            if (properties.every(prop => userInfo[prop])) { // have all the property values been filled out?? 
                if (!this.neededInputAtStart || this.state.done) { // if the required data is initally there, then move forward, otherwise move forward when the user to hits done
                    if (userId && this.props.newLocation) {
                        window.onbeforeunload = null; // don't warn on redirect
                        location.href = this.props.newLocation;
                        return null;
                    }
                    if (userId && panel.parent && panel.parent.new_location) {
                        window.onbeforeunload = null; // don't warn on redirect
                        location.href = panel.parent.new_location;
                        return null;
                    }
                    if (!this.state.typeList.length) return (null);  // if we haven't received typeList yet, come back later - there will be another event when it comes in
                    const index = userId ? 1 : 0;  // if user defined skip the first entry which is usually LoginPanel
                    const newPanel = {
                        parent: panel.parent,
                        type: this.state.typeList[index],
                        skip: panel.skip || 0,
                        limit: panel.limit || config['navigator batch size'],
                    };
                    return (
                        <TypeComponent  {...this.props} userInfo={userInfo} component={this.state.typeList[index].component} panel={newPanel} />
                    )
                } else { // if all the data is there
                    doneActive = true;
                }
            }
        } else if (this.props.user) // there is user data to wait for
            return null; // wait for it

        // else there is no user, so go ahead and render the input panel
        this.neededInputAtStart = true; // user will have to fill in some data, so after she does - don't immediately jump to the next panel, offer the done button and wait for it

        let title = panel.type.name || "Participant Profile";
        let instruction = (<div className="instruction-text" key='instruction'>This discussion requsts that all users provide some profile details.</div>);

        if (panel.type && panel.type.instruction) {
            instruction = (
                <Instruction key='instruction'>
                    {panel.type.instruction}
                </Instruction>
            );
        }


        let content = [];

        if (this.state.ready || !userId) { // if user then wait for the user info, otherwise display
            content = [
                <div className='item-profile-panel' style={{ maxWidth: "30em", margin: "auto", padding: "1em 0" }} key='content'>
                    <LoginSpan />
                    {profiles.map(component => {
                        var title = ProfileComponent.title(component);
                        return (
                            <SelectorRow name={title} key={title} >
                                <ProfileComponent block medium component={component} info={userInfo} onChange={this.setUserInfo.bind(this)} />
                            </SelectorRow>
                        );
                    })
                    }
                </div>
            ];
        }
        return (
            <Panel
                ref="panel"
                heading={[<h4 key='panel-title'>{title}</h4>]}
            >
                {instruction}
                {content}
                <DoneItem message="Complete!" active={doneActive} onClick={this.setState.bind(this, { done: true }, null)} key="done"/>
            </Panel>
        );
    }
}

class SelectorRow extends React.Component {
    render() {
        return (
            <div className='item-profile-panel' style={{ maxWidth: "30em", margin: "auto", padding: "1em 0"}}>
                <Row baseline style={{padding: "1em 0"}}>
                    <Column span="25">
                        {this.props.name}
                    </Column>
                    <Column span="75">
                        {this.props.children}
                    </Column>
                </Row>
            </div>
        );
    }
}

export default ProfilePanel;
