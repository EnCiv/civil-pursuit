'use strict';

import React                          from 'react';
import Input                          from '../util/input';
import isEqual from 'lodash/isEqual';

class YearOfBirth extends React.Component {
    name='year_of_birth';
 
    constructor(props){
      super(props);
      let valid=this.props && this.props.info && this.validate(this.props.info[this.name]);
      this.state={invalid: !valid, validOnce: valid};
    }
  //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

  saveInfo (v) {
    let value = parseInt(v.value,10);

    if ( this.validate(value)) {
      if(this.props.onChange) this.props.onChange({[this.name]: value});
      this.setState({invalid: false, validOnce: true})
    } else {
      if(this.state.invalid==true && this.state.validOnce===true) // don't keep sending "" with every keystroke
        return;
      else if(this.props.onChange) this.props.onChange({[this.name]: ""});
        this.setState({invalid: true})
    }
  }

  validate(value){
    if(!value) return false;
    if(Number.isNaN(value))return false;
    let year=(new Date()).getFullYear();
    if(value > (year-150) && value <=year) return true;
    else return false;
  }

  shouldComponentUpdate(nextProps,nextState){
    if(nextState.validOnce && !this.validate(nextProps.info[this.name])) // if it was once valid but becomes invalid (like when it is valid and then the user hits backspace) don't rerender the Input with the invalid defaultValue ""
      return false;
    else 
      return !isEqual(nextProps,this.props) || !!isEqual(nextState,this.state); // if props have changed or state has changed return true
  }

  render() {

    const {children, info, ...newProps } = this.props;
    let { invalid } = this.state;

    return (
        <div>
            <Input {...newProps} onChange={ this.saveInfo.bind(this) } defaultValue={ info[this.name] } style={{display: 'inline', width: '4em'}}/>
            <div style={{display: invalid ? 'inline' : 'none', paddingRight: '1em'}}>A 4 digit year like 1999</div>
        </div>
    );
  }
}

export default YearOfBirth;
