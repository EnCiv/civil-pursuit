'use strict';

import React from 'react';
import cx from 'classnames';
import Input from './util/input';
import injectSheet from 'react-jss'
import publicConfig from '../../public.json'
import {editShapes} from './item'

const styles ={
    subject: {
        'font-family': 'Oswald',
        'margin': '0',
        'margin-top': '0',
        'text-align': 'left',
        padding: `0 0 calc( ${publicConfig.itemVisualGap} * 0.5 ) 0`,
        overflow: 'visible',
        'white-space': 'normal',
        'font-size': '1.375em',
        'line-height': '1.375em',
        '&$collapsed, &$minified':{
            overflow: 'hidden',
            'text-overflow': 'ellipsis',
            'white-space': 'nowrap'
        },
        '&$title, &$peek': {
            overflow: 'hidden',
            'text-overflow': 'ellipsis',
            'white-space': 'nowrap',
            'font-size': '1rem'
        },
        '&$placeholder': {
            'font-family': 'inherit',
            'font-size': 'calc(1 / 1.375 * 1em)',
            'color': '#ddd !important' // can't really override the place holder color - but here it is incase that ever happens
        }
    },
    'collapsed': {},
    'minified': {},
    'title': {},
    'peek': {},
    'truncated': {},
    'open': {},
    'edit': {
        'input&':{
            extend: 'subject',
            display: 'block',
            width: '100%',
            border: 'none',
        }
    },
    'placeholder': {}
}

class ItemSubject extends React.Component {
    constructor(props) {
        super(props);
        this.onChange = this.onChange.bind(this);
        this.onBlur = this.onBlur.bind(this);
        this.ignoreCR = this.ignoreCR.bind(this);
        this.delayedUpdate=this.delayedUpdate.bind(this)
        this.state = { subject: this.qualify(props.item && props.item.subject) };
    }

    qualify(val){
        return val || '';
    }

    componentWillReceiveProps(newProps) {
        if (this.state.subject !== (this.qualify(newProps.item && newProps.item.subject)))
            this.setState({ subject: this.qualify(newProps.item && newProps.item.subject) })
    }
    ignoreCR(e) {
        if (e.keyCode === 13) {
            e.preventDefault();
        }
    }
    onChange(v) {
        var subject = this.state.subject;
        var value = this.qualify(v.value); 
        if (subject !== value) subject = value.slice();
        this.setState({ subject });
        if (this.timeout) clearTimeout(this.timeout);
        this.timeout = setTimeout(this.delayedUpdate, 10000);
        if(this.props.onDirty){
            let dirty=(subject !== (this.qualify(this.props.item && this.props.item.subject)));
            if(dirty!==this.dirty) { // only send dirty if it changes 
                this.dirty=dirty;
                this.props.onDirty(dirty);
            }
        }
    }
    
    onBlur(){
        if(this.timeout || this.dirty) {
            var subject = this.state.subject.slice();
            this.dirty=false;
            clearTimeout(this.timeout);
            this.timeout=0;
            if (this.props.onChange)
                this.props.onChange({ value: { subject } });
        }
        if(this.props.onBlur) this.props.onBlur();
    }

    delayedUpdate() {
        var subject = this.state.subject.slice();
        this.timeout=0;
        this.dirty=false;
        if (this.props.onChange)
            this.props.onChange({ value: { subject } });
    }

    render() {
        const { classes, item, truncShape, headlineAfter, className } = this.props;
        const subject = this.state.subject;
        const placeHolder=item.type && item.type.subjectPlaceholder || headlineAfter && "Headline - a short headline drawing attention to the main point" || "Subject";
        if (!editShapes.includes(truncShape))
            return (<h4 className={cx(classes["subject"], classes[truncShape], className)}>{subject}</h4>)
        else {
            return (
                <Input type='text'
                    block
                    className={cx(classes['subject'],classes['edit'],(!this.state.subject) && headlineAfter && classes['placeholder'], className )}
                    placeholder={placeHolder}
                    required
                    name="subject"
                    defaultValue={subject}
                    onChange={this.onChange}
                    onBlur={this.onBlur}
                    onKeyDown={this.ignoreCR}
                    key="subject"
                />
            )
        }
    }
}

export default injectSheet(styles)(ItemSubject);
