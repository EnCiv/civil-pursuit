'use strict';

import React from 'react';
import { JoinForm } from './join';
import Panel from './panel';
import config from 'syn/../../public.json';
import TypeComponent from './type-component';
import Instruction from './instruction';
import Gender from './gender';

class ProfilePanel extends React.Component {

  constructor (props) {
    super(props);

    this.state = { userInfo : null, ready : false };

    this.get();
  }

  get () {
    if ( typeof window !== 'undefined' ) {
      Promise
        .all([
          new Promise((ok, ko) => {
            window.socket.emit('get user info', ok);
          }),
        ])
        .then(
          results => {
            let [ userInfo ] = results;
            this.setState({ ready : true, userInfo });
          }
        );
    }
  }

    state = {
        typeList: [],
        ready: false,
        userInfo: null
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
        console.info("ProfilePanel:",this.props, this.state);

        if (!user) {
            if(!this.state.typeList.length) return(null);
            const newPanel = {
                parent: panel.parent,
                type: this.state.typeList[0],
                skip: panel.skip || 0,
                limit: panel.limit || config['navigator batch size'],
            };
            return (
                <TypeComponent  { ...this.props } component={LoginPanel} />
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

        return (
            <Panel
                ref="panel"
                heading={[<h4>{title}</h4>]}
                >
                {instruction}
                <div className='item-profile-panel'>
                    <Gender split={25} user={this.state.userInfo}/>
                </div>
            </Panel>
        );
    }
}

export default ProfilePanel;
