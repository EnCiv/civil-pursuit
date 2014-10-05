/**
 * Charts directive
 * 
 * @module directives/charts
 * @prop $attr {AngularAttribute} - Element's attributes
 * @prop $attr.synCharts {string} - {CriteriaSchema}._id
 * @example
 *    <ANY data-syn-charts="{{CriteriaSchema._id}}">
 *      <SVG class="chart" />
 *    </ANY>
 * @author francoisrvespa@gmail.com
*/

module.exports = function ($timeout) {
  return {
    restrict: 'CA',

    link: function ($scope, $elem, $attr) {

      if ( $attr.synCharts ) {
        $timeout(chart, 1000);
      }

      var t1 = 0;

      /** @method chart */

      function chart () {

        if ( ! $scope.$parent.votes ) {
          t1 ++;
          if ( t1 < 10 ) {
            return;
          }
          return $timeout(chart, 1000);
        }

        var votes = $scope.$parent.votes[$attr.synCharts];

        if ( ! votes ) {
          return;
        }

        var data = [];

        for ( var number in votes.values ) {
          data.push({
            label: number,
            value: votes.values[number] * 100 / votes.total
          });
        }

        var columns = ['votes'];

        data.forEach(function (d) {
          columns.push(d.value);
        });

        if ( ! $('#chart-' + $attr.synCharts).length ) {
          return console.error('chart not found #chart-' + $attr.synCharts);
        }

        console.log('criteria', $attr.synCharts);

        var chart = c3.generate({
            bindto: '#chart-' + $attr.synCharts,

            data: {
              columns: [
                columns
              ],

              type: 'bar'
            },
            
            axis: {
              
              y: {
                max: 90,

                show: false,

                tick: {
                  count: 5,

                  format: function (y) {
                    return y;
                  }
                }
              }
            },

            size: {
              height: 80
            }
        });
      }
    }
  };
};
