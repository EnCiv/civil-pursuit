'use strict';

import React                          from 'react';
import ReactDOM                       from 'react-dom';
import Input                          from './util/input';
import Postcode                       from 'postcode-validator';
import Color from 'color';


class City extends React.Component {
    name='city';

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
    return value && value.length>=2;
  }

  componentWillReceiveProps(newProps){
    let element=ReactDOM.findDOMNode(this.refs.inputref);
    if(newProps.info && (newProps.info[this.name] !== element.value)) 
      element.value=newProps.info[this.name];
      element.style.backgroundColor= Color(element.style.backgroundColor || '#ffff').darken(0.5);
      setTimeout(()=>element.style.backgroundColor=null,1000)
  }
  //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

  render() {

    let { info } = this.props;
    let { hint } = this.state;

    return (
        <div>
            <Input {...this.props} ref="inputref" onChange={ this.saveInfo.bind(this) } defaultValue={ info[this.name] } style={{display: 'inline', width: '10em', transition: 'background-color 0.5s linear'}}/>
            <div style={{display: hint ? 'inline' : 'none'}}>*</div>
        </div>
    );
  }
}

export default City;
