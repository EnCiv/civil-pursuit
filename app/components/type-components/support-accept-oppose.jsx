'use strict';

import React from 'react';
import {RASPQSortItemsSummary} from './qsort-items-summary'
import Button from '../util/button'
import insertPvote from '../../api-wrapper/insert-pvote'
import { ReactActionStatePath, ReactActionStatePathClient } from 'react-action-state-path';
import ItemsQVoteSortStore from '../store/items-qvote-sort'
import PropTypes from 'prop-types'

export default class SupportAcceptOppose extends React.Component {
    static propTypes={
        choices: PropTypes.object.isRequired,
        description: PropTypes.string.isRequired,
        evaluateQuestion: PropTypes.string.isRequired,
        qbuttons: PropTypes.object,
        parent: PropTypes.object.isRequierd,
        type: PropTypes.object.isRequired
    }
    render(){
        var sort={};
        const qbuttons=this.props.qbuttons;
        Object.keys(qbuttons).slice(1).forEach(key=>(sort[key]=-1)); // of the key names in the list, except the first one, sort with the larger of the first key first, then the largest of the second key, ... 
        const type=this.props.shared.type; //ItemsQVoteSortStore searches of items with the parent corresponding to the question, and type corresponding to the type of answers
        return (
            <ReactActionStatePath {...this.props} sort={sort} limit={1} fixed={true} type={type} >
                <ItemsQVoteSortStore>
                    <RASPSupportAcceptOppose />
                </ItemsQVoteSortStore>
            </ReactActionStatePath>
        );
    }
}

function RASPSupportAcceptOppose (props) {  // This is not a RASPClient - because there is one RASPClient which is a child of this component
    function onClick(criteria, e) {
        if(props.items.length===1) {
            insertPvote({item: props.items[0]._id, criteria});
            props.rasp.toParent({type: "NEXT_PANEL", status: "done"})
        }
    }
    const {choices, description, evaluateQuestion } = props;

    function choice(button){
        return (
            <Button small shy onClick={onClick.bind({},button.criteria)} title={button.title} className="harmony-button" key={button.criteria}>
                <span className="civil-button-text">{button.name}</span>
            </Button>
        );
    }

    return (
        <div className="SupportAcceptOppose" style={{border: "1px solid #666", padding: "0.5em"}}>
            <h1>{description}</h1>
            <div style={{padding: "1em"}}>
                <RASPQSortItemsSummary {...props} />
            </div>
            <h1>{evaluateQuestion}</h1>
            <div style={{textAlign: 'center'}}>
                <span >
                    { choices.map((button) => choice(button)) }
                </span>
            </div>
        </div>
    )
}

