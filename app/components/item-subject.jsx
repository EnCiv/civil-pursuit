'use strict';

import React from 'react';
import cx from 'classnames';
import TextInput from './util/text-input';
import injectSheet from 'react-jss'
import publicConfig from '../../public.json'

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
    }
}

class ItemSubject extends React.Component {
    constructor(props) {
        super(props);
        this.inputElement = React.createRef();
        this.onChangeKey = this.onChangeKey.bind(this);
        this.onBlur = this.onBlur.bind(this);
        this.ignoreCR = this.ignoreCR.bind(this);
        this.state = { subject: this.props.item && this.props.item.subject || '' };
    }
    componentWillReceiveProps(newProps) {
        if (this.state.subject !== (newProps.item && newProps.item.subject))
            this.setState({ subject: newProps.item && newProps.item.subject })
    }
    ignoreCR(e) {
        if (e.keyCode === 13) {
            e.preventDefault();
        }
    }
    onChangeKey(e) {
        var subject = this.state.subject;
        var value = e.target.value; //this.inputElement.current.value;
        if (subject !== value) subject = value.slice();
        this.setState({ subject });
        if(this.props.onDirty){
            let dirty=(subject !== (this.props.item && this.props.item.subject || ''));
            if(dirty!==this.dirty) { // only send dirty if it changes 
                this.props.onDirty(dirty);
                this.dirty=dirty;
            }
        }
    }
    onBlur() {
        var subject = this.state.subject;
        this.dirty=false;
        if (this.props.onChange) {
            this.props.onChange({ value: { subject } })
        }
    }
    render() {
        const { classes, item, truncShape, getEditWidth } = this.props;
        const subject = this.state.subject;
        if (truncShape !== 'edit')
            return (<h4 className={cx(classes["subject"], classes[truncShape])}>{subject}</h4>)
        else {
            return (
                <TextInput block
                    className={cx(classes['subject'],classes['edit'])}
                    placeholder={item.type && item.type.subjectPlaceholder || "Subject"}
                    ref={this.inputElement}
                    required
                    name="subject"
                    defaultValue={subject}
                    onChange={this.onChangeKey}
                    onBlur={this.onBlur}
                    onKeyDown={this.ignoreCR}
                    key="subject"
                    style={{width: getEditWidth()}}
                />
            )
        }
    }
}

export default injectSheet(styles)(ItemSubject);
