'use strict';

import React from 'react';

class Input extends React.Component {
  select(){
    return this.refs.view.select();
  }
  render () {
    let classes = ['bp_input'];
    var inputProps=Object.assign({},this.props);

    if ( this.props.block ) {
      classes.push('block');
      delete inputProps.block;
    }

    if ( this.props.medium ) {
      classes.push('medium');
      delete inputProps.medium;
    }

    if ( this.props.large ) {
      classes.push('large');
      delete inputProps.large;
    }

    return (
      <input type="{ this.props.type || 'text' }" className={ classes.join(' ') } { ...inputProps } ref="view"  />
    );
  }
}

Object.defineProperty(Input.prototype,'value',{
  get: function () {
    return this.refs.view.value;
  },
  set: function (v) {
    this.refs.view.value=v;
  }
})
export default Input;
