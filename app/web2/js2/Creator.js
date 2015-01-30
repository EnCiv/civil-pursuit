! function () {

  'use strict';

  var Form      =   require('./Form');
  var Nav       =   require('./Nav');
  var Item      =   require('./Item');
  var Upload    =   require('./Upload');
  var YouTube   =   require('./YouTube');

  function Creator (panel) {

    if ( ! app ) {
      throw new Error('Missing app');
    }

    if ( panel.constructor.name !== 'Panel' ) {
      throw new Error('Creator: Panel must be a Panel object');
    }

    this.panel = panel;

    this.template = $('#' + this.panel.getId()).find('.creator:first');
  }

  Creator.prototype.find = function (name) {
    switch ( name ) {
      case 'create button':
        return this.template.find('.button-create:first');

      case 'form':
        return this.template.find('form');

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

  Creator.prototype.render = function (cb) {
    if ( ! this.template.length ) {
      return cb(new Error('Creator not found in panel ' + this.panel.getId()));  
    }

    var creator = this;

    creator.template.data('creator', this);

    Upload(creator.find('dropbox'));

    creator.template.find('textarea').autogrow();

    creator.find('reference').on('change', function () {

      var creator     =   $(this).closest('.creator').data('creator');

      var board       =   creator.find('reference board');
      var reference   =   $(this);

      board.removeClass('hide').text('Looking up');

      app.socket.emit('get url title', $(this).val(),
        function (error, ref) {
          if ( ref.title ) {
            
            board.text(ref.title);
            reference.data('title', ref.title);

            var yt = YouTube(ref.url);

            if ( yt ) {
              creator.find('dropbox').hide();

              creator.find('item media')
                .empty()
                .append(yt);
            }
          }
          else {
            board.text('Looking up')
              .addClass('hide');
          }
        });
    });

    var form = new Form(creator.template);
    
    form.send(function () {
      Nav.hide(creator.template, app.domain.intercept(function () {

        var new_item = creator.toItem();

        new_item.user = synapp.user;

        app.socket.emit('create item', new_item);

        app.socket.once('could not create item', app.domain.intercept());

        app.socket.once('created item', function (item) {

          if ( new_item.upload ) {
            item.upload = new_item.upload;
          }

          if ( new_item.youtube ) {
            item.youtube = new_item.youtube;
          }

          var item  = new Item(item);

          var items = creator.panel.find('items');

          item.get(app.domain.intercept(function () {
            items.prepend(item.template);
            item.render(app.domain.intercept(function () {
              item.find('toggle promote').click();
            }));
          }));
        });

      }));
    });

    cb();
  };

  Creator.prototype.toItem = function () {
    var item = {
      type:         this.panel.type,
      subject:      this.find('subject').val(),
      description:  this.find('description').val()
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

  module.exports = Creator;

} ();
