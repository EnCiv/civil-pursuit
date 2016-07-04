//this is based on http://www.reactexamples.com/react-bar-chart/ with credit and gratitude
'use strict';

import React from 'react';



class Charts extends React.Component {


  render(){
    var self = this,
      data = this.props.data,
      layered = this.props.grouping === 'layered' ? true : false,
      stacked = this.props.grouping === 'stacked' ? true : false,
      opaque = this.props.opaque,
      max = 0;

    for (var i = data.length; i--; ) {
      for (var j = data[i].length; j--; ) {
        if (data[i][j] > max) {
          max = data[i][j];
        }
      }
    }


    return (
      <div className={ 'Charts' + (this.props.horizontal ? ' horizontal' : '' ) }
        style={{ height: self.props.height ? self.props.height: 'auto' }}
      >
        { data.map(function (serie, serieIndex) {
          var sortedSerie = serie.slice(0),
            sum;

          sum = serie.reduce(function (carry, current) {
            return carry + current;
          }, 0);
          sortedSerie.sort( (a,b) => {return (a-b);} );           
 
          return (
            <div className={ 'Charts--serie ' + (self.props.grouping) }
              key={ serieIndex }
            >
            <label>{ self.props.labels[serieIndex] }</label>
            { serie.map(function (item, itemIndex) {
              var color = self.props.colors[itemIndex], style,
                size = item / (stacked ? sum : max) * 100;

              style = {
                backgroundColor: color
                //*opacity: opaque ? 1 : (item/max + .05),
                //zIndex: item 
              };

              if (self.props.horizontal) {
                style['width'] = size + '%';
              } else {                
                style['height'] = size + '%';           
              }

              if (layered && !self.props.horizontal) {
                //console.log(sortedSerie, serie, sortedSerie.indexOf(item));
                style['right'] = ((sortedSerie.indexOf(item) / (serie.length + 1)) * 100) + '%';
                // style['left'] = (itemIndex * 10) + '%';
              }

             return (
               <div
                className={ 'Charts--item ' + (self.props.grouping) }
                style={ style }
                key={ itemIndex }
              >
                <b style={{ color: color }}>{ item }</b>
               </div>
            );
            }) }
            </div>
          );
        }) }
      </div>
    );
  }
}

export default Charts;