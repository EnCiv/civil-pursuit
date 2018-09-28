'use strict';

import React from 'react';
import cx from 'classnames';
import TextArea from './util/text-area';
import createRef from 'create-react-ref/lib/createRef';
React.createRef = createRef; // remove for React 16
import injectSheet from 'react-jss'
import publicConfig from '../../public.json';

const styles = {
    'description': {
        overflow: 'visible!important',
        display: 'inline!important',
        'line-height': '1.375em!important',        /* fallback */
        'max-height': 'none!important',       /* fallback */
        'position': 'relative!important',
        'margin-bottom': `${publicConfig.itemVisualGap}!important`,
        'transition': 'height 0.5s linear!important',
        'pre-text': {
            'white-space': 'pre-line!important',
            'text-align': 'justify!important',
        },
        '&$vs-collapsed, &$vs-minified, &$vs-title': {
            display: 'none'
        },
        '&$vs-truncated': {
            'max-height': "calc( 1.375em * 3)!important"
        },
        '&$vs-truncated4': {
            'max-height': "calc( 1.375em * 4)!important"
        }
    },
    'vs-edit':{},
    'vs-open':{},
    'vs-truncated':{},
    'vs-truncated4': {},
    'vs-ooview': {},
    'vs-title': {},
    'vs-collapsed': {},
    'vs-minified': {},
    edit: {
        'border': 'none!important',
        'line-height': '1.375em!important',
        'padding': '0!important',
    },
    saving: {
        'text-align': 'right!important'
    }
}


class ItemDescription extends React.Component {
    constructor(props) {
        super(props);
        this.inputElement = React.createRef();
        this.onChangeKey = this.onChangeKey.bind(this);
        this.delayedUpdate = this.delayedUpdate.bind(this);
        this.state = { description: this.props.item && this.props.item.description || '' };
    }
    componentWillReceiveProps(newProps) {
        let newDescription = newProps.item && newProps.item.description || '';
        if (this.state.description != newDescription)
            this.setState({ description: newDescription.slice() })
    }
    onChangeKey() {
        var description = this.state.description;
        var value = this.inputElement.current.value;
        if (description !== value) description = value.slice();
        this.setState({ touched: true, collecting: true, description });
        if (this.timeout) clearTimeout(this.timeout);
        this.timeout = setTimeout(this.delayedUpdate, 10000);

    }
    delayedUpdate() {
        var description = this.state.description.slice();
        if (this.props.onChange)
            this.props.onChange({ value: { description } });
        this.setState({ collecting: false });
    }
    render() {
        const { classes, truncShape, visualMethod, item, rasp } = this.props;
        const noReference = !(item && item.reference && item.reference.length);
        const description = item && item.description || '';
        if (rasp.shape !== 'edit')
            return (
                <div className={cx(classes['description'], classes['pre-text'], classes[(!rasp.readMore) ? (noReference ? 'vs-truncated4' : 'vs-truncated') : truncShape])}>
                    {description}
                </div>
            );
        else
            return (
                <section>
                    <TextArea
                        className={classes['edit']}
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
                    <div className={classes['saving']}>
                        {this.state.touched ? (this.state.collecting ? 'collecting' : 'saved') : ' '}
                    </div>
                </section>
            );
    }
}
export default injectSheet(styles)(ItemDescription);