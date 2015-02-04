/*
 *  ******************************************************
 *  ******************************************************
 *  ******************************************************
 *  ******************************************************
 *  ******************************************************
 
 *  PROMOTE

 *  ******************************************************
 *  ******************************************************
 *  ******************************************************
 *  ******************************************************
 *  ******************************************************
 *  ******************************************************
*/

! function () {

  'use strict';

  var Item = require('./Item');

  var Nav = require('./Nav');

  /**
   *  @class Promote
   *  @arg {Item} item
   */

  function Promote (item) {
    if ( ! app ) {
      throw new Error('Missing app');
    }

    var self = this;

    app.domain.run(function () {
      if ( ! item || ( ! item instanceof require('./Item') ) ) {
        throw new Error('Item must be an Item');
      }

      self.item = item;

      self.template = item.find('promote');

      if ( ! self.template.length ) {
        throw new Error('Template not found');
      }

      self.watch = new (require('events').EventEmitter)();

      self.$bind('limit', self.renderLimit.bind(self));

      self.$bind('cursor', self.renderCursor.bind(self));

      self.$bind('left', self.renderLeft.bind(self));

      self.$bind('right', self.renderRight.bind(self));
    });
      
  }

  /**
   *  @method find
   *  @arg {string} name
   *  @arg {Mixed} more
   */

  Promote.prototype.find = function (name, more) {
    switch ( name ) {
      case 'cursor':
        return this.template.find('.cursor');

      case 'limit':
        return this.template.find('.limit');

      case 'side by side':
        return this.template.find('.items-side-by-side');

      case 'finish button':
        return this.template.find('.finish');

      case 'item subject':
        return this.find('side by side').find('.subject.' + more + '-item h3');

      case 'item description':
        return this.find('side by side').find('.is-des.' + more + '-item .description');

      case 'sliders':
        return this.find('side by side').find('.sliders.' + more + '-item');

      case 'item image':
        return this.find('side by side').find('.image.' + more + '-item');

      case 'item feedback':
        return this.find('side by side').find('.' + more + '-item .feedback');

      case 'promote button':
        return this.find('side by side').find('.' + more + '-item .promote');
    }
  };

  /**
   *  @method renderLimit
   */

  Promote.prototype.renderLimit = function () {
    this.find('limit').text(this.evaluation.limit);
  };

  /**
   *
   */

  Promote.prototype.renderCursor = function () {
    this.find('cursor').text(this.evaluation.cursor);
  };

  /**
   *
   */

  Promote.prototype.renderLeft = function () {
    this.renderItem('left');
  };

  /**
   *
   */

  Promote.prototype.renderRight = function () {
    this.renderItem('right');
  };

  /**
   *
   */

  Promote.prototype.renderItem = function (hand) {
    var promote = this;

    if ( ! this.evaluation[hand] ) {
      this.find('item subject', hand).hide();
      this.find('item description', hand).hide();

      return;
    }

    // Increment views counter

    app.socket.emit('add view', this.evaluation[hand]._id);

    // Subject

    this.find('item subject', hand).text(this.evaluation[hand].subject);

    // Description

    this.find('item description', hand).text(this.evaluation[hand].description);

    // Image

    this.find('item image', hand).empty().append(
      new (require('./Item'))(this.evaluation[hand]).media());

    // Sliders

    promote.find('sliders', hand).find('h4').each(function (i) {
      var cid = i;

      if ( cid > 3 ) {
        cid -= 4;
      }

      promote.find('sliders', hand).find('h4').eq(i).text(promote.evaluation.criterias[cid].name);
      promote.find('sliders', hand).find('input').eq(i).data('criteria', promote.evaluation.criterias[cid]._id);
    });

    // Promote button

    promote.find('promote button', hand)
      .text(this.evaluation[hand].subject)
      .off('click')
      .on('click', function () {

        var left = $(this).closest('.left-item').length;

        var opposite = left ? 'right' : 'left';

        Nav.scroll(promote.template, app.domain.intercept(function () {

          // If cursor is smaller than limit, then keep on going
        
          if ( promote.evaluation.cursor < promote.evaluation.limit ) {

            promote.edit('cursor', promote.evaluation.cursor + 1);

            app.socket.emit('promote', promote.evaluation[left ? 'left' : 'right']._id);

            promote.save(left ? 'left' : 'right');

            $.when(
              promote
                .find('side by side')
                .find('.' + opposite + '-item')
                .animate({
                  opacity: 0
                })
            )
              .then(function () {
                promote.edit(opposite, promote.evaluation.items[promote.evaluation.cursor]);

                promote
                  .find('side by side')
                  .find('.' + opposite + '-item')
                  .animate({
                    opacity: 1
                  });
              });
          }

          // If cursor equals limit, means end of evaluation cycle

          else {

            promote.finish();

          }

        }));
      });
  };

  /**
   *
   */

  Promote.prototype.render = function (cb) {
    var promote = this;

    if ( ! this.evaluation ) {
      app.socket.emit('get evaluation', this.item.item);

      app.socket.once('got evaluation', function (evaluation) {
        console.log('got evaluation', evaluation);

        promote.evaluation = evaluation;

        promote.edit('limit', 5);

        promote.edit('cursor', 1);

        promote.edit('left', evaluation.items[0]);

        promote.edit('right', evaluation.items[1]);

        promote.find('finish button').on('click', function () {
          Nav.scroll(promote.template, app.domain.intercept(function () {

            if ( promote.evaluation.cursor < promote.evaluation.limit ) {
              

              promote.save('left');

              promote.save('right');

              $.when(
                promote
                  .find('side by side')
                  .find('.left-item, .right-item')
                  .animate({
                    opacity: 0
                  })
              )
                .then(function () {
                  promote.edit('cursor', promote.evaluation.cursor + 1);

                  promote.edit('left', promote.evaluation.items[promote.evaluation.cursor]);

                  promote.edit('cursor', promote.evaluation.cursor + 1);

                  promote.edit('right', promote.evaluation.items[promote.evaluation.cursor]);

                  promote
                    .find('side by side')
                    .find('.left-item')
                    .animate({
                      opacity: 1
                    });

                  promote
                    .find('side by side')
                    .find('.right-item')
                    .animate({
                      opacity: 1
                    });
                });
            }

            else {

              promote.finish();

            }

          }));
        });
      });
    }
  };

  /**
   *  @method finish
   */

  Promote.prototype.finish = function () {
    var promote = this;

    promote.find('promote button').off('click');
    promote.find('finish button').off('click');

    if ( promote.evaluation.left ) {
      this.save('left');
    }

    if ( promote.evaluation.right ) {
      this.save('right');
    }

    Nav.unreveal(promote.template, promote.item.template,
      app.domain.intercept(function () {

        promote.item.details.get();

        promote.item.find('toggle details').click();

        promote.item.find('details').find('.feedback-pending')
          .removeClass('hide');

        promote.evaluation = null;
      }));
  };

  /**
   *
   */

  Promote.prototype.edit = function (key, value) {
    this.evaluation[key] = value;

    this.watch.emit(key);
  };

  /**
   *
   */

  Promote.prototype.$bind = function (key, binder) {
    this.watch.on(key, binder);
  };

  /**
   *
   */

  Promote.prototype.save = function (hand) {

    var promote = this;
   
    // feedback

    var feedback = promote.find('item feedback', hand);

    if ( feedback.val() ) {
      app.socket.emit('insert feedback', {
        item: promote.evaluation[hand]._id,
        user: synapp.user,
        feedback: feedback.val()
      });

      feedback.val('');
    }

    // votes

    var votes = [];

    promote.template
      .find('.items-side-by-side:visible .' +  hand + '-item input[type="range"]:visible')
      .each(function () {
        var vote = {
          item: promote.evaluation[hand]._id,
          user: synapp.user,
          value: +$(this).val(),
          criteria: $(this).data('criteria')
        };

        votes.push(vote);
      });

    app.socket.emit('insert votes', votes);
  };

  module.exports = Promote;

} ();
