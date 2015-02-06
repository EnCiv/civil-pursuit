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
  var Edit = require('./Edit');

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

      case 'item persona':
        return this.find('side by side').find('.persona.' + more + '-item');

      case 'item persona image':
        return this.find('item persona', more).find('img');

      case 'item persona name':
        return this.find('item persona', more).find('.user-full-name');

      case 'item feedback':
        return this.find('side by side').find('.' + more + '-item .feedback');

      case 'promote button':
        return this.find('side by side').find('.' + more + '-item .promote');

      case 'promote label':
        return this.find('side by side').find('.promote-label');

      case 'edit and go again button':
        return this.find('side by side').find('.' + more + '-item .edit-and-go-again-toggle');
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

    var reverse = hand === 'left' ? 'right' : 'left';

    if ( ! this.evaluation[hand] ) {
      this.find('item subject', hand).hide();
      this.find('item description', hand).hide();
      this.find('item feedback', hand).hide();
      this.find('sliders', hand).hide();
      this.find('promote button', hand).hide();
      this.find('promote label').hide();
      this.find('edit and go again button', hand).hide();
      this.find('promote button', reverse).hide();
      this.find('edit and go again button', reverse).hide();
      // this.find('finish button').hide();
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
      promote.find('sliders', hand).find('input').eq(i)
        .val(0)
        .data('criteria', promote.evaluation.criterias[cid]._id);
    });

    // Persona

    promote.find('item persona image', hand).attr('src', promote.evaluation[hand].user.image);

    promote.find('item persona name', hand).text(promote.evaluation[hand].user.first_name);

    // Feedback

    promote.find('item feedback', hand).val('');

    // Feedback - remove any marker from previous post / see #164

    promote.find('item feedback', hand).removeClass('do-not-save-again');

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
  
    // Edit and go again

    promote.find('edit and go again button', hand).on('click', function () {
      Nav.unreveal(promote.template, promote.item.template, app.domain.intercept(function () {
        return;

        if ( self.item.find('editor').find('form').length ) {
          console.warn('already loaded')
        }

        else {
          var edit = new Edit(self.item);
            
          edit.get(app.domain.intercept(function (template) {

            self.item.find('editor').find('.is-section').append(template);

            Nav.reveal(self.item.find('editor'), self.item.template,
              app.domain.intercept(function () {
                Nav.show(template, app.domain.intercept(function () {
                  edit.render();
                }));
              }));
          }));

        }

      }));
    });

  };

  /**
   *  @method
   *  @arg {function} cb
   */

  Promote.prototype.render = function (cb) {
    var promote = this;

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
              }, 1000)
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
                }, 1000);

              promote
                .find('side by side')
                .find('.right-item')
                .animate({
                  opacity: 1
                }, 1000);
            });
        }

        else {

          promote.finish();

        }

      }));
    });
  };

  Promote.prototype.get = function (cb) {
    var promote = this;

    if ( ! this.evaluation ) {

      // Get evaluation via sockets

      app.socket.emit('get evaluation', this.item.item._id);

      app.socket.once('got evaluation', function (evaluation) {
        console.log('got evaluation', evaluation);

        promote.evaluation = evaluation;

        var limit = 5;

        if ( evaluation.items.length < 6 ) {
          limit = evaluation.items.length - 1;

          if ( ! evaluation.limit && evaluation.items.length === 1 ) {
            limit = 1;
          }
        }

        promote.edit('limit', limit);

        promote.edit('cursor', 1);

        promote.edit('left', evaluation.items[0]);

        promote.edit('right', evaluation.items[1]);

        cb();

      });
    }

    else {
      cb();
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

      if ( ! feedback.hasClass('do-not-save-again') ) {
        app.socket.emit('insert feedback', {
          item: promote.evaluation[hand]._id,
          user: synapp.user,
          feedback: feedback.val()
        });

        feedback.addClass('do-not-save-again');
      }

      // feedback.val('');
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
