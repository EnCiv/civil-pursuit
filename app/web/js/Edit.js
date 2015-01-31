/*
 *  ******************************************************
 *  ******************************************************
 *  ******************************************************
 *  ******************************************************
 *  ******************************************************
 
 *  EDIT

 *  ******************************************************
 *  ******************************************************
 *  ******************************************************
 *  ******************************************************
 *  ******************************************************
 *  ******************************************************
*/

! function () {

  'use strict';

  var Nav       =   require('./Nav');
  var Creator   =   require('./Creator');
  var Item      =   require('./Item');

  /**
   *  @class
   *
   *  @arg {String} type
   *  @arg {String?} parent
   */

  function Edit (item) {

    console.log('EDIT', item)

    if ( ! app ) {
      throw new Error('Missing app');
    }

    var self = this;

    app.domain.run(function () {
      if ( ! item || ( ! item instanceof require('./Item') ) ) {
        throw new Error('Item must be an Item');
      }

      self.item = item;
    });
  }

  Edit.prototype.get = function (cb) {
    var edit = this;

    $.ajax({
      url: '/partial/creator'
    })

      .error(cb)

      .success(function (data) {
        edit.template = $(data);

        cb(null, edit.template);
      });

    return this;
  };

  Edit.prototype.find = function (name) {
    switch ( name ) {
      case 'create button':
        return this.template.find('.button-create:first');

      case 'dropbox':
        return this.template.find('.drop-box');

      case 'subject':
        return this.template.find('[name="subject"]');

      case 'description':
        return this.template.find('[name="description"]');

      case 'item media':
        return this.template.find('.item-media');

      case 'reference':
        return this.template.find('.reference');

      case 'reference board':
        return this.template.find('.reference-board');
    }
  };

  Edit.prototype.render = function (cb) {

    var edit = this;

    // this.template.find('textarea').autogrow();

    this.template.find('[name="subject"]').val(edit.item.item.subject);
    this.template.find('[name="description"]')
      .val(edit.item.item.description)
      .autogrow();

    if ( edit.item.item.references.length ) {
      this.template.find('[name="reference"]').val(edit.item.item.references[0].url);
    }

    this.template.find('.item-media')
      .empty()
      .append(edit.item.media());

    this.template.on('submit', function () {

      edit.save();

      return false;
    });

    return this;
  };

  Edit.prototype.save = function () {
    var edit = this;

    console.log(edit.toItem());

    Nav.hide(edit.template, app.domain.intercept(function () {
      Nav.hide(edit.template.closest('.editor'), app.domain.intercept(function () {
        
        var new_item = edit.toItem();

        app.socket.emit('create item', new_item);

        app.socket.once('could not create item', function (error) {
          console.error(error)
        });
        
        app.socket.once('created item', function (item) {
          console.log('created item', item);

            if ( new_item.upload ) {
              item.upload = new_item.upload;
            }

            if ( new_item.youtube ) {
              item.youtube = new_item.youtube;
            }

            var item  = new (require('./Item'))(item);

            item.get(app.domain.intercept(function () {
              item.template.insertBefore(edit.item.template);
              
              item.render(app.domain.intercept(function () {
                item.find('toggle promote').click();
              }));
            }));
        });
      }));
    }));
  };

  Edit.prototype.toItem = function () {
    var item = {
      from:         this.item.item._id,
      subject:      this.find('subject').val(),
      description:  this.find('description').val(),
      user:         synapp.user,
      type:         this.item.item.type
    };

    if ( this.find('item media').find('img').length ) {

      if ( this.find('item media').find('.youtube-preview').length ) {
        item.youtube = this.find('item media').find('.youtube-preview').data('video');
      }

      else {
        item.upload = this.find('item media').find('img').attr('src');
      }
    }
 
    return item;
  };

  module.exports = Edit;

} ();
