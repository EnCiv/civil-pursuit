'use strict';

import React                          from 'react';
import ReactDOM                       from 'react-dom';
import Input                          from './util/input';
import Postcode                       from 'postcode-validator';


class Zip extends React.Component {
    name='zip';

    constructor(props){
      super(props);
      this.state={hint: this.props && this.props.info && this.validate( this.props.info[this.name])};
    }
  //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

  saveInfo () {
    let newValue = ReactDOM.findDOMNode(this.refs.inputref).value;

    if ( this.validate(newValue)) {
      if(this.props.onChange) this.props.onChange({[this.name]: newValue});
      this.setState({hint: false})
    } else {
        this.setState({hint: true})
    }
  }

  validate(value){
    return Postcode.validate(value,'US');
  }
  //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

  render() {

    let { info } = this.props;
    let { hint } = this.state;

    return (
        <div>
            <Input {...this.props} ref="inputref" onChange={ this.saveInfo.bind(this) } defaultValue={ info[this.name] } style={{display: 'inline', width: '10em'}}/>
            <div style={{display: hint ? 'inline' : 'none'}}>a 5 digit zip or zip+4 number</div>
        </div>
    );
  }
}

export default Zip;
