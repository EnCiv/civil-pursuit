'use strict';

import React from 'react';
import PropTypes from 'prop-types'

export default class Store extends React.Component {
    static propTypes={
        fetch: PropTypes.func.isRequired,
    }
    constructor(props){
        super(props);
        this.state=this.props.fetch.initial && this.props.fetch.initial.call(this, props) || {};
    }
    componentDidMount() {
        this.props.fetch.componentDidMount && this.props.fetch.componentDidMount.call(this, this.props)
    }
    componentWillReceiveProps(newProps){
        this.props.fetch.componentWillReceiveProps && this.props.fetch.componentWillReceiveProps.call(this,newProps)
    }
    render() {
        const { children, ...lessProps } = this.props;
        return (
            React.Children.map(React.Children.only(children), child => {
                var newProps = Object.assign({}, lessProps, this.state);
                Object.keys(child.props).forEach(prop => delete newProps[prop]);
                return React.cloneElement(child, newProps, child.props.children)
            })[0]
        );
    }
}

