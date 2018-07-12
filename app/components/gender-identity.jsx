'use strict';

import React from 'react';
import ReactDOM from 'react-dom';
import Row from './util/row';
import Column from './util/column';
import Select from './util/select';
import Input from './util/input';


export default class GenderIdentity extends React.Component {

    //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

    saveInfo() {
        const choice = ReactDOM.findDOMNode(this.refs.choice).value;
        const specify = (choice==="Other" && this.refs.input && ReactDom.findDOMNode(this.refs.input).value) || '';
        if (this.props.onChange) this.props.onChange({ gender_identity: { choice, specify } });
    }

    //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

    render() {

        let { info={} } = this.props;
        let { choice = '', specify = '' } = info.gender_identity;
        if(this.refs.choice)
            choice=ReactDOM.findDOMNode(this.refs.choice).value;

        return (
            <div>
                <Select block medium ref="choice" onChange={this.saveInfo.bind(this)} defaultValue={choice}>
                    <option value="">Choose one</option>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other (specify)</option>
                </Select>
                <div className="specify-other" style={{ display: choice === "Other" ? 'block' : 'none' }}>
                    <Input ref="input" onChange={this.saveInfo.bind(this)} defaultValue={specify} style={{ display: 'inline', width: '10em', transition: 'background-color 0.5s linear' }} />
                </div>
            </div>
        );
    }
}
