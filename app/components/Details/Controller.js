! function _DetailsComponent_ () {

  'use strict';

  var EditComponent     =   require('syn/components/EditAndGoAgain/Controller');

  var NavProvider       =   require('syn/lib/util/Nav');

  /**
   *  @class            DetailsComponent
   *  @arg              {ItemComponent} item
   */

  function DetailsComponent(item) {

    if ( ! app ) {
      throw new Error('Missing app');
    }

    var self = this;

    app.domain.run(function () {
      if ( ! item || ( ! item instanceof require('syn/components/Item/Controller') ) ) {
        throw new Error('Item must be an Item');
      }

      self.item = item;

      self.template = item.find('details');

      if ( ! self.template.length ) {
        throw new Error('Details template not found');
      }
    });
  }

  /**
   *  @method           
   *  @description      DOM selectors abstractions
   *  @return           null
   *  @arg              {string} name
   */

  DetailsComponent.prototype.find = function (name) {
    switch ( name ) {
      case 'promoted bar':
        return this.template.find('.progress');

      case 'feedback list':
        return this.template.find('.feedback-list');

      case 'votes':
        return this.template.find('.details-votes');

      case 'toggle edit and go again':
        return this.template.find('.edit-and-go-again-toggler');
    }
  };

  /**
   *  @method
   *  @description          DOM manipulation
   *  @arg                  {function} cb
   */

  DetailsComponent.prototype.render = function (cb) {
    var self = this;

    var item = self.item.item;

    self.find('promoted bar')
      .goalProgress({
        goalAmount        :   100,
        currentAmount     :   Math.floor(item.promotions * 100 / item.views),
        textBefore        :   '',
        textAfter         :   '%'
      });

    self.find('toggle edit and go again').on('click', function () {
      NavProvider.unreveal(self.template, self.item.template, app.domain.intercept(function () {
        if ( self.item.find('editor').find('form').length ) {
          console.warn('already loaded')
        }

        else {
          var edit = new EditComponent(self.item);
            
          edit.get(app.domain.intercept(function (template) {

            self.item.find('editor').find('.is-section').append(template);

            NavProvider.reveal(self.item.find('editor'), self.item.template,
              app.domain.intercept(function () {
                NavProvider.show(template, app.domain.intercept(function () {
                  edit.render();
                }));
              }));
          }));

        }

      }));
    });

    if ( app.socket.synuser ) {
      $('.is-in').removeClass('is-in');
    }

    if ( ! self.details ) {
      this.get();
    }
  };

  /**
   *  @method
   *  @description    Display votes using c3.js
   *  @arg            {object} criteria
   *  @arg            {HTMLElement} svg
   */

  DetailsComponent.prototype.votes = function (criteria, svg) {
    var self = this;

    setTimeout(function () {
      var vote = self.details.votes[criteria._id];

      svg.attr('id', 'chart-' + self.details.item._id + '-' + criteria._id);

      var data = [];

      // If no votes, show nothing

      if ( ! vote )   {
        vote        = {
          values    : {
            '-1'    : 0,
            '0'     : 0,
            '1'     : 0
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
        bindto        :   '#' + svg.attr('id'),
        data          :   {
          x           :   'x',
          columns     :   [['x', -1, 0, 1], columns],
          type        :   'bar'
        },
        grid          :   {
          x           :   {
            lines     :   3
          }
        },
        axis          :   {
          x           :   {},
          y           :   {
            max       :   90,
            show      :   false,
            tick      :   {
              count   :   5,
              format  :   function (y) {
                return y;
              }
            }
          }
        },
        size          :   {
          height      :   80
        },
        bar           :   {
          width       :   $(window).width() / 5
        }
      });
    
    }, 250);
  };

  /**
   *
   */

  DetailsComponent.prototype.get = function () {

    var self = this;

    app.socket.publish('get item details', self.item.item._id, function (details) {

      console.log('got item details', details);

      self.details = details;

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
  };

  module.exports = DetailsComponent;

} ();
