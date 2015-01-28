! function () {

  'use strict';

  function detailsVotes (details, criteria) {

    return function (view) {
      setTimeout(function () {

        view.find('h4').text(criteria.name);

        var vote = details.votes[criteria._id];

        var svg = $('<svg class="chart"></svg>');

        svg.attr('id', 'chart-' + details.item._id + '-' + criteria._id);

        console.log('svg!', svg.attr('id'))

        view.find('.chart').append(svg);

        var data = [];

        // If no votes, show nothing

        if ( ! vote ) {
          return view.empty();
        }

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
      }, 800);
    };
  }

  module.exports = detailsVotes;

} ();
