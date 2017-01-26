'use strict';

import React from 'react';
import { JoinForm } from './join';
import Panel from './panel';
import config from 'syn/../../public.json';
import TypeComponent from './type-component';

class LoginPanel extends React.Component {

    state = {
        typeList: []
    }

    componentDidMount() {
        console.info("LoginPanel.cDM", this.props)
        if (typeof window !== 'undefined' && this.props.panel.type.harmony) {
            window.socket.emit('get listo type', this.props.panel.type.harmony, this.okGetListoType.bind(this))
        }
    }
    okGetListoType(typeList) {
        this.setState({ typeList: typeList });
    }

    render() {
        const { panel, user, active } = this.props;
        console.info("LoginPanel:",this.props, this.state);

        if (user) {
            if(!this.state.typeList) return(null);
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
        let instruction = panel.type.instruction || "This discussion requsts that all users be registered.";

        return (
            <Panel
                ref="panel"
                heading={[<h4>{title}</h4>]}
                >
                <span>{instruction}</span>
                <JoinForm />
            </Panel>
        );
    }
}

export default LoginPanel;
