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
    }
  //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

  saveInfo () {
    let newValue = ReactDOM.findDOMNode(this.refs.inputref).value;
    if(this.props.onChange) this.props.onChange({[this.name]: newValue});
  }

  componentWillReceiveProps(newProps){
    let element=ReactDOM.findDOMNode(this.refs.inputref);
    if(newProps.info && (newProps.info[this.name] || '') !== element.value) { 
      element.value=newProps.info[this.name];
      element.style.backgroundColor= Color(element.style.backgroundColor || '#ffff').darken(0.5);
      setTimeout(()=>element.style.backgroundColor=null,1000)
    }
  }
  //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

  render() {

    const { children, info, property, collection, ...newProps } = this.props;

    return (
        <div>
            <Input {...newProps} ref="inputref" onChange={ this.saveInfo.bind(this) } defaultValue={ info[this.name] } style={{display: 'inline', width: '10em', transition: 'background-color 0.5s linear'}}/>
        </div>
    );
  }
}

export default City;
