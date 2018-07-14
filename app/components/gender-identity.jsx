'use strict';

import React from 'react';
import ReactDOM from 'react-dom';
import Select from './util/select';
import Input from './util/input';


export default class GenderIdentity extends React.Component {

    //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

    saveInfo() {
        const ele=this.refs.input && ReactDOM.findDOMNode(this.refs.input);
        const specify = (ele && ele.value) || '';
        if (specify && this.props.onChange) this.props.onChange({ gender_identity: { specify } });
        else if (!specify && this.props.onChange) this.props.onChange({gender_identity: null});
    }

    //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

    render() {

        let { info={} } = this.props;
        let { specify = '' } = info.gender_identity || {};
        if(this.refs.choice)
            choice=ReactDOM.findDOMNode(this.refs.choice).value;

        return (
            <div>
                <div className="specify-other">
                    <Input ref="input" onChange={this.saveInfo.bind(this)} defaultValue={specify} />
                </div>
            </div>
        );
    }
}
