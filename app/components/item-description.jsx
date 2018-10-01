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
        overflow: 'visible',
        display: 'inline',
        'line-height': '1.375em',        /* fallback */
        'max-height': 'none',       /* fallback */
        'position': 'relative',
        'margin-bottom': `${publicConfig.itemVisualGap}`,
        'transition': 'height 0.5s linear',
        'pre-text': {
            'white-space': 'pre-line',
            'text-align': 'justify',
        },
        '&$vs-collapsed, &$vs-minified, &$vs-title': {
            display: 'none'
        },
        '&$vs-truncated': {
            'max-height': "calc( 1.375em * 3)"
        },
        '&$vs-truncated4': {
            'max-height': "calc( 1.375em * 4)"
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
    'pre-text': {},
    edit: {
        'border': 'none',
        'line-height': '1.375em',
        'padding': '0',
    },
    saving: {
        'text-align': 'right'
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
        // if description is truncated, not in readMore, and there is no reference - then use vs-truncated4 to show an extra line of description
        const reviseTruncShape= truncShape==='vs-truncated'? (!rasp.readMore ? (noReference ? 'vs-truncated4' : 'vs-truncated') : 'vs-truncated' )
            : truncShape;
        const description = item && item.description || '';
        if (rasp.shape !== 'edit')
            return (
                <div className={cx(classes['description'], classes['pre-text'], classes[reviseTruncShape])}>
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