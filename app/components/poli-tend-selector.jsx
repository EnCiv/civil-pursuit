'use strict';

import React                          from 'react';
import Select                         from './util/select';


class PoliTendSelector extends React.Component {


   //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

  render () {
    console.info("PoliTendSelector.render:",this.props);
    let tendencyChoice=[];
 //   const { valueDefault } = this.props;

    
  //  if ( (typeof window !== 'undefined' ) && window.Synapp && window.Synapp.tendencyChoice ) {
//   console.info("PoliTendSelector tendencyChoice defined")
 //     tendencyChoice= window.Synapp.tendencyChoice;
 //     tendency = tendencyChoice.map(tendency => (
 //       <option value={ tendency._id } key={ tendency._id }>{ tendency.name }</option>
 //       ));
  //  } else {
      console.info("PoliTendSelector: tendencyChoice not ready yet");
  //  }

    return (
      <section>
        <Select block medium ref="tendency">
            <option value=''>Choose one</option>
            { tendency }
        </Select>
      </section>
    );
  }
}

export default PoliTendSelector; 
