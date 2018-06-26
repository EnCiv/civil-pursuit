'use strict';

import React from 'react';
import ClassNames from 'classnames';
import TextArea from './util/text-area';


class ItemDescription extends React.Component {
    constructor(props) {
        super(props);
        this.inputElement = React.createRef();
        this.onChangeKey = this.onChangeKey.bind(this);
        this.delayedUpdate=this.delayedUpdate.bind(this);
        this.state = { subject: this.props.description && this.props.item.description || '' };
    }
    componentWillReceiveProps(newProps) {
        if (this.state.description != newProps.description)
            this.setState({description: newProps.description.slice() })
    }
    onChangeKey() {
        var description = this.state.description;
        var value = this.inputElement.value;
        if (description !== value) description = value.slice();
        this.setState({touched: true, description });
        if(!this.timeout) this.timeout=setTimeout(this.delayedUpdate,10000);
    }
    delayedUpdate(){
        var description=this.state.description.slice();
        if(this.props.onChange)
            this.props.onChange({value: {description}});
        this.timeout=null;
    }
    render() {
        const noReference = !(this.props.item && this.props.item.reference && this.props.item.reference.length);
        const description = this.props.item && this.props.item.description || '';
        if(this.props.visualMethod!=='edit')
            return (
                <div className={ClassNames('item-description', 'pre-text', (!this.props.rasp.readMore) ? (noReference ? 'vs-truncated4' : 'vs-truncated') : truncShape)}>
                    {description}
                </div>
            );
        else 
            return (
                <>
                    <TextArea
                        placeholder="Description"
                        ref={this.inputElement}
                        name="description"
                        value={this.state.description}
                        onChange={this.onChangeKey}
                        onBlur={this.delayedUpdate}
                        block
                        required
                        key="description"
                    />
                    <div className={'item-description-saving'}>
                        {this.state.touched ? (this.timeout ? 'collecting' : 'saved') : ' '}
                    </div>
                </>
            );
    }
}
export default ItemDescription;