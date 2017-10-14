'use strict';

import React                          from 'react';
import ReactDOM                       from 'react-dom';
import Input                          from './util/input';
import postcode                       from 'postcode-validator';


class Zip extends React.Component {
    name='zip';
    state={hint: true};

  //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

  saveInfo () {
    let newValue = ReactDOM.findDOMNode(this.refs.inputref).value;

    if ( postcode(newValue.validate(newValue,'US'))) {
      if(this.props.onChange) this.props.onChange({[this.name]: newValue});
      this.setState({hint: false})
    } else {
        this.setState({hint: true})
    }
  }

  //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

  render() {

    let { info } = this.props;
    let { hint } = this.state;

    return (
        <div>
            <Input {...this.props} ref="inputref" onChange={ this.saveInfo.bind(this) } defaultValue={ info[this.name] }/>
            <div style={{display: hint ? 'inline' : 'none'}}>a 5 digit zip or zip+4 number</div>
        </div>
    );
  }
}

export default Zip;
