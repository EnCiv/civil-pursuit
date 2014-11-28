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

                //svg.chart(id='chart-{{item._id}}-{{criteria._id}}')

                var svg = $('<svg class="chart"></svg>');

                svg.attr('id', 'chart-' + $scope.item._id + '-' + $scope.criteria._id);

                $elem.empty().append(svg);

                var data = [];

                for ( var number in votes[0].criterias[criteria].values ) {
                  data.push({
                    label: 'number',
                    value: votes[0].criterias[criteria].values[number] * 100 / votes[0].criterias[criteria].total
                  });
                }                

                var columns = ['votes'];

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
                      x: {},
                      
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
                    },

                    bar: {
                      width: $(window).width() / 5
                    }
                });

                $timeout(function () {
                  $elem.find('.c3-chart-bar:first').hide();
                });
              }

              else {
                $elem.find('svg').css('height', '0');
              }
            }

          }
        });
      }
    };
  }

})();
