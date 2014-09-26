// .synapp-util-charts(data-criteria)

module.exports = function ($timeout) {
  return {
    restrict: 'C',

    link: function ($scope, $elem, $attr) {

      if ( $attr.criteria ) {
        $timeout(chart, 1000);
      }

      var t1 = 0;

      function chart () {

        if ( ! $scope.$parent.votes ) {
          t1 ++;
          if ( t1 < 10 ) {
            return;
          }
          return $timeout(chart, 1000);
        }

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
