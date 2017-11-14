'use strict';

import React from 'react';
import update from 'immutability-helper';
import merge from 'lodash/merge';
import { QSortToggle } from '../type-components/qsort-items';

class QVoteLocal extends React.Component {

    state = { sections: { unsorted: [] } };

    constructor(props) {
        super(props);
        //onsole.info("QVoteLocal constructor");
        if (this.props.shared && this.props.shared.sections && this.props.shared.index) {
            Object.keys(this.props.shared.sections).forEach(section => this.state.sections[section] = []);
            Object.keys(this.props.shared.index).map(itemId => this.state.sections['unsorted'].push(itemId));
            this.state.index = merge({}, this.props.shared.index)
        }
    }

    componentWillReceiveProps(newProps) { //deleting items from sections that are nolonger in newProps is not a usecase
        //onsole.info("QVoteLocal");
        let currentIndex = [];
        let unsortedLength = 0;
        var newObj = merge({}, this.state.sections);
        if (newProps.shared && newProps.shared.sections && newProps.shared.index) {
            Object.keys(newProps.shared.index).forEach((newItemId, i) => {
                if (!(newItemId in this.state.index)) {
                    newObj['unsorted'].push(newItemId);
                }
                currentIndex[newItemId] = i;
                unsortedLength++;
            });
        }
        if (unsortedLength) {
            var newIndex = merge({}, currentIndex);
            this.setState({
                'sections': merge({}, newObj),
                'index': newIndex
            });
        }
    }


    toggle(itemId, criteria) {
        //find the section that the itemId is in, take it out, and put it in the new section
        this.setState({ 'sections': QSortToggle(this.state.sections, itemId, criteria) });
    }

    renderChildren() {
        return React.Children.map(this.props.children, child => {
            var {children, ...newProps}=this.props; // discard children
            Object.assign(newProps, this.state, { toggle: this.toggle.bind(this) });
            return React.cloneElement(child, newProps, child.props.children)
        });
    }

    render() {
        //onsole.info("QVoteLocal");
        return (
            <section>{this.renderChildren()}</section>
        );
    }
}

export default QVoteLocal;
