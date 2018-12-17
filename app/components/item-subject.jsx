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
            'font-size': '1rem',
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
            display: 'inline',
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

    getEditWidth(){
        if(this.props.getEditWidth){
            let width=this.props.getEditWidth();
            if(width) 
                return width;
            else
                setTimeout(()=>this.forceUpdate()); // when ItemSubject is rendered - in edit mode, it needs this width. But the first time through, buttons and truncable aren't known yet, so wait for the render to complete and force an update. 
        }
    }

    render() {
        const { classes, item, truncShape } = this.props;
        const subject = this.state.subject;
        const placeHolder=item.type && item.type.subjectPlaceholder || truncShape==='headlineAfterEdit' && "Headline - a short headline drawing attention to the main point" || "Subject";
        if (!editShapes.includes(truncShape))
            return (<h4 className={cx(classes["subject"], classes[truncShape])}>{subject}</h4>)
        else {
            return (
                <Input type='text'
                    block
                    className={cx(classes['subject'],classes['edit'],(!this.state.subject) && classes['placeholder'] )}
                    placeholder={placeHolder}
                    required
                    name="subject"
                    defaultValue={subject}
                    onChange={this.onChange}
                    onBlur={this.onBlur}
                    onKeyDown={this.ignoreCR}
                    key="subject"
                    style={{width: this.getEditWidth()}}
                />
            )
        }
    }
}

export default injectSheet(styles)(ItemSubject);
