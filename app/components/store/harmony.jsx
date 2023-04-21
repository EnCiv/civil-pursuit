'use strict';

import React from 'react';

export default class HarmonyStore extends React.Component {
    constructor(props){
        super(props);
        this.state={}
        if(this.props.type && this.props.type.harmony && this.props.type.harmony.length){
            if (typeof window !== 'undefined') {
                window.socket.emit('get listo type', this.props.type.harmony, this.okGetListoType.bind(this))
            }
        }
    }
    componentWillReceiveProps(newProps){
        if(newProps.type && newProps.type.harmony && (!this.props.type || !this.props.type.harmony || (newProps.type.harmony!==this.props.type.harmony))){
            if(newProps.harmony && newProps.harmony.length){
                window.socket.emit('get listo type', this.props.type.harmony, this.okGetListoType.bind(this))
            }
        }
    }
    okGetListoType(harmony) {
        this.setState({ harmony });
    }
    render(){
        const {children, ...lessProps}=this.props;
        if(!this.state.harmony)
            return null;
        else 
            return React.Children.map(React.Children.only(children), child=>React.cloneElement(child, Object.assign({},lessProps,this.state), child.props.children))[0];
    }
}