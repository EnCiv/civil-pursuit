'use strict';

import React from 'react'
import cx from 'classnames'
import Textarea from './util/text-area'
import injectSheet from 'react-jss'
import {editShapes} from './item'
import publicConfig from '../../public.json'

const styles = {
    'description': {
        overflow: 'visible',
        display: 'inline',
        'line-height': '1.375em',        /* fallback */
        'max-height': 'none',       /* fallback */
        'position': 'relative',
        'margin-bottom': `${publicConfig.itemVisualGap}`,
        'transition': 'height 0.5s linear',
        '&$pre-text': {
            'white-space': 'pre-line',
            'text-align': 'justify',
        },
        '&$collapsed, &$minified, &$title': {
            display: 'none'
        },
        '&$truncated': {
            'max-height': "calc( 1.375em * 3)"
        },
        '&$truncated4': {
            'max-height': "calc( 1.375em * 4)"
        }
    },
    'edit':{},
    'open':{},
    'truncated':{},
    'truncated4': {},
    'ooview': {},
    'title': {},
    'peek': {},
    'collapsed': {},
    'minified': {},
    'pre-text': {},
    edit: {
        'border': 'none',
        'line-height': '1.375em',
        'padding': '0',
        'width': '100%',
    },
    saving: {
        'text-align': 'right',
        'font-size': '1rem'
    }
}


class ItemDescription extends React.Component {
    constructor(props) {
        super(props);
        this.inputElement = React.createRef();
        this.onChangeKey = this.onChangeKey.bind(this);
        this.delayedUpdate = this.delayedUpdate.bind(this);
        this.onBlur=this.onBlur.bind(this);
        var description=this.props.item && this.props.item.description && this.props.item.description.slice() || ''

        this.state = { description };
        this.valid=this.isValid(description)
    }
    componentDidMount(){
        this.props.onBlur && this.props.onBlur({description: this.valid});
    }

    componentWillReceiveProps(newProps) {
        if(this.dirty) return;  // race - delayedUpdate and onChangeKey when user is typing. If user is typing, it's dirty and that should have presicence
        var newDescription = newProps.item && newProps.item.description && newProps.item.description.slice() || '';
        if (this.state.description != newDescription)
            this.setState({ description: newDescription });
        const oldV=this.valid;
        this.valid=this.isValid(newDescription);
        if(oldV !== this.valid && this.props.onBlur) 
            this.props.onBlur({description: this.valid});
    }

    onChangeKey(v) {
        var description = this.state.description;
        var value = v.value; //
        if (description !== value) description = value.slice();
        this.setState({ description });
        if (this.timeout) clearTimeout(this.timeout);
        this.timeout = setTimeout(this.delayedUpdate, 10000);
        if(this.props.onDirty){
            let dirty=(description !== (this.props.item && this.props.item.description || ''));
            let valid=this.isValid(description)
            if(dirty!==this.dirty || valid !== this.valid) { // only send dirty if it changes 
                this.dirty=dirty;
                this.valid=valid;
                this.props.onDirty(dirty, {description: valid});
            }
        }
    }

    isValid(description){
        return !!(typeof description === 'string' && description.length);
    }

    onBlur(){
        if(this.timeout || this.dirty) {
            var description = this.state.description.slice();
            this.dirty=false;
            this.valid=this.isValid(description)
            clearTimeout(this.timeout);
            this.timeout=0;
            if (this.props.onChange)
                this.props.onChange({ value: { description } }, {description: this.valid});
        }
        if(this.props.onBlur) this.props.onBlur({description: this.valid});
    }

    delayedUpdate() {
        var description = this.state.description.slice();
        this.dirty=false;
        this.valid=this.isValid(description)
        this.timeout=0;
        if (this.props.onChange)
            this.props.onChange({ value: { description } }, {description: this.valid});
    }

    render() {
        const { classes, truncShape, item, rasp, className } = this.props;
        const noReference = !(item && item.reference && item.reference.length);
        // if description is truncated, not in readMore, and there is no reference - then use truncated4 to show an extra line of description
        const reviseTruncShape= truncShape==='truncated'? (!rasp.readMore ? (noReference ? 'truncated4' : 'truncated') : 'truncated' )
            : truncShape;
        const description = item && item.description || '';
        const placeholder=item.type && item.type.descriptionPlaceholder || "Description";
        if (!editShapes.includes(truncShape))
            return (
                <div className={cx(classes['description'], classes['pre-text'], classes[reviseTruncShape],className)}>
                    {description}
                </div>
            );
        else
            return (
                <section>
                    <Textarea
                        className={cx(classes['edit'],className)}
                        placeholder={placeholder}
                        ref={this.inputElement}
                        name="description"
                        defaultValue={this.state.description}
                        onChange={this.onChangeKey}
                        onBlur={this.onBlur}
                        block
                        required
                        key="description"
                    />
                    <div className={classes['saving']}>
                        {this.state.touched ? (this.state.collecting ? 'collecting' : 'saved') : ' '}
                    </div>
                </section>
            );
    }
}
export default injectSheet(styles)(ItemDescription);