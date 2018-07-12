'use strict';

import React from 'react';
import ReactDOM from 'react-dom';
import Select from './util/select';

export default class StaticProfileSelector extends React.Component {
    name = "static_profile_type";
    choices = ['Choice 1', 'Choice 2'];
    elem;

    //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

    save() {
        let val = ReactDOM.findDOMNode(this.elem).value;
        if (this.props.onChange) this.props.onChange({ [this.name]: val });
    }

    //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

    render() {
        const { info, onChange, ...newProps } = this.props;
        const options = this.choices.map(val => (
            <option value={val} key={val}>{val}</option>
        ));

        return (
            <Select {...newProps} ref={e => e ? this.elem = e : null} onChange={this.save.bind(this)} defaultValue={info[this.name]}>
                <option value="">Choose one</option>
                {options}
            </Select>
        );
    }
}
