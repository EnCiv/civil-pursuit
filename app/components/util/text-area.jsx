'use strict';

import React from 'react';
import autosize from 'autosize';

class Textarea extends React.Component {
  constructor(props){
    super(props);
    this.state={value: this.props.defaultValue||''};
    this.inputRef=React.createRef();
    if(this.props.value!=='undefined') console.error("Textarea should not be passed value, use default value");
  }

  onChangeHandler(e){
    if(e.target && e.target.value !== this.state.value)
      this.setState({value: e.target.value})
  }

  select(){
    console.warn("Textarea: should use .focus()");
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

  componentDidMount () {
    autosize(this.inputRef.current);
  }

  render () {
    let classes = [];
    let textAreaProps=Object.assign({},this.props);

    let props = [
      'block',
      'primary',
      'info',
      'large',
      'medium',
      'radius',
      'cursor-pointer',
      'shy',
      'success',
      'error',
      'warning'
    ];

    for ( let prop of props ) {
      if ( this.props[prop] ) {
        classes.push(prop);
        delete textAreaProps[prop];
      }
    }

    return (
      <textarea className={ classes.join(' ') } { ...textAreaProps } value={this.state.value} ref={this.inputRef}/>
    );
  }
}

Object.defineProperty(Textarea.prototype,'value',{
  get: function () {
    return this.state.value;
  },
  set: function (v) {
    if(this.state.value !== v)
      this.setState({value: v})
  }
})

export default Textarea;
