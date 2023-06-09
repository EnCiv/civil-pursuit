'use strict';

import React from 'react';
import ButtonGroup from '../util/button-group';
import Button from '../util/button';
import {editShapes} from '../item'

class PostButton extends React.Component {

    onClick() {
        this.props.rasp.toParent({type: "POST_ITEM"})
    };

    render() {
        const { active, item, onClick, rasp } = this.props;
        var success = false;
        var title = null;

        if (editShapes.includes(rasp.shape)) {
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
                    <span className="civil-button-text">{editShapes.includes(rasp.shape) ? 'Post' : 'edit'}</span>
                </Button>
            </ButtonGroup>
        );
    }
}
export {PostButton as button}