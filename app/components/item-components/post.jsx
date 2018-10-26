'use strict';

import React from 'react';
import ButtonGroup from '../util/button-group';
import Button from '../util/button';
import createItem from '../../api-wrapper/create-item';
import updateItem from '../../api-wrapper/update-item';

exports.button = class PostButton extends React.Component {

    doThisAsParent(){
        const itemValid=()=>{
            let item=this.props.item;
            var errors={};
            if(!item.subject) errors.subject="Subject is required";
            if(!item.description) errors.description="Description is required";
            if(Object.keys(errors).length){
                this.queueAction({type: "POST_ERROR", errors})
                return false;
            } else
                return true;
        }

        const rasp=this.props.rasp;
        if(rasp.shape==='edit' && !rasp.button) { // first time through
            if(itemValid()) {
                createItem.call(this, this.props.item,(item)=>{
                    if (ReactActionStatePath.thiss.findIndex(it=>it && it.client===this) <0) {
                        logger.error("Post.doThiAsParent after createItem item is not mounted", this);
                        return;
                    }
                    if(item)
                        this.queueAction({type: "POST_ITEM", item: item});
                    else {
                        logger.error("error creating item on server:", this.props.item);
                        this.queueAction({type: "POST_ITEM", item: this.props.item})
                    }
                });
            }
        }else if(rasp.shape==='edit'){
            if(itemValid()){
                updateItem.call(this, this.props.item,(item)=>item || logger.error("error updating item on server:", this.props.item))
                this.queueAction({type: "POST_ITEM", item: this.props.item});
            }
        } else 
            this.queueAction({type: "EDIT_ITEM"})
    }

    onClick() {
        this.props.onClick(this.doThisAsParent)

    };

    render() {
        const { active, item, onClick, rasp } = this.props;
        var success = false;
        var title = null;

        if (rasp.shape === 'edit') {
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
                    <span className="civil-button-text">{rasp.shape === 'edit' ? 'Post' : 'edit'}</span>
                </Button>
            </ButtonGroup>
        );
    }
}

