'use strict';

import React from 'react';
import Panel from './panel';
import config from 'syn/../../public.json';
import TypeComponent from './type-component';
import Instruction from './instruction';
import Button           from './util/button';
import ProfileComponent from './profile-component';

class ProfilePanel extends React.Component {

    state = {
        typeList: [],
        ready: false,
        userInfo: {},
        done: false,
        vs: {},
        userId: ''
    }
    
    constructor(props) {
        super(props);

        this.state.vs=Object.assign({}, 
            {   state: 'truncated',
            }, 
            this.props.vs,
            {   depth: (this.props.vs && this.props.vs.depth) ? this.props.vs.depth : 0,
                toParent: this.toMeFromChild.bind(this)
            }
        );
        this.toChild=null;

        if(typeof window !== 'undefined' && this.props.user) {
            window.socket.emit('get user info', this.okGetUserInfo.bind(this));
        }
        if (typeof window !== 'undefined' && this.props.panel.type.harmony) 
            window.socket.emit('get listo type', this.props.panel.type.harmony, this.okGetListoType.bind(this));

        this.state.userId=this.props.user ? this.props.user._id || this.props.user : '' ;
    }

    componentWillReceiveProps(newProps){
        if(!newProps.user) return;
        var userId;
        if(newProps.user._id) userId = newProps.user._id;
        else userId=newProps.user;
        if(this.state.userId != userId) this.setState({userId: userId});
    }

    componenetDidMount(){
        if(this.props.vs.toParent) this.props.toParent({toChild: toMeFromParent.bind(this)});
    }

    toMeFromChild(vs){
        if(!vs) return;
        if (vs.toChild) this.toChild = vs.toChild;  // child is passing up her func
        if (vs.userId) { // child is passing up a new userId (LoginPanel)
            if(typeof window !== 'undefined') {
                if(this.state.userInfo){
                    var newInfo=Object.assign({},this.state.userInfo);
                    window.socket.emit('set user info', { newInfo }, this.okGetUserInfo.bind(this));  // apply the new info to the user
                } else 
                    window.socket.emit('get user info', this.okGetUserInfo.bind(this));  // userId got set but there's no new info
            } this.setState({userId: vs.userId});
        }
    }

    toMeFromParent(vs) {
//        console.info("VisualState.toMeFromParent");
        if (vs) { // parent is giving you a new state
            if(this.state.vs.state !== vs.state)
            this.setState({vs: Object.assign({}, this.state.vs, vs)});
        }
    }

    setUserInfo(info){
        this.setState({userInfo: Object.assign({},this.state.userInfo, info) });
    }

    okGetUserInfo(userInfo) {
        this.setState({ ready: true, userInfo: Object.assign({}, userInfo, this.state.userInfo) });
    }

    okGetListoType(typeList) {
        this.setState({ typeList: typeList });
    }

    render() {
        const { panel, active } = this.props;
        const {userId, userInfo} = this.state;
        var done=[];

        if ((userInfo.dob && userInfo.neighborhood && userInfo.member_type)) {
            if(userId || this.state.done){ // if the required data is initally there, then move forward, otherwise move forward when the user to hits done
                if (!this.state.typeList.length) return (null);  // if we haven't received typeList yet, come back later - there will be another event when it comes in
                const index = userId ? 1 : 0;  // if user defined skip the first entry which is usually LoginPanel
                const newPanel = {
                    parent: panel.parent,
                    type: this.state.typeList[index],
                    skip: panel.skip || 0,
                    limit: panel.limit || config['navigator batch size'],
                };
                return (
                    <TypeComponent  { ...this.props } userInfo={userInfo} component={this.state.typeList[index].component} panel={newPanel} vs={this.state.vs} />
                )
            }else { // if all the data is there
                done=[
                    <div className='instruction-text'>
                        Complete!
                        <Button small shy
                            onClick={this.setState.bind(this,{done: true},null)} // null is needed here so setState doesn't complain about the mouse event that's the next parameter
                            className="profile-panel-done"
                            style={{ backgroundColor: 'black', color: 'white', float: "right" }}
                            >
                            <span className="civil-button-text">{"next"}</span>
                        </Button>
                    </div>
                ];
            } 
        }

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

        if (this.state.ready || !userId) { // if user then wait for the user info, otherwise display
            var profiles=['Gender', 'Birthdate', 'Neighborhood','MemberType'];
            if(panel.parent && panel.parent.profiles && panel.parent.profiles.length) profiles=panel.parent.profiles;
            console.info("ProfilePanel",this.props, profiles);
            content = [
                <div className='item-profile-panel' style={{maxWidth: "30em", margin: "auto", padding: "1em"}}>
                    {   profiles.map(component=>{
                            return(<ProfileComponent component={component} split={25} user={userInfo} emitter={this.setUserInfo.bind(this)}/>);
                        }) 
                    }
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
