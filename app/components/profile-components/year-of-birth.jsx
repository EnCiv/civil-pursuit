'use strict';

import React                          from 'react';
import ReactDOM                       from 'react-dom';
import Input                          from '../util/input';


class YearOfBirth extends React.Component {
    name='year_of_birth';
 
    constructor(props){
      super(props);
      this.state={hint: this.props && this.props.info && this.validate( this.props.info[this.name])};
    }
  //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

  saveInfo () {
    let value = parseInt(ReactDOM.findDOMNode(this.refs.inputref).value,10);

    if ( this.validate(value)) {
      if(this.props.onChange) this.props.onChange({[this.name]: value});
      this.setState({hint: false})
    } else {
      if(this.props.onChange) this.props.onChange({[this.name]: ""});
        this.setState({hint: true})
    }
  }

  validate(value){
    if(!value) return false;
    if(Number.isNaN(value))return false;
    let year=(new Date()).getFullYear();
    if(value > (year-150) && value <=year) return true;
    else return false;
  }
  //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

  render() {

    const {children, info, ...newProps } = this.props;
    let { hint } = this.state;

    return (
        <div>
            <Input {...newProps} ref="inputref" onChange={ this.saveInfo.bind(this) } defaultValue={ info[this.name] } style={{display: 'inline', width: '4em'}}/>
            <div style={{display: hint ? 'inline' : 'none'}}>A 4 digit year like 1999</div>
        </div>
    );
  }
}

export default YearOfBirth;
