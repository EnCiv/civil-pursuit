'use strict';

import React from 'react';
import { JoinForm } from '../join';
import Panel from '../panel';
import config from 'syn/../../public.json';
import TypeComponent from '../type-component';
import Instruction from '../instruction';

class LoginPanel extends React.Component {

    state = {
        typeList: []
    }

    componentDidMount() {
    //    console.info("LoginPanel.cDM", this.props)
        if (typeof window !== 'undefined' && this.props.panel.type.harmony) {
            window.socket.emit('get listo type', this.props.panel.type.harmony, this.okGetListoType.bind(this))
        }
    }
    okGetListoType(typeList) {
        this.setState({ typeList: typeList });
    }

    vsChange(obj){
        if(this.props.vs & this.props.vs.toParent) this.props.vs.toParent(obj);  // let parent know the user has logged in
    }

    render() {
        const { panel, user, userInfo, active } = this.props;
        //onsole.info("LoginPanel:",this.props, this.state);
        var newLocation=this.props.newLocation || null;
        if(!newLocation && panel.parent && panel.parent.new_location) newLocation=panel.parent.new_location;  // get new Location out of the parent item if there is one
        if(user && newLocation){
                window.onbeforeunload=null; // don't warn on redirect
                location.href=newLocation;
                return null;
        }

        //if(!newLocation && this.state.typeList.length) newLocation="/items/"+this.state.typeList[0].id+"/"+panel.parent.id;  //new location calculated from next type
        //console.info("Login-Panel newlocation", newLocation);

        if (user) {

            if(!this.state.typeList.length) return(null);
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

        return (
            <Panel
                ref="panel"
                heading={[<h4>{title}</h4>]}
                >
                {instruction}
                <div className='item-login-panel'>
                    <JoinForm userInfo={userInfo} newLocation={newLocation} />
                </div>
            </Panel>
        );
    }
}

export default LoginPanel;
