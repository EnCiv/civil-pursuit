'use strict';

import React                          from 'react';
import ReactDOM                       from 'react-dom';
import Input                          from '../util/input';
import Color from 'color';

class Line1 extends React.Component {
    name='line1';

    constructor(props){
      super(props);
    }
  //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

  saveInfo (v) {
    let newValue = v.value;
    if(this.props.onChange) this.props.onChange({[this.name]: newValue});
  }

  //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

  render() {

    const {children, info, property, collection, ...newProps } = this.props;


    return (
        <div>
            <Input {...newProps} onChange={ this.saveInfo.bind(this) } defaultValue={ info[this.name] } style={{display: 'inline', width: '10em'}}/>
        </div>
    );
  }
}

export default Line1;
