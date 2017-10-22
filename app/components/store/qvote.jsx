'use strict';

import React from 'react';
import update from 'immutability-helper';
import { QSortToggle } from '../type-components/qsort-items';

class QVoteStore extends React.Component {

    state = {
        sections: { unsorted: [] },
        index: []
    };

    constructor(props) {
        super(props);
        if (this.props.panel && this.props.panel.items) {
            this.props.panel.items.map((item, i) => {
                this.state.index[item._id] = i;
                this.state.sections['unsorted'].push(item._id);
            });
        }
    }

    componentDidMount() {
        var idList = [];
        if (this.props.panel && this.props.panel.items) {
            this.props.panel.items.map(item => idList.push(item._id));
            window.socket.emit('get qvote info', idList, true, this.okGetQVoteInfo.bind(this));
        }
    }

    cloneSections(section) {
        // Deep copy arrays.
        var clone = {};
        Object.keys(section).forEach(button => {
            clone[button] = section[button].slice(0);
        });
        return clone;
    }

    componentWillReceiveProps(newProps) { //deleting items from sections that are nolonger in newProps is not a usecase
        let currentIndex = [];
        let unsortedLength = 0;
        var idList = [];
        var newObj = this.cloneSections(this.state.sections);
        if (newProps.panel && newProps.panel.items) {
            newProps.panel.items.forEach((newItem, i) => {
                if (!(newItem._id in this.state.index)) {
                    newObj['unsorted'].push(newItem._id);
                    idList.push(newItem._id);
                }
                currentIndex[newItem._id] = i;
                unsortedLength++;
            });
        }
        if (unsortedLength) {
            window.socket.emit('get qvote info', idList, true, this.okGetQVoteInfo.bind(this));
            var newIndex = Object.assign({}, currentIndex);
            this.setState({
                'sections': this.cloneSections(newObj),
                'index': newIndex
            });
        }
    }


    toggle(itemId, criteria) {
        //find the section that the itemId is in, take it out, and put it in the new section
        this.setState({ 'sections': QSortToggle(this.state.sections, itemId, criteria) });
    }


    okGetQVoteInfo(accumulation) {
        console.info("QVote got qvote info length", accumulation.length);
        if (accumulation) {
            var sections=this.cloneSections(this.state.sections);
            accumulation.forEach(qvote => {
                if (qvote.ownVote) {
                    sections=QSortToggle(sections, qvote.item, qvote.ownVote);
                }
            });
            this.setState({sections});
        }
    }

    renderChildren() {
        return React.Children.map(this.props.children, child => {
            var newProps = Object.assign({}, this.props, this.state, { toggle: this.toggle.bind(this) }, child.props);
            if(newProps.children) delete newProps.children;
            return React.cloneElement(child, newProps, child.props.children);
        });
    }

    render() {
        return (
            <section>{this.renderChildren()}</section>
        );
    }
}

export default QVoteStore;
