'use strict';

import React from 'react';
import Panel from '../panel';
import config from 'syn/../../public.json';
import TypeComponent from '../type-component';
import Instruction from '../instruction';

class ProfileCheck extends React.Component {

    state = {
        typeList: [],
        ready: false,
        userInfo: {},
    }

    constructor(props) {
        super(props);

        if (typeof window !== 'undefined' && this.props.user) {
            window.socket.emit('get user info', this.okGetUserInfo.bind(this));
        }
        if (typeof window !== 'undefined' && this.props.panel.type.harmony)
            window.socket.emit('get listo type', this.props.panel.type.harmony, this.okGetListoType.bind(this));

    }

    okGetUserInfo(userInfo) {
        this.setState({ ready: this.state.typeList.length > 0, userInfo: Object.assign({}, userInfo, this.state.userInfo) });
    }

    okGetListoType(typeList) {
        this.setState({ ready: typeof this.state.userInfo._id !== 'undefined', typeList: typeList });
    }

    render() {
        const { panel, type } = this.props;
        const { userInfo } = this.state;
        const { buttons } = panel.type || type || {buttons: { zip: ["90274"] }};

        //onsole.info("ProfileCheck", this.props);

        if (this.state.ready) { // if there is a users and the user info in ready or if input is going to be needed
            if (buttons && buttons.zip && buttons.zip.some(zip => (zip == (userInfo.street_address && userInfo.street_address.zip))) && userInfo.street_address.validatedAt) { // we have a match
                const newPanel = {
                    parent: panel.parent,
                    type: this.state.typeList[0],
                    skip: panel.skip || 0,
                    limit: panel.limit || config['navigator batch size'],
                };
                return (
                    <TypeComponent  { ...this.props } component={this.state.typeList[0].component} panel={newPanel} />
                )
            } else { //no match
                setTimeout(() => {
                    window.onbeforeunload = null; // don't warn on redirect
                    window.location.href = '/'
                }, 10000);

                let title = panel.type.name || "Thank You!";
                let instruction = (<div className="instruction-text">Thanks for signing up! You will be notified when there is a deliberative survey taking place in your area.</div>);

                if (panel.type && panel.type.instruction) {
                    instruction = (
                        <Instruction >
                            {panel.type.instruction}
                        </Instruction>
                    );
                }

                return (
                    <Panel
                        ref="panel"
                        heading={[<h4>{title}</h4>]}
                    >
                        {instruction}
                    </Panel>
                );
            }
        }else 
            return null;
    }
}

export default ProfileCheck;
