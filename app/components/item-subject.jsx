'use strict';

import React from 'react';
import cx from 'classnames';
import TextInput from './util/text-input';
import createRef from 'create-react-ref/lib/createRef';
React.createRef = createRef; // remove for React 16
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
        '&$vs-collapsed, &$vs-minified':{
            overflow: 'hidden',
            'text-overflow': 'ellipsis',
            'white-space': 'nowrap'
        },
        '&$vs-title, &$vs-peek': {
            overflow: 'hidden',
            'text-overflow': 'ellipsis',
            'white-space': 'nowrap',
            'font-size': '1rem'
        }
    },
    'vs-collapsed': {},
    'vs-minified': {},
    'vs-title': {},
    'vs-peek': {},
    'vs-truncated': {},
    'vs-open': {},
    'edit': {
        'input&':{
            extend: 'subject',
            width: '100%',
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
    onChangeKey() {
        var subject = this.state.subject;
        var value = this.inputElement.current.value;
        if (subject !== value) subject = value.slice();
        this.setState({ subject });
    }
    onBlur() {
        var subject = this.state.subject;
        if (this.props.onChange) {
            this.props.onChange({ value: { subject } })
        }
    }
    render() {
        const { classes, item, rasp, truncShape } = this.props;
        const subject = this.state.subject;
        if (rasp.shape !== 'edit')
            return (<h4 className={cx(classes["subject"], classes[truncShape])}>{subject}</h4>)
        else {
            return (
                <TextInput block
                    className={classes['edit']}
                    placeholder={item.type.subjectPlaceholder || "Subject"}
                    ref={this.inputElement}
                    required
                    name="subject"
                    value={subject}
                    onChange={this.onChangeKey}
                    onBlur={this.onBlur}
                    onKeyDown={this.ignoreCR}
                    key="subject"
                />
            )
        }
    }
}

export default injectSheet(styles)(ItemSubject);
