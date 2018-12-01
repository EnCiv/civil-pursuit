'use strict';

import React from 'react';
import injectSheet from 'react-jss'
import { Object } from 'es6-shim';

const styles={
  small: {
    'font-size': '.80rem !important',
    'border-width:': '2px',
    'padding:': '0 0.4em 0.2em 0',
  },

  medium: {
    'font-size': '1.25rem',
    'border-width': '2px',
    'padding': '1em'
  },

  large: {
    'font-size': '1.75rem',
    'border-width': '2px',
    'line-height': '1.3em'
  },

  block: {
    'width': 'calc(100%)',
  }
}

class TextInput extends React.Component {
  constructor(props){
    super(props);
    this.state={value: this.props.defaultValue||''};
    this.inputRef=React.createRef();
    if(this.props.value!=='undefined') console.error("TextInput should not be passed value, use default value");
  }

  onChangeHandler(e){
    if(e.target && e.target.value !== this.state.value)
      this.setState({value: e.target.value})
  }

  select(){
    return this.inputRef.current.focus();
  }

  componentWillReceiveProps(newProps){
    var defaultValue=newProps.defaultValue;
    if(defaultValue !== this.props.defaultValue && defaultValue !== this.state.value){
      this.setState({value: defaultValue})
    }
  }

  render () {
    const {classes}=this.props;
    var classNames = [];
    var inputProps=Object.assign({},this.props);

    Object.keys(classes).forEach(key=>{
      if(this.props[key]){
        classNames.push(classes[key]);
        delete inputProps[key];
      }
    })

    return (
      <input type="text" className={ classNames.join(' ') } { ...inputProps } ref={this.inputRef} />
    );
  }
}

Object.defineProperty(TextInput.prototype,'value',{
  get: function () {
    return this.state.value;
  },
  set: function (v) {
    if(this.state.value !== v)
      this.setState({value: v})
  }
})

export default injectSheet(styles)(TextInput);

