'use strict';

import React                          from 'react';
import Input                          from '../util/input';
import Postcode                       from 'postcode-validator';
import Icon                             from '../util/icon';

class Zip extends React.Component {
    name='zip';

    constructor(props){
      super(props);
      this.state={valid: !!(this.props && this.props.info && this.validate( this.props.info[this.name]))};
    }
  //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

  saveInfo (v) {
    let newValue = v.value;
    let valid=!!this.validate(newValue);
    if(valid && this.props.onChange) this.props.onChange({[this.name]: newValue});
    if(!valid && this.state.valid) this.props.onChange({[this.name]: ''});
    if(this.state.valid !== valid) this.setState({valid});
  }

  validate(value){
    return Postcode.validate(value,'US');
  }

  //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

  render() {

    const {children, info, collection, property, ...newProps } = this.props;
    let { valid } = this.state;

    return (
        <div>
            <Input {...newProps} onChange={ this.saveInfo.bind(this) } defaultValue={ info[this.name] } style={{display: 'inline', width: '10em'}}/>
            <div style={{display: valid ? 'inline' : 'none'}}><Icon icon="check" /></div>
        </div>
    );
  }
}

export default Zip;
