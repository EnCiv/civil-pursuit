'use strict';

import React from 'react';
import publicConfig from '../../../public.json';


export default class ItemsQVoteSortStore extends React.Component {

    id;

    state = { items: [], total: null };

    //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

    componentDidMount() {
        this.fetchData(this.props);
    }

    componentWillReceiveProps(newProps){
        this.fetchData(newProps)
    }

    fetchData(props){
        const { parent, type, sort, skip=0, limit=publicConfig.dbDefaults.limit } = props;
        window.socket.emit('get items qvote sort', parent._id, type._id, sort, skip, limit, this.okGotData.bind(this))
    }
    //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

    okGotData(items, total) {
        this.setState({ items, total })
    }

    //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

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

