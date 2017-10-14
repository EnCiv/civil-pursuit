'use strict';

import React                          from 'react';
import ReactDOM                       from 'react-dom';
import Input                          from './util/input';


class YearOfBirth extends React.Component {
    name='year_of_birth';
    state={hint: true};

  //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

  saveInfo () {
    let year=(new Date()).getFullYear();
    let newValue = ReactDOM.findDOMNode(this.refs.inputref).value;

    if ( newValue > (year-150) && newValue<=year) {
      if(this.props.onChange) this.props.onChange({[this.name]: newValue});
      this.setState({hint: false})
    } else {
        this.setState({hint: true})
    }
  }

  //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

  render() {

    let { info } = this.props;
    let { hint } = this.state;

    return (
        <div>
            <Input {...this.props} ref="inputref" onChange={ this.saveInfo.bind(this) } defaultValue={ info[this.name] }/>
            <div style={{display: hint ? 'inline' : 'none'}}>A 4 digit year like 1999</div>
        </div>
    );
  }
}

export default YearOfBirth;
