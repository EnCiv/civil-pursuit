'use strict';

import React                          from 'react';
import Select                         from './util/select';


class PoliTendSelector extends React.Component {


   //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

  render () {
    console.info("PoliTendSelector.render:",this);
   
    return (
      <section>
        <Select block medium ref="tendency">
            <option value=''>Choose one</option>
        </Select>
      </section>
    );
  }
}

export default PoliTendSelector; 
