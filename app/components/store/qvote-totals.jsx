'use strict';

import React from 'react';
import QSortButtonList from '../qsort-button-list';

class QVoteTotals extends React.Component {

    state = { finale: [] };

    constructor(props) {
        super(props);
        if (this.props.shared.items) {
            this.props.shared.items.map((item, i) => {
                let obj = { item: item._id, index: i };
                Object.keys(this.props.shared.sections).forEach(sectionName => { obj[sectionName] = 0 });
                this.state.finale.push(obj)
            });
        }
    }


    componentDidMount() {
        if (this.props.shared && this.props.shared.items) {
            var idList = [];
            this.props.shared.items.map(item => idList.push(item._id));
            window.socket.emit('get qvote info', idList, false, this.okGetQVoteInfo.bind(this));
        }
    }

    componentWillReceiveProps(newProps) { //just read in the new props and through out the old ones and fetch new votes
        //onsole.info("qvote-totals: newProps");
        var newFinale = [];
        var idList = [];
        if (newProps.shared && newProps.shared.items) {
            newProps.shared.items.map((item, i) => {
                let obj = { item: item._id, index: i };
                Object.keys(newProps.shared.sections).forEach(sectionName => { obj[sectionName] = 0 });
                newFinale.push(obj);
                idList.push(item._id);
            });
            window.socket.emit('get qvote info', idList, false, this.okGetQVoteInfo.bind(this));
            this.setState({ finale: newFinale });
        }
    }

    okGetQVoteInfo(accumulation) {
        var qbuttons=this.props.qbuttons || QSortButtonList;
        var sortButtons=Object.keys(qbuttons).splice(0,1); // the first element is unsorted - remove that
        var newFinale = this.state.finale.slice(0);
        //onsole.info("QVoteTotal got qvote info length,accumulation.length");
        if (accumulation.length) {
            accumulation.forEach(qvote => {
                newFinale.some((qobj, i) => {
                    if (qobj.item === qvote.item) {
                        Object.assign(newFinale[i], qvote.results);
                        return true;
                    } else
                        return false;
                })
            })
            newFinale.sort((a, b) => { 
                let r; 
                for(let p of sortButtons) {
                    if((r=(b[p]-a[p]))!==0) 
                    return r;
                } 
                return 0;
            })
            this.setState({ finale: newFinale });
        }
    }

    render() {
        const { children, ...childProps } = this.props;
        Object.assign(childProps, this.state);
        return (
            <section>
                {React.Children.map(React.Children.only(children), child => React.cloneElement(child, childProps, child.props.children))}
            </section>
        );
    }
}

export default QVoteTotals;
