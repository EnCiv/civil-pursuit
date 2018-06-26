'use strict';

import React from 'react';
import ButtonGroup from '../util/button-group';
import Button from '../util/button';
import createItem from '../../api-wrapper/create-item';

exports.button = class PostButton extends React.Component {

    onClick() {
        createItem(this.props.item);
        this.props.rasp.toParent({type: "POST_ITEM", item: this.props.item});
        if(this.props.onClick) this.props.onClick();
    };

    render() {
        const { active, item, onClick, rasp } = this.props;
        var success = false;
        var title = null;

        if (rasp.button !== 'Post') {
            success = true;
            title = "click to post this";
        } else {
            success = false;
            title = "click to edit this";
        }
        return (
            <ButtonGroup>
                <span className="civil-button-info">{""}</span>
                <Button
                    small
                    shy
                    success={success}
                    onClick={this.onClick.bind(this)}
                    title={title}
                    className="post-button"
                >
                    <span className="civil-button-text">{rasp.button === 'Post' ? 'Edit' : 'Post'}</span>
                </Button>
            </ButtonGroup>
        );
    }
}

