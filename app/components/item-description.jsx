'use strict';

import React from 'react';
import ClassNames from 'classnames';
import TextArea from './util/text-area';
import createRef from 'create-react-ref/lib/createRef';
React.createRef=createRef; // remove for React 16


class ItemDescription extends React.Component {
    constructor(props) {
        super(props);
        this.inputElement = React.createRef();
        this.onChangeKey = this.onChangeKey.bind(this);
        this.delayedUpdate=this.delayedUpdate.bind(this);
        this.state = { description: this.props.item && this.props.item.description || '' };
    }
    componentWillReceiveProps(newProps) {
        let newDescription=newProps.item && newProps.item.description || '';
        if (this.state.description != newDescription)
            this.setState({description: newDescription.slice() })
    }
    onChangeKey() {
        var description = this.state.description;
        var value = this.inputElement.current.value;
        if (description !== value) description = value.slice();
        this.setState({touched: true, collecting: true, description });
        if(this.timeout) clearTimeout(this.timeout);
        this.timeout=setTimeout(this.delayedUpdate,10000);

    }
    delayedUpdate(){
        var description= this.state.description.slice();
        if(this.props.onChange)
            this.props.onChange({value: {description}});
        this.setState({collecting: false});
    }
    render() {
        const {truncShape, visualMethod, item, rasp}= this.props;
        const noReference = !(item && item.reference && item.reference.length);
        const description = item && item.description || '';
        if (rasp.shape !== 'edit')
            return (
                <div className={ClassNames('item-description', 'pre-text', (!rasp.readMore) ? (noReference ? 'vs-truncated4' : 'vs-truncated') : truncShape)}>
                    {description}
                </div>
            );
        else 
            return (
                <section>
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
                        {this.state.touched ? (this.state.collecting ? 'collecting' : 'saved') : ' '}
                    </div>
                </section>
            );
    }
}
export default ItemDescription;