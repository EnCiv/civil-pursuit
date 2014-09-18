// .synapp-util-charts(data-criteria)

module.exports = function ($timeout) {
  return {
    restrict: 'C',

    link: function ($scope, $elem, $attr) {

      if ( $attr.criteria ) {
        $timeout(chart);
      }

      function chart () {

        var votes = $scope.$parent.votes[$attr.criteria];

        if ( ! votes ) {
          return console.error('no votes');
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

        if ( ! $('#chart-' + $attr.criteria).length ) {
          return console.error('chart not found #chart-' + $attr.criteria);
        }

        console.log('criteria', $attr.criteria);

        var chart = c3.generate({
            bindto: '#chart-' + $attr.criteria,

            data: {
              columns: [
                columns
              ],

              type: 'bar'
            },
            
            axis: {
              x: {
                tick: {
                  centered: false,
                  fit: false
                }
              },
              
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


            grid: {

              y: {
                lines: [
                  {
                    value: 25,
                    text: '25%'
                  },
                  {
                    value: 50,
                    text: '50%'
                  },
                  {
                    value: 75,
                    text: '75%'
                  }
                ]
              }
            }
        });
      }
    }
  };
};