'use strict';

import React from 'react';

//
// can't not use react-css here because we can't export the select, getter and setter methods.
//
const classes=['small','medium','large','block']; // global styles tha can be turned on with props


export default class TextInput extends React.Component {
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
    console.warn("TextInput: should use .focus()");
    return this.inputRef.current.focus();
  }

  focus(){
    return this.inputRef.current.focus();
  }

  componentWillReceiveProps(newProps){
    var defaultValue=newProps.defaultValue;
    if(defaultValue !== this.props.defaultValue && defaultValue !== this.state.value){
      this.setState({value: defaultValue})
    }
  }

  render () {
    var classNames = [];
    var inputProps=Object.assign({},this.props);

    classes.forEach(key=>{
      if(this.props[key]){
        classNames.push(classes[key]);
        delete inputProps[key];
      }
    })

    return (
      <input type="text" className={ classNames.join(' ') } { ...inputProps } value={this.state.value} ref={this.inputRef} />
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
