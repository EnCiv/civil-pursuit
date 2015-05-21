'use strict';

import Controller from 'syn/lib/app/Controller';
import EditAndGoAgain from 'syn/components/EditAndGoAgain/Controller';
import Nav from 'syn/lib/util/Nav';

class Details extends Controller {

  constructor (props, itemParent) {
    super();

    this.store = {
      item: null,
      details: null
    };

    if ( props.item ) {
      this.set('item', props.item);
    }

    this.props = props || {};

    this.itemParent = itemParent;

    this.template = itemParent.find('details');
  }

  find (name) {
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
  }

  render (cb) {
    let self = this;

    let d = this.domain;

    let item = this.get('item');

    this.find('promoted bar')
      .goalProgress({
        goalAmount        :   100,
        currentAmount     :   Math.floor(item.promotions * 100 / item.views),
        textBefore        :   '',
        textAfter         :   '%'
      });

    this.find('toggle edit and go again').on('click', function () {
      NavProvider.unreveal(self.template, self.itemParent.template, d.intercept(function () {
        if ( self.item.find('editor').find('form').length ) {
          console.warn('already loaded')
        }

        else {
          var edit = new EditComponent(self.item);
            
          edit.get(d.intercept(function (template) {

            self.itemParent.find('editor').find('.is-section').append(template);

            NavProvider.reveal(self.item.find('editor'), self.item.template,
              d.intercept(function () {
                NavProvider.show(template, d.intercept(function () {
                  edit.render();
                }));
              }));
          }));

        }

      }));
    });

    if ( this.socket.synuser ) {
      $('.is-in').removeClass('is-in');
    }

    if ( ! self.details ) {
      this.fetch();
    }
  }

  votes () {
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
  }

  feedback () {
    console.log('item has feedback?', this.get('item'));
  }

  fetch () {
    var self = this;

    let item = this.get('item');

    this
      .publish('get item details', item._id)

      .subscribe((pubsub, details) => {
        console.log('got item details', details);

        this.set('details', details);

        // Feedback

        details.feedbacks.forEach(feedback => {
          let tpl = $('<div class="pretext feedback"></div>');
          tpl.text(feedback.feedback);
          this.find('feedback list')
            .append(tpl)
            .append('<hr/>');

        });

        // // Votes

        // details.criterias.forEach(function (criteria, i) {
        //   self.find('votes').eq(i).find('h4').text(criteria.name);

        //   self.votes(criteria, self.find('votes').eq(i).find('svg'));
        // });
      });
  }

}

export default Details;
