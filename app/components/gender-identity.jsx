'use strict';

import React from 'react';
import ReactDOM from 'react-dom';
import Select from './util/select';
import Input from './util/input';


export default class GenderIdentity extends React.Component {

    //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

    saveInfo() {
        const choice = ReactDOM.findDOMNode(this.refs.choice).value;
        const ele=this.refs.input && ReactDOM.findDOMNode(this.refs.input);
        if(choice!=='Other' && ele && ele.value) ele.value=''; 
        const specify = (ele && ele.value) || '';
        if (choice && this.props.onChange) this.props.onChange({ gender_identity: { choice, specify } });
        else if (!choice && this.props.onChange) this.props.onChange({gender_identity: null});
    }

    //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

    render() {

        let { info={} } = this.props;
        let { choice = '', specify = '' } = info.gender_identity || {};
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
                    <Input ref="input" onChange={this.saveInfo.bind(this)} defaultValue={specify} />
                </div>
            </div>
        );
    }
}
