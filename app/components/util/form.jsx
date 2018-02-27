'use strict';

import React              from 'react';
import Flash              from './flash';
import Component          from '../../lib/app/component';

class Form extends React.Component {

  //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

  constructor (props) {
    super(props);

    let { validationError, successMessage } = this.props.flash || {};

    this.state = {
      validationError, successMessage
    };
  }

  //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

  componentWillReceiveProps (props) {
    if ( 'flash' in props && props.flash ) {
      if ( 'validationError' in props.flash ) {
        this.setState({ validationError : props.flash.validationError });
      }

      if ( 'successMessage' in props.flash ) {
        this.setState({ successMessage : props.flash.successMessage });
      }
    }
  }

  //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

  validateRequired () {
    let form = this.refs.form;

    let requiredList = form.querySelectorAll('[required]');

    let empty = [];

    for ( let i = 0; i < requiredList.length; i ++ ) {
      let value = requiredList[i].value;

      if ( ! value ) {
        empty.push(requiredList[i]);
      }
    }

    if ( empty.length ) {
      this.setState({ validationError: `${empty[0].placeholder} ${Form.REQUIRED_MESSAGE}` });

      empty[0].select();

      return false;
    }

    return true;
  }

  //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

  validateEmail () {
    let form = this.refs.form;

    let emails = form.querySelectorAll('[type="email"]');

    let invalid = [];

    for ( let i = 0; i < emails.length; i ++ ) {
      let value = emails[i].value;

      if ( ! emails[i].checkValidity() ) {
        invalid.push(emails[i]);
      }
    }

    if ( invalid.length ) {
      this.setState({ validationError: `${invalid[0].placeholder} must be a valid email address` });

      invalid[0].select();

      return false;
    }

    return true;
  }

  //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

  submitHandler (e) {
    e.preventDefault();

    console.log('hello')

    if ( this.validateRequired() && this.validateEmail() ) {
      this.setState({ validationError : null });
      if ( this.props.handler ) {
        this.props.handler(e);
      }
    }
  }

  //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

  render () {
    var {handler, ...buttonProps} = this.props;
    delete buttonProps['form-center'];
    delete buttonProps.flash;

    let flash;

    if ( this.state.validationError ) {
      flash = ( <Flash error message={ this.state.validationError } /> );
    }

    else if ( this.state.successMessage ) {
      flash = ( <Flash success message={ this.state.successMessage } /> );
    }

    else if ( this.state.info ) {
      flash = ( <Flash info message={ this.state.info } /> );
    }

    let classes = [];

    if ( this.props['form-center'] ) {
      classes.push('syn-form-center');
    }

    return (
      <form { ...buttonProps } method="POST" role="form" noValidate onSubmit={ this.submitHandler.bind(this) } ref="form" className={ Component.classList(this, ...classes) }>
        <h2>{ this.props.title }</h2>
        { flash }
        { this.props.children }
      </form>
    );
  }

  //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
}

Form.REQUIRED_MESSAGE = 'can not be left empty';

export default Form;
