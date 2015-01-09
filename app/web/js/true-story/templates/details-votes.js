! function () {

  'use strict';

  module.exports = {
    template: '.votes-by-criteria',

    controller: function (view, details) {
      setTimeout(function () {
        details.criterias.forEach(function (criteria) {
          view.find('h4').text(criteria.name);

          var vote = details.votes[criteria._id];

          var svg = $('<svg class="chart"></svg>');

          svg.attr('id', 'chart-' + details.item._id + '-' + criteria._id);

          console.log('svg!', svg.attr('id'))

          view.find('.chart').append(svg);

          var data = [];

          for ( var number in vote.values ) {
            data.push({
              label: 'number',
              value: vote.values[number] * 100 / vote.total
            });
          }

          var columns = ['votes'];

          data.forEach(function (d) {
            columns.push(d.value);
          });

          var chart = c3.generate({
            bindto: '#' + svg.attr('id'),

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
        });
      }, 1500);
    }
  };

} ();
