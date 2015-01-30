! function () {

  'use strict';

  function Details(item) {
    if ( ! app ) {
      throw new Error('Missing app');
    }

    var self = this;

    app.domain.run(function () {
      if ( ! item || item.constructor.name !== 'Item' ) {
        throw new Error('Item must be an Item');
      }

      self.item = item;

      self.template = item.find('details');

      if ( ! self.template.length ) {
        throw new Error('Template not found');
      }
    });
  }

  Details.prototype.find = function (name) {
    switch ( name ) {
      case 'promoted bar':
        return this.template.find('.progress-bar');

      case 'feedback list':
        return this.template.find('.feedback-list');

      case 'votes':
        return this.template.find('.details-votes');
    }
  };

  Details.prototype.render = function (cb) {
    var self = this;

    var item = self.item.item;

    self.find('promoted bar')
      .css('width', Math.floor(item.promotions * 100 / item.views) + '%')
      .text(Math.floor(item.promotions * 100 / item.views) + '%');

    if ( synapp.user ) {
      $('.is-in').removeClass('is-in');
    }

    if ( ! self.details ) {
      app.socket.emit('get item details', self.item.item._id);

      app.socket.once('got item details', function (details) {
        self.details = details;

        console.log('details', details)

        // Feedback

        details.feedbacks.forEach(function (feedback) {
          var tpl = $('<div class="pretext feedback"></div>');
          tpl.text(feedback.feedback);
          self.find('feedback list')
            .append(tpl)
            .append('<hr/>');

        });

        // Votes

        details.criterias.forEach(function (criteria, i) {
          self.find('votes').eq(i).find('h4').text(criteria.name);

          self.votes(criteria, self.find('votes').eq(i).find('svg'));
        });

      });
    }
  };

  Details.prototype.votes = function (criteria, svg) {
    var self = this;

    setTimeout(function () {

      var vote = self.details.votes[criteria._id];

      svg.attr('id', 'chart-' + self.details.item._id + '-' + criteria._id);

      var data = [];

      // If no votes, show nothing

      if ( ! vote ) {
        vote = {
          values: {
            '-1': 0,
            '0': 0,
            '1': 0
          },
          total: 0
        }
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
      }, 250);
  };

  module.exports = Details;

} ();
