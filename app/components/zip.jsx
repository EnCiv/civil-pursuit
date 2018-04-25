'use strict';

import React                          from 'react';
import ReactDOM                       from 'react-dom';
import Input                          from './util/input';
import Postcode                       from 'postcode-validator';
import Color from 'color';
import Icon                             from './util/icon';

class Zip extends React.Component {
    name='zip';

    constructor(props){
      super(props);
      this.state={valid: !!(this.props && this.props.info && this.validate( this.props.info[this.name]))};
    }
  //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

  saveInfo () {
    let newValue = ReactDOM.findDOMNode(this.refs.inputref).value;
    if(this.props.onChange) this.props.onChange({[this.name]: newValue});
    this.setState({valid: !!this.validate(newValue)})
  }

  validate(value){
    return Postcode.validate(value,'US');
  }

  componentWillReceiveProps(newProps){
    let element=ReactDOM.findDOMNode(this.refs.inputref);
    if(newProps.info && (newProps.info[this.name] || '') !== element.value) {
      element.value=newProps.info[this.name];
      element.style.backgroundColor= Color(element.style.backgroundColor || '#ffff').darken(0.3);
      setTimeout(()=>element.style.backgroundColor=null,1000)
    }
  }
  //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

  render() {

    const {children, info, collection, property, ...newProps } = this.props;
    let { valid } = this.state;

    return (
        <div>
            <Input {...newProps} ref="inputref" onChange={ this.saveInfo.bind(this) } defaultValue={ info[this.name] } style={{display: 'inline', width: '10em'}}/>
            <div style={{display: valid ? 'inline' : 'none'}}><Icon icon="check" /></div>
        </div>
    );
  }
}

export default Zip;
