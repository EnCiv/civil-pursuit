'use strict';

import React from 'react';
import Panel from '../panel';
import config from 'syn/../../public.json';
import TypeComponent from '../type-component';
import Instruction from '../instruction';
import Button           from '../util/button';
import ProfileComponent from '../profile-component';
import Row                            from '../util/row';
import Column                         from '../util/column';


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
        if(this.props.user){ // if the user already exists, update the info immediatly
            window.socket.emit('set user info', info);
        }
    }

    okGetUserInfo(userInfo) {
        this.setState({ ready: true, userInfo: Object.assign({}, userInfo, this.state.userInfo) });
    }

    okGetListoType(typeList) {
        this.setState({ typeList: typeList });
    }

    neededInputAtStart=false;

    render() {
        const { panel, active } = this.props;
        const {userId, userInfo} = this.state;
        var done=[];
        var profiles=['Gender', 'Birthdate.Birthdate..dob', 'Neighborhood','MemberType'];

        if(panel.parent && panel.parent.profiles && panel.parent.profiles.length) profiles=panel.parent.profiles;

        var properties=ProfileComponent.properties(profiles);

        console.info("ProfilePanel profiles and properties:", this.props, profiles, properties);

        if((this.props.user && this.state.ready) || this.neededInputAtStart) // if there is a users and the user info in ready or if input is going to be needed
        {
            if ( properties.every(prop => userInfo[prop] )) { // have all the property values been filled out?? 
                if(!this.neededInputAtStart  || this.state.done){ // if the required data is initally there, then move forward, otherwise move forward when the user to hits done
                    if(userId && this.props.newLocation){
                        window.onbeforeunload=null; // don't warn on redirect
                        location.href= this.props.newLocation;
                        return null;
                    }
                    if(userId && panel.parent && panel.parent.new_location){
                        window.onbeforeunload=null; // don't warn on redirect
                        location.href= panel.parent.new_location;
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
        } else if(this.props.user) // there is user data to wait for
            return null; // wait for it
        // else there is no user, so go ahead and render the input panel
        this.neededInputAtStart=true; // user will have to fill in some data, so after she does - don't immediately jump to the next panel, offer the done button and wait for it

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
            content = [
                <div className='item-profile-panel' style={{maxWidth: "30em", margin: "auto", padding: "1em"}}>
                    {   profiles.map(component=>{
                            var title=ProfileComponent.title(component);            
                            return(
                                <SelectorRow name={title} >
                                    <ProfileComponent block medium component={component} info={userInfo} onChange={this.setUserInfo.bind(this)}/>
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

class SelectorRow extends React.Component{
  render(){
    return(
        <div className='item-profile-panel' style={{maxWidth: "30em", margin: "auto", padding: "1em"}}>
            <Row baseline className="gutter">
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
