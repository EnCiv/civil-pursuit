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
        'font-size': '1.375rem',
        'line-height': '1.375rem',
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
            'font-size': 'calc(1 / 1.375 * 1rem)',
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
        var subject=this.qualify(props.item && props.item.subject)
        this.state = { subject };
        this.valid=this.isValid(subject);
    }

    qualify(val){
        return val || '';
    }

    componentDidMount(){
        this.props.onBlur && this.props.onBlur({subject: this.valid});
    }

    componentWillReceiveProps(newProps) {
        if(this.dirty) return;  // race - delayedUpdate and onChangeKey when user is typing. If user is typing, it's dirty and that should have presicence
        var subject=this.qualify(newProps.item && newProps.item.subject);
        if (this.state.subject !== subject)
            this.setState({ subject })
        const oldV=this.valid;
        this.valid=this.isValid(subject);
        if(oldV !== this.valid && this.props.onBlur) 
            this.props.onBlur({subject: this.valid});
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
            let valid=this.isValid(subject)
            if(dirty!==this.dirty || valid !== this.valid) { // only send dirty if it changes 
                this.dirty=dirty;
                this.valid=valid;
                this.props.onDirty(dirty,{subject: valid});
            }
        }
    }

    isValid(subject){
        return !!(typeof subject === 'string' && subject.length);
    }
    
    onBlur(){
        if(this.timeout || this.dirty) {
            var subject = this.state.subject.slice();
            this.dirty=false;
            this.valid=this.isValid(subject)
            clearTimeout(this.timeout);
            this.timeout=0;
            if (this.props.onChange)
                this.props.onChange({ value: { subject } },{subject: this.valid});
        }
        if(this.props.onBlur) this.props.onBlur({subject: this.valid});
    }

    delayedUpdate() {
        var subject = this.state.subject.slice();
        this.timeout=0;
        this.dirty=false;
        this.valid=this.isValid(subject)
        if (this.props.onChange)
            this.props.onChange({ value: { subject } },{subject: this.valid});
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
