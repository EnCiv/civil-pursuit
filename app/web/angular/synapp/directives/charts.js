;(function () {

  module.exports = ['$timeout', Charts];

  function Charts ($timeout) {
    return {
      restrict: 'CA',

      link: function ($scope, $elem, $attr) {

        var t1 = 0;

        var item = $scope.$parent.item._id;

        var criteria = $scope.criteria._id;

        var loaded = false;

        $scope.$root.$watch('votes', function (votes, _votes) {
          if ( votes && votes.length ) {

            if ( ! loaded ) {
              loaded = true;

              votes = votes.filter(function (vote) {
                return ( vote.item === item );
              });

              if ( votes.length && votes[0].criterias[criteria] ) {

                var data = [];

                for ( var number in votes[0].criterias[criteria].values ) {
                  data.push({
                    label: 'number',
                    value: votes[0].criterias[criteria].values[number] * 100 / votes[0].criterias[criteria].total
                  });
                }

                

                var columns = [votes[0].criterias[criteria].total + ' vote' +
                  (votes[0].criterias[criteria].total > 1 && 's' || '')];

                data.forEach(function (d) {
                  columns.push(d.value);
                });

                console.log('columns', columns);

                var chart = c3.generate({
                    bindto: '#' + $elem.find('svg').attr('id'),

                    data: {
                      x: 'x',
                      columns: [['x', -1, 0, 1], columns],
                      type: 'bar'
                    },

                    grid: {
                      x: {
                        lines: 3
                      }
                    },
                    
                    axis: {
                      x: {
                        
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

                    size: {
                      height: 80
                    }
                });
              }

              else {
                $elem.find('svg').css('height', '0');
              }
            }

          }
        });

        return;

        $timeout(chart, 1000);

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
  }

})();
